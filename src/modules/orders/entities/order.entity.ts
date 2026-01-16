import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

export interface ShippingAddress {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column({
        type: 'varchar',
        length: 20,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ type: 'jsonb', nullable: true })
    shipping_address: ShippingAddress;

    @Column({ type: 'varchar', length: 50, default: 'cash_on_delivery' })
    payment_method: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
