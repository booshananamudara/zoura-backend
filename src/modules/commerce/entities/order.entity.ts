import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '@/common/enums';
import { User } from '@/modules/auth/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PROCESSING,
    })
    status: OrderStatus;

    @ManyToOne(() => User)
    buyer: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
