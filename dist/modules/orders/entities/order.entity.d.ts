import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';
export declare class Order {
    id: string;
    user: User;
    items: OrderItem[];
    total_amount: number;
    status: OrderStatus;
    created_at: Date;
    updated_at: Date;
}
