import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SubscriptionTier } from '@/common/enums';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'text', comment: 'Encrypted NIC', default: '' })
    nic: string;

    @Column({
        type: 'enum',
        enum: SubscriptionTier,
        default: SubscriptionTier.FREE,
    })
    subscription_tier: SubscriptionTier;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
