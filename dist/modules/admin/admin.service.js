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
const enums_1 = require("../../common/enums");
let AdminService = class AdminService {
    vendorRepository;
    productRepository;
    constructor(vendorRepository, productRepository) {
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
    }
    async approveVendor(id) {
        const vendor = await this.vendorRepository.findOne({
            where: { id },
        });
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
        return this.productRepository.save(product);
    }
    async getAllVendors() {
        return this.vendorRepository.find({
            order: {
                created_at: 'DESC',
            },
        });
    }
    async getAllProducts() {
        return this.productRepository.find({
            relations: ['vendor'],
            order: {
                created_at: 'DESC',
            },
        });
    }
    async getPendingVendors() {
        return this.vendorRepository.find({
            where: { approval_status: enums_1.ApprovalStatus.PENDING },
            order: {
                created_at: 'DESC',
            },
        });
    }
    async getPendingProducts() {
        return this.productRepository.find({
            where: { approval_status: enums_1.ApprovalStatus.PENDING },
            relations: ['vendor'],
            order: {
                created_at: 'DESC',
            },
        });
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map