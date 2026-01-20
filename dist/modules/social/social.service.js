"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const post_entity_1 = require("./entities/post.entity");
const product_entity_1 = require("../commerce/entities/product.entity");
const enums_1 = require("../../common/enums");
let SocialService = class SocialService {
    reviewRepository;
    postRepository;
    productRepository;
    constructor(reviewRepository, postRepository, productRepository) {
        this.reviewRepository = reviewRepository;
        this.postRepository = postRepository;
        this.productRepository = productRepository;
    }
    async createReview(user, dto) {
        const product = await this.productRepository.findOne({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                user: { id: user.id },
                product: { id: dto.productId },
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this product');
        }
        const review = this.reviewRepository.create({
            user,
            product,
            rating: dto.rating,
            comment: dto.comment || '',
            images: dto.images || [],
        });
        return this.reviewRepository.save(review);
    }
    async getProductReviews(productId) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const reviews = await this.reviewRepository.find({
            where: { product: { id: productId } },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        return {
            reviews,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
        };
    }
    async createPost(user, dto, imageUrl) {
        if (!user.subscription_tier || user.subscription_tier === enums_1.SubscriptionTier.FREE) {
            throw new common_1.ForbiddenException('You must be a Silver, Gold, or Platinum member to post.');
        }
        const post = this.postRepository.create({
            user,
            content: dto.content,
            image_url: imageUrl || dto.image_url || undefined,
            likes_count: 0,
            status: enums_1.PostStatus.PENDING,
        });
        return this.postRepository.save(post);
    }
    async getFeed(limit = 20, offset = 0) {
        const [data, total] = await this.postRepository.findAndCount({
            where: { status: enums_1.PostStatus.APPROVED },
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
    async getMyPosts(user) {
        return this.postRepository.find({
            where: { user: { id: user.id } },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
    }
    getStatus() {
        return 'Social module is running';
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SocialService);
//# sourceMappingURL=social.service.js.map