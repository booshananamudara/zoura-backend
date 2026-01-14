import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/auth/entities/user.entity';
import { SocialPost } from './social-post.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => SocialPost, (post) => post.comments)
    post: SocialPost;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
