import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApprovalStatus } from '@/common/enums';
import { Product } from '@/modules/commerce/entities/product.entity';

@Entity('vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    name: string;

    @Column()
    shop_name: string;

    @Column({ type: 'text', default: '' })
    bank_details: string;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    approval_status: ApprovalStatus;

    @OneToMany(() => Product, (product) => product.vendor)
    products: Product[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
