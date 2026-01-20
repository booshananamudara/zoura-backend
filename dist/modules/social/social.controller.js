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
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const social_service_1 = require("./social.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const create_post_dto_1 = require("./dto/create-post.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const cloudinary_1 = require("../../common/cloudinary");
let SocialController = class SocialController {
    socialService;
    cloudinaryService;
    constructor(socialService, cloudinaryService) {
        this.socialService = socialService;
        this.cloudinaryService = cloudinaryService;
    }
    getStatus() {
        return this.socialService.getStatus();
    }
    async createReview(dto, req) {
        const review = await this.socialService.createReview(req.user, dto);
        return {
            message: 'Review submitted successfully',
            review,
        };
    }
    async getProductReviews(productId) {
        return this.socialService.getProductReviews(productId);
    }
    async createPost(file, dto, req) {
        let imageUrl;
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
    async getFeed(limit, offset) {
        return this.socialService.getFeed(limit ? parseInt(limit, 10) : 20, offset ? parseInt(offset, 10) : 0);
    }
    async getMyPosts(req) {
        return this.socialService.getMyPosts(req.user);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], SocialController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.USER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('reviews/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getProductReviews", null);
__decorate([
    (0, common_1.Post)('feed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.USER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Get)('my-posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.USER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getMyPosts", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('social'),
    __metadata("design:paramtypes", [social_service_1.SocialService,
        cloudinary_1.CloudinaryService])
], SocialController);
//# sourceMappingURL=social.controller.js.map