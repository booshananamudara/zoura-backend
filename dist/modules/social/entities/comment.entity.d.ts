import { User } from '@/modules/auth/entities/user.entity';
import { SocialPost } from './social-post.entity';
export declare class Comment {
    id: string;
    text: string;
    user: User;
    post: SocialPost;
    created_at: Date;
    updated_at: Date;
}
