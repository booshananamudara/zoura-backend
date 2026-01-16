import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';
export interface ShippingAddress {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
}
export declare class Order {
    id: string;
    user: User;
    items: OrderItem[];
    total_amount: number;
    status: OrderStatus;
    shipping_address: ShippingAddress;
    payment_method: string;
    created_at: Date;
    updated_at: Date;
}
