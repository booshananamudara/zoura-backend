import { PostType, ApprovalStatus } from '@/common/enums';
import { User } from '@/modules/auth/entities/user.entity';
import { Comment } from './comment.entity';
export declare class SocialPost {
    id: string;
    type: PostType;
    media_url: string;
    thumbnail_url: string;
    caption: string;
    likes_count: number;
    approval_status: ApprovalStatus;
    uploader: User;
    comments: Comment[];
    created_at: Date;
    updated_at: Date;
}
