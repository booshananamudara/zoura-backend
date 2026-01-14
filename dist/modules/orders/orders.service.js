"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const product_entity_1 = require("../commerce/entities/product.entity");
const order_status_enum_1 = require("./enums/order-status.enum");
let OrdersService = class OrdersService {
    orderRepository;
    orderItemRepository;
    cartRepository;
    productRepository;
    dataSource;
    constructor(orderRepository, orderItemRepository, cartRepository, productRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.dataSource = dataSource;
    }
    async createOrder(user) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cart = await this.cartRepository.findOne({
                where: { user: { id: user.id } },
                relations: ['items', 'items.product'],
            });
            if (!cart || cart.items.length === 0) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            const order = queryRunner.manager.create(order_entity_1.Order, {
                user,
                total_amount: 0,
                status: order_status_enum_1.OrderStatus.PENDING,
            });
            await queryRunner.manager.save(order_entity_1.Order, order);
            let totalAmount = 0;
            const orderItems = [];
            for (const cartItem of cart.items) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                    where: { id: cartItem.product.id },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${cartItem.product.name} not found`);
                }
                if (product.stock < cartItem.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`);
                }
                const orderItem = queryRunner.manager.create(order_item_entity_1.OrderItem, {
                    order,
                    product,
                    quantity: cartItem.quantity,
                    price_at_purchase: parseFloat(cartItem.price_at_add.toString()),
                });
                await queryRunner.manager.save(order_item_entity_1.OrderItem, orderItem);
                product.stock -= cartItem.quantity;
                await queryRunner.manager.save(product_entity_1.Product, product);
                totalAmount += parseFloat(cartItem.price_at_add.toString()) * cartItem.quantity;
                orderItems.push(orderItem);
            }
            order.total_amount = totalAmount;
            await queryRunner.manager.save(order_entity_1.Order, order);
            await queryRunner.manager.remove(cart.items);
            cart.total_price = 0;
            await queryRunner.manager.save(cart_entity_1.Cart, cart);
            await queryRunner.commitTransaction();
            const savedOrder = await this.orderRepository.findOne({
                where: { id: order.id },
                relations: ['items', 'items.product', 'items.product.vendor'],
            });
            if (!savedOrder) {
                throw new Error('Order was created but could not be retrieved');
            }
            return savedOrder;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getOrderHistory(user) {
        return this.orderRepository.find({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product'],
            order: { created_at: 'DESC' },
        });
    }
    async getOrderById(user, orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, user: { id: user.id } },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.status = status;
        return this.orderRepository.save(order);
    }
    async getVendorOrders(vendorId) {
        const orderItems = await this.orderItemRepository.find({
            where: {
                product: {
                    vendor: { id: vendorId }
                }
            },
            relations: ['order', 'order.user', 'product'],
            order: { created_at: 'DESC' },
        });
        const ordersMap = new Map();
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
    async updateVendorOrderStatus(vendorId, orderId, status) {
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
            throw new common_1.NotFoundException('Order not found or you do not have products in this order');
        }
        if (status !== order_status_enum_1.OrderStatus.SHIPPED && status !== order_status_enum_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Vendors can only update status to SHIPPED or DELIVERED');
        }
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.status = status;
        return this.orderRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map