import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/auth/entities/user.entity';
import { PostStatus } from '@/common/enums';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'text', nullable: true })
    image_url: string; // Cloudinary URL

    @Column({ type: 'int', default: 0 })
    likes_count: number;

    @Column({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.PENDING,
    })
    status: PostStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
