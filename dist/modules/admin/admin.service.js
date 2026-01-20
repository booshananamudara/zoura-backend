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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("../auth/entities/vendor.entity");
const product_entity_1 = require("../commerce/entities/product.entity");
const product_variant_entity_1 = require("../commerce/entities/product-variant.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const post_entity_1 = require("../social/entities/post.entity");
const enums_1 = require("../../common/enums");
let AdminService = class AdminService {
    vendorRepository;
    productRepository;
    variantRepository;
    orderRepository;
    postRepository;
    constructor(vendorRepository, productRepository, variantRepository, orderRepository, postRepository) {
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.orderRepository = orderRepository;
        this.postRepository = postRepository;
    }
    async getDashboardStats() {
        const ordersResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total_amount)', 'total')
            .getRawOne();
        const totalRevenue = parseFloat(ordersResult?.total || '0');
        const totalOrders = await this.orderRepository.count();
        const totalVendors = await this.vendorRepository.count({
            where: { approval_status: enums_1.ApprovalStatus.APPROVED },
        });
        const lowStockVariants = await this.variantRepository
            .createQueryBuilder('variant')
            .innerJoinAndSelect('variant.product', 'product')
            .where('variant.stock < :threshold', { threshold: 5 })
            .orderBy('variant.stock', 'ASC')
            .take(10)
            .getMany();
        const lowStockItems = lowStockVariants.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
            productName: variant.product?.name || 'Unknown Product',
            productId: variant.product?.id || '',
        }));
        return {
            totalRevenue,
            totalOrders,
            totalVendors,
            lowStockItems,
        };
    }
    async getAllVendors() {
        return this.vendorRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async getAllProducts() {
        return this.productRepository.find({
            relations: ['vendor', 'variants'],
            order: { created_at: 'DESC' },
        });
    }
    async getPendingVendorApprovals() {
        return this.vendorRepository.find({
            where: { approval_status: enums_1.ApprovalStatus.PENDING },
            order: { created_at: 'ASC' },
        });
    }
    async getPendingProductApprovals() {
        return this.productRepository.find({
            where: { approval_status: enums_1.ApprovalStatus.PENDING },
            relations: ['vendor', 'variants'],
            order: { created_at: 'ASC' },
        });
    }
    async approveVendor(id) {
        const vendor = await this.vendorRepository.findOne({ where: { id } });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        vendor.approval_status = enums_1.ApprovalStatus.APPROVED;
        return this.vendorRepository.save(vendor);
    }
    async approveProduct(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.approval_status = enums_1.ApprovalStatus.APPROVED;
        await this.productRepository.save(product);
        return product;
    }
    async rejectProduct(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.approval_status = enums_1.ApprovalStatus.REJECTED;
        return this.productRepository.save(product);
    }
    async getPendingPosts() {
        return this.postRepository.find({
            where: { status: enums_1.PostStatus.PENDING },
            order: { created_at: 'ASC' },
            relations: ['user'],
        });
    }
    async updatePostStatus(postId, status) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        post.status = status;
        await this.postRepository.save(post);
        return post;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map