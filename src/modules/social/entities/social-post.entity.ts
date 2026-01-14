import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostType, ApprovalStatus } from '@/common/enums';
import { User } from '@/modules/auth/entities/user.entity';
import { Comment } from './comment.entity';

@Entity('social_posts')
export class SocialPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PostType,
    })
    type: PostType;

    @Column()
    media_url: string;

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column({ type: 'text' })
    caption: string;

    @Column({ type: 'int', default: 0 })
    likes_count: number;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    approval_status: ApprovalStatus;

    @ManyToOne(() => User)
    uploader: User;

    @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
    comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
