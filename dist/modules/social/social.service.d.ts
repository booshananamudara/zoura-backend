import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Post } from './entities/post.entity';
import { Product } from '../commerce/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreatePostDto } from './dto/create-post.dto';
export interface PaginatedPosts {
    data: Post[];
    total: number;
    limit: number;
    offset: number;
}
export interface ProductReviewsResponse {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}
export declare class SocialService {
    private reviewRepository;
    private postRepository;
    private productRepository;
    constructor(reviewRepository: Repository<Review>, postRepository: Repository<Post>, productRepository: Repository<Product>);
    createReview(user: User, dto: CreateReviewDto): Promise<Review>;
    getProductReviews(productId: string): Promise<ProductReviewsResponse>;
    createPost(user: User, dto: CreatePostDto, imageUrl?: string): Promise<Post>;
    getFeed(limit?: number, offset?: number): Promise<PaginatedPosts>;
    getMyPosts(user: User): Promise<Post[]>;
    getStatus(): string;
}
