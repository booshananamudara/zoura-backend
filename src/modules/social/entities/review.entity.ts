import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '@/modules/auth/entities/user.entity';
import { Product } from '@/modules/commerce/entities/product.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ type: 'int' })
    rating: number; // 1-5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'text', array: true, default: '{}' })
    images: string[]; // Cloudinary URLs

    @CreateDateColumn()
    created_at: Date;
}
