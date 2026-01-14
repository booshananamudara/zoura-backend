import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../commerce/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private dataSource: DataSource,
    ) { }

    /**
     * Create order from user's cart (Checkout)
     * Transactional operation: Creates order, deducts stock, clears cart
     */
    async createOrder(user: User): Promise<Order> {
        // Use transaction to ensure atomicity
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Fetch user's cart with items
            const cart = await this.cartRepository.findOne({
                where: { user: { id: user.id } },
                relations: ['items', 'items.product'],
            });

            if (!cart || cart.items.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            // Create order
            const order = queryRunner.manager.create(Order, {
                user,
                total_amount: 0,
                status: OrderStatus.PENDING,
            });

            // Save order first to get ID
            await queryRunner.manager.save(Order, order);

            let totalAmount = 0;
            const orderItems: OrderItem[] = [];

            // Process each cart item
            for (const cartItem of cart.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: cartItem.product.id },
                });

                if (!product) {
                    throw new NotFoundException(
                        `Product ${cartItem.product.name} not found`,
                    );
                }

                // Check stock availability
                if (product.stock < cartItem.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
                    );
                }

                // Create order item
                const orderItem = queryRunner.manager.create(OrderItem, {
                    order,
                    product,
                    quantity: cartItem.quantity,
                    price_at_purchase: parseFloat(cartItem.price_at_add.toString()),
                });

                // Save order item
                await queryRunner.manager.save(OrderItem, orderItem);

                // Deduct stock
                product.stock -= cartItem.quantity;
                await queryRunner.manager.save(Product, product);

                // Calculate total
                totalAmount += parseFloat(cartItem.price_at_add.toString()) * cartItem.quantity;

                orderItems.push(orderItem);
            }

            // Update order total amount
            order.total_amount = totalAmount;
            await queryRunner.manager.save(Order, order);

            // Clear cart
            await queryRunner.manager.remove(cart.items);
            cart.total_price = 0;
            await queryRunner.manager.save(Cart, cart);

            // Commit transaction
            await queryRunner.commitTransaction();

            // Return order with relations
            const savedOrder = await this.orderRepository.findOne({
                where: { id: order.id },
                relations: ['items', 'items.product', 'items.product.vendor'],
            });

            if (!savedOrder) {
                throw new Error('Order was created but could not be retrieved');
            }

            return savedOrder;
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    /**
     * Get user's order history
     */
    async getOrderHistory(user: User): Promise<Order[]> {
        return this.orderRepository.find({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product'],
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Get specific order by ID
     */
    async getOrderById(user: User, orderId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, user: { id: user.id } },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    /**
     * Update order status (for admin/vendor use)
     */
    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
    ): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;
        return this.orderRepository.save(order);
    }

    /**
     * Get orders containing products from a specific vendor
     */
    async getVendorOrders(vendorId: string): Promise<any[]> {
        // Find all order items where the product belongs to this vendor
        const orderItems = await this.orderItemRepository.find({
            where: {
                product: {
                    vendor: { id: vendorId }
                }
            },
            relations: ['order', 'order.user', 'product'],
            order: { created_at: 'DESC' },
        });

        // Group order items by order
        const ordersMap = new Map<string, any>();

        for (const item of orderItems) {
            if (!ordersMap.has(item.order.id)) {
                ordersMap.set(item.order.id, {
                    id: item.order.id,
                    status: item.order.status,
                    total_amount: item.order.total_amount,
                    created_at: item.order.created_at,
                    customer: {
                        id: item.order.user.id,
                        name: item.order.user.name,
                        email: item.order.user.email,
                    },
                    items: [],
                    vendor_total: 0,
                });
            }

            const order = ordersMap.get(item.order.id);
            const itemTotal = parseFloat(item.price_at_purchase.toString()) * item.quantity;
            order.items.push({
                id: item.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: item.price_at_purchase,
                total: itemTotal,
            });
            order.vendor_total += itemTotal;
        }

        return Array.from(ordersMap.values());
    }

    /**
     * Update order status by vendor (validates vendor owns products in order)
     */
    async updateVendorOrderStatus(
        vendorId: string,
        orderId: string,
        status: OrderStatus,
    ): Promise<Order> {
        // Verify vendor has products in this order
        const vendorItems = await this.orderItemRepository.find({
            where: {
                order: { id: orderId },
                product: {
                    vendor: { id: vendorId }
                }
            },
            relations: ['product', 'product.vendor'],
        });

        if (vendorItems.length === 0) {
            throw new NotFoundException('Order not found or you do not have products in this order');
        }

        // Only allow SHIPPED and DELIVERED status updates
        if (status !== OrderStatus.SHIPPED && status !== OrderStatus.DELIVERED) {
            throw new BadRequestException('Vendors can only update status to SHIPPED or DELIVERED');
        }

        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;
        return this.orderRepository.save(order);
    }
}

