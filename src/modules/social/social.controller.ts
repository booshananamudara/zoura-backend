import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SocialService } from './social.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { CloudinaryService } from '@/common/cloudinary';

@Controller('social')
export class SocialController {
    constructor(
        private readonly socialService: SocialService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    /**
     * Get status (legacy endpoint)
     */
    @Get()
    getStatus(): string {
        return this.socialService.getStatus();
    }

    // ============ REVIEWS ============

    /**
     * Create a review for a product
     * POST /social/reviews
     */
    @Post('reviews')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async createReview(@Body() dto: CreateReviewDto, @Request() req) {
        const review = await this.socialService.createReview(req.user, dto);
        return {
            message: 'Review submitted successfully',
            review,
        };
    }

    /**
     * Get all reviews for a specific product
     * GET /social/reviews/:productId
     */
    @Get('reviews/:productId')
    async getProductReviews(@Param('productId') productId: string) {
        return this.socialService.getProductReviews(productId);
    }

    // ============ FEED ============

    /**
     * Create a social feed post
     * POST /social/feed
     * Supports optional image upload
     */
    @Post('feed')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreatePostDto,
        @Request() req,
    ) {
        // Upload image to Cloudinary if provided
        let imageUrl: string | undefined;
        if (file) {
            const urls = await this.cloudinaryService.uploadImages([file]);
            imageUrl = urls[0];
        }

        const post = await this.socialService.createPost(req.user, dto, imageUrl);
        return {
            message: 'Post created successfully',
            post,
        };
    }

    /**
     * Get paginated social feed
     * GET /social/feed?limit=20&offset=0
     */
    @Get('feed')
    async getFeed(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.socialService.getFeed(
            limit ? parseInt(limit, 10) : 20,
            offset ? parseInt(offset, 10) : 0,
        );
    }

    /**
     * Get user's own posts (all statuses)
     * GET /social/my-posts
     */
    @Get('my-posts')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async getMyPosts(@Request() req) {
        return this.socialService.getMyPosts(req.user);
    }
}
