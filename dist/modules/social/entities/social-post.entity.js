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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPost = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../auth/entities/user.entity");
const comment_entity_1 = require("./comment.entity");
let SocialPost = class SocialPost {
    id;
    type;
    media_url;
    thumbnail_url;
    caption;
    likes_count;
    approval_status;
    uploader;
    comments;
    created_at;
    updated_at;
};
exports.SocialPost = SocialPost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SocialPost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.PostType,
    }),
    __metadata("design:type", String)
], SocialPost.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialPost.prototype, "media_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SocialPost.prototype, "thumbnail_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SocialPost.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SocialPost.prototype, "likes_count", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.ApprovalStatus,
        default: enums_1.ApprovalStatus.PENDING,
    }),
    __metadata("design:type", String)
], SocialPost.prototype, "approval_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], SocialPost.prototype, "uploader", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.post, { cascade: true }),
    __metadata("design:type", Array)
], SocialPost.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SocialPost.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SocialPost.prototype, "updated_at", void 0);
exports.SocialPost = SocialPost = __decorate([
    (0, typeorm_1.Entity)('social_posts')
], SocialPost);
//# sourceMappingURL=social-post.entity.js.map