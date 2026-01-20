import { SocialService } from './social.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CloudinaryService } from '@/common/cloudinary';
export declare class SocialController {
    private readonly socialService;
    private readonly cloudinaryService;
    constructor(socialService: SocialService, cloudinaryService: CloudinaryService);
    getStatus(): string;
    createReview(dto: CreateReviewDto, req: any): Promise<{
        message: string;
        review: import("./entities").Review;
    }>;
    getProductReviews(productId: string): Promise<import("./social.service").ProductReviewsResponse>;
    createPost(file: Express.Multer.File, dto: CreatePostDto, req: any): Promise<{
        message: string;
        post: import("./entities").Post;
    }>;
    getFeed(limit?: string, offset?: string): Promise<import("./social.service").PaginatedPosts>;
    getMyPosts(req: any): Promise<import("./entities").Post[]>;
}
