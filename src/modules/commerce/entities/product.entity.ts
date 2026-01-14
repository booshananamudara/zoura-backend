import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApprovalStatus } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'jsonb', default: [] })
    images: string[];

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
