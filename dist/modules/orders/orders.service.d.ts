import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { User } from '../auth/entities/user.entity';
import { OrderStatus } from './enums/order-status.enum';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private cartRepository;
    private productRepository;
    private variantRepository;
    private dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, cartRepository: Repository<Cart>, productRepository: Repository<Product>, variantRepository: Repository<ProductVariant>, dataSource: DataSource);
    createOrder(user: User, shippingAddress?: {
        street: string;
        city: string;
        postalCode: string;
        phone: string;
    }, paymentMethod?: string): Promise<Order>;
    getOrderHistory(user: User): Promise<Order[]>;
    getOrderById(user: User, orderId: string): Promise<Order>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
    getVendorOrders(vendorId: string): Promise<any[]>;
    updateVendorOrderStatus(vendorId: string, orderId: string, status: OrderStatus): Promise<Order>;
}
