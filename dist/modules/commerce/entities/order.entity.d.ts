import { OrderStatus } from '@/common/enums';
import { User } from '@/modules/auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    total_amount: number;
    status: OrderStatus;
    buyer: User;
    items: OrderItem[];
    created_at: Date;
    updated_at: Date;
}
