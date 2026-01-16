import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../commerce/entities/product.entity';
import { ProductVariant } from '../../commerce/entities/product-variant.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @ManyToOne(() => ProductVariant, { eager: true, nullable: true })
    variant: ProductVariant;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price_at_add: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

