"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const social_controller_1 = require("./social.controller");
const social_service_1 = require("./social.service");
const review_entity_1 = require("./entities/review.entity");
const post_entity_1 = require("./entities/post.entity");
const product_entity_1 = require("../commerce/entities/product.entity");
const cloudinary_1 = require("../../common/cloudinary");
let SocialModule = class SocialModule {
};
exports.SocialModule = SocialModule;
exports.SocialModule = SocialModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([review_entity_1.Review, post_entity_1.Post, product_entity_1.Product]),
            cloudinary_1.CloudinaryModule,
        ],
        controllers: [social_controller_1.SocialController],
        providers: [social_service_1.SocialService],
        exports: [social_service_1.SocialService],
    })
], SocialModule);
//# sourceMappingURL=social.module.js.map