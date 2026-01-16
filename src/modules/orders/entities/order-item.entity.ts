import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../commerce/entities/product.entity';
import { ProductVariant } from '../../commerce/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @ManyToOne(() => ProductVariant, { eager: true, nullable: true })
    variant: ProductVariant;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price_at_purchase: number;

    @CreateDateColumn()
    created_at: Date;
}

