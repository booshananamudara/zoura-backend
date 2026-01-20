import { User } from '@/modules/auth/entities/user.entity';
import { PostStatus } from '@/common/enums';
export declare class Post {
    id: string;
    user: User;
    content: string;
    image_url: string;
    likes_count: number;
    status: PostStatus;
    created_at: Date;
    updated_at: Date;
}
