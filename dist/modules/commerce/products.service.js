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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const vendor_entity_1 = require("../auth/entities/vendor.entity");
const enums_1 = require("../../common/enums");
let ProductsService = class ProductsService {
    productRepository;
    vendorRepository;
    constructor(productRepository, vendorRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
    }
    async create(createProductDto, vendorId) {
        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.BadRequestException('You must have a vendor profile to create products. Please contact admin.');
        }
        if (vendor.approval_status !== enums_1.ApprovalStatus.APPROVED) {
            throw new common_1.ForbiddenException('You must be an approved vendor to add products.');
        }
        const product = this.productRepository.create({
            name: createProductDto.name,
            price: createProductDto.price,
            stock: createProductDto.stock,
            images: createProductDto.images || [],
            is_zoura_mall: false,
            approval_status: enums_1.ApprovalStatus.PENDING,
            vendor: vendor,
        });
        const savedProduct = await this.productRepository.save(product);
        return savedProduct;
    }
    async findAllPublic(query) {
        const { limit, offset, category, search } = query;
        const where = {
            approval_status: enums_1.ApprovalStatus.APPROVED,
        };
        if (category) {
            where.category = category;
        }
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['vendor'],
            take: limit,
            skip: offset,
            order: {
                created_at: 'DESC',
            },
        });
        return {
            products,
            total,
        };
    }
    async findAll() {
        return this.productRepository.find({
            relations: ['vendor'],
        });
    }
    async findMyProducts(vendorId) {
        return this.productRepository.find({
            where: {
                vendor: { id: vendorId },
            },
            relations: ['vendor'],
            order: {
                created_at: 'DESC',
            },
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map