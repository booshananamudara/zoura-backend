import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
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
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        private dataSource: DataSource,
    ) { }

    /**
     * Create order from user's cart (Checkout)
     * Transactional operation: Creates order, deducts stock from variants, clears cart
     */
    async createOrder(
        user: User,
        shippingAddress?: { street: string; city: string; postalCode: string; phone: string },
        paymentMethod: string = 'cash_on_delivery',
    ): Promise<Order> {
        // Use transaction to ensure atomicity
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Fetch user's cart with items including variants
            const cart = await this.cartRepository.findOne({
                where: { user: { id: user.id } },
                relations: ['items', 'items.product', 'items.variant'],
            });

            if (!cart || cart.items.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            // Create order with shipping address
            const order = queryRunner.manager.create(Order, {
                user,
                total_amount: 0,
                status: OrderStatus.PENDING,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
            });

            // Save order first to get ID
            await queryRunner.manager.save(Order, order);

            let totalAmount = 0;
            const orderItems: OrderItem[] = [];

            // Process each cart item
            for (const cartItem of cart.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: cartItem.product.id },
                    relations: ['variants'],
                });

                if (!product) {
                    throw new NotFoundException(
                        `Product ${cartItem.product.name} not found`,
                    );
                }

                // Get the variant to deduct stock from (optional for legacy products)
                let variant: ProductVariant | null = null;
                
                if (cartItem.variant) {
                    // Use the specific variant from cart
                    variant = await queryRunner.manager.findOne(ProductVariant, {
                        where: { id: cartItem.variant.id },
                    });
                } else if (product.variants && product.variants.length > 0) {
                    // Fall back to first variant
                    variant = product.variants[0];
                }

                // If variant exists, check and deduct stock from variant
                if (variant) {
                    if (variant.stock < cartItem.quantity) {
                        throw new BadRequestException(
                            `Insufficient stock for ${product.name}. Available: ${variant.stock}, Requested: ${cartItem.quantity}`,
                        );
                    }

                    // Deduct stock from variant
                    variant.stock -= cartItem.quantity;
                    await queryRunner.manager.save(ProductVariant, variant);
                }
                // Note: For legacy products without variants, we skip stock check

                // Create order item (variant is optional)
                const orderItem = queryRunner.manager.create(OrderItem, {
                    order,
                    product,
                    variant: variant || undefined,
                    quantity: cartItem.quantity,
                    price_at_purchase: parseFloat(cartItem.price_at_add.toString()),
                });

                // Save order item
                await queryRunner.manager.save(OrderItem, orderItem);

                // Calculate total
                totalAmount += parseFloat(cartItem.price_at_add.toString()) * cartItem.quantity;

                orderItems.push(orderItem);
            }

            // Update order total amount
            order.total_amount = totalAmount;
            await queryRunner.manager.save(Order, order);

            // Force delete all items belonging to this cart
            await queryRunner.manager.createQueryBuilder()
                .delete()
                .from(CartItem)
                .where("cartId = :cartId", { cartId: cart.id })
                .execute();

            // Reset cart total
            cart.total_price = 0;
            cart.items = []; // Clear local array to avoid confusion
            await queryRunner.manager.save(Cart, cart);

            // Commit transaction
            await queryRunner.commitTransaction();

            // Return order with relations
            const savedOrder = await this.orderRepository.findOne({
                where: { id: order.id },
                relations: ['items', 'items.product', 'items.variant', 'items.product.vendor'],
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
     * Includes variant info (color/size) and shipping address
     */
    async getVendorOrders(vendorId: string): Promise<any[]> {
        try {
            console.log('Fetching orders for vendor:', vendorId);
            
            // Use QueryBuilder for more reliable nested relation filtering
            const orderItems = await this.orderItemRepository
                .createQueryBuilder('orderItem')
                .leftJoinAndSelect('orderItem.order', 'order')
                .leftJoinAndSelect('order.user', 'user')
                .leftJoinAndSelect('orderItem.product', 'product')
                .leftJoinAndSelect('orderItem.variant', 'variant')
                .leftJoinAndSelect('product.vendor', 'vendor')
                .where('vendor.id = :vendorId', { vendorId })
                .orderBy('orderItem.created_at', 'DESC')
                .getMany();

            console.log('Found order items:', orderItems.length);

            // Group order items by order
            const ordersMap = new Map<string, any>();

            for (const item of orderItems) {
                // Skip items without valid order or product
                if (!item.order || !item.product) {
                    console.log('Skipping item with missing order or product');
                    continue;
                }

                if (!ordersMap.has(item.order.id)) {
                    ordersMap.set(item.order.id, {
                        id: item.order.id,
                        status: item.order.status,
                        total_amount: item.order.total_amount,
                        created_at: item.order.created_at,
                        shipping_address: item.order.shipping_address || null,
                        payment_method: item.order.payment_method || 'cash_on_delivery',
                        customer: item.order.user ? {
                            id: item.order.user.id,
                            name: item.order.user.name || 'Unknown',
                            email: item.order.user.email || 'N/A',
                        } : {
                            id: 'unknown',
                            name: 'Unknown Customer',
                            email: 'N/A',
                        },
                        items: [],
                        vendor_total: 0,
                    });
                }

                const order = ordersMap.get(item.order.id);
                const itemTotal = parseFloat(item.price_at_purchase?.toString() || '0') * item.quantity;
                order.items.push({
                    id: item.id,
                    product_name: item.product?.name || 'Unknown Product',
                    quantity: item.quantity,
                    price: item.price_at_purchase,
                    total: itemTotal,
                    variant: item.variant ? {
                        id: item.variant.id,
                        color: item.variant.color,
                        size: item.variant.size,
                        sku: item.variant.sku,
                    } : null,
                });
                order.vendor_total += itemTotal;
            }

            const result = Array.from(ordersMap.values());
            console.log('Returning orders:', result.length);
            return result;
        } catch (error) {
            console.error('Error fetching vendor orders:', error);
            throw error;
        }
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

