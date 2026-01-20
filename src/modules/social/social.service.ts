import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Post } from './entities/post.entity';
import { Product } from '../commerce/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { SubscriptionTier, PostStatus } from '@/common/enums';

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

@Injectable()
export class SocialService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    /**
     * Create a review for a product
     * @param user - Current authenticated user
     * @param dto - Review data
     * @returns Created review
     */
    async createReview(user: User, dto: CreateReviewDto): Promise<Review> {
        // Find the product
        const product = await this.productRepository.findOne({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // TODO: Validate that user actually purchased this product
        // This would require checking OrderItem for orders by this user containing this product
        // For now, we allow any user to review any product
        // Future implementation:
        // const hasPurchased = await this.orderItemRepository
        //     .createQueryBuilder('orderItem')
        //     .innerJoin('orderItem.order', 'order')
        //     .innerJoin('order.user', 'user')
        //     .where('user.id = :userId', { userId: user.id })
        //     .andWhere('orderItem.product.id = :productId', { productId: dto.productId })
        //     .getCount();
        // if (hasPurchased === 0) {
        //     throw new BadRequestException('You can only review products you have purchased');
        // }

        // Check if user already reviewed this product
        const existingReview = await this.reviewRepository.findOne({
            where: {
                user: { id: user.id },
                product: { id: dto.productId },
            },
        });

        if (existingReview) {
            throw new BadRequestException('You have already reviewed this product');
        }

        // Create and save the review
        const review = this.reviewRepository.create({
            user,
            product,
            rating: dto.rating,
            comment: dto.comment || '',
            images: dto.images || [],
        });

        return this.reviewRepository.save(review);
    }

    /**
     * Get all reviews for a product
     * @param productId - Product ID
     * @returns Reviews with average rating
     */
    async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const reviews = await this.reviewRepository.find({
            where: { product: { id: productId } },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;

        return {
            reviews,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews,
        };
    }

    /**
     * Create a social feed post
     * @param user - Current authenticated user
     * @param dto - Post data
     * @param imageUrl - Optional uploaded image URL
     * @returns Created post
     */
    async createPost(user: User, dto: CreatePostDto, imageUrl?: string): Promise<Post> {
        // Check subscription tier - FREE users cannot post
        if (!user.subscription_tier || user.subscription_tier === SubscriptionTier.FREE) {
            throw new ForbiddenException(
                'You must be a Silver, Gold, or Platinum member to post.'
            );
        }

        // Create post with PENDING status (requires admin approval)
        const post = this.postRepository.create({
            user,
            content: dto.content,
            image_url: imageUrl || dto.image_url || undefined,
            likes_count: 0,
            status: PostStatus.PENDING,
        });

        return this.postRepository.save(post);
    }

    /**
     * Get paginated social feed (only APPROVED posts)
     * @param limit - Number of posts per page
     * @param offset - Offset for pagination
     * @returns Paginated posts sorted by newest
     */
    async getFeed(limit: number = 20, offset: number = 0): Promise<PaginatedPosts> {
        const [data, total] = await this.postRepository.findAndCount({
            where: { status: PostStatus.APPROVED },
            order: { created_at: 'DESC' },
            take: limit,
            skip: offset,
            relations: ['user'],
        });

        return {
            data,
            total,
            limit,
            offset,
        };
    }

    /**
     * Get user's own posts (all statuses)
     * @param user - Current authenticated user
     * @returns User's posts including PENDING ones
     */
    async getMyPosts(user: User): Promise<Post[]> {
        return this.postRepository.find({
            where: { user: { id: user.id } },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
    }

    /**
     * Get status (legacy endpoint)
     */
    getStatus(): string {
        return 'Social module is running';
    }
}
