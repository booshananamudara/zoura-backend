import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApprovalStatus } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'text', array: true, default: '{}' })
    images: string[];

    @Column({ type: 'jsonb', default: {} })
    attributes: Record<string, any>;

    @Column({ default: false })
    is_zoura_mall: boolean;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    approval_status: ApprovalStatus;

    @ManyToOne(() => Vendor, (vendor) => vendor.products, { nullable: true })
    vendor: Vendor;

    @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
    variants: ProductVariant[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Computed property: total stock across all variants
    get totalStock(): number {
        if (!this.variants) return 0;
        return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
    }
}

