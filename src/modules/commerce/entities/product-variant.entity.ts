import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    size: string;

    @Column({ unique: true })
    sku: string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_override: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
