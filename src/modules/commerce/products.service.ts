import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Vendor } from '../auth/entities/vendor.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ApprovalStatus } from '../../common/enums';

export interface PublicProductQuery {
    limit: number;
    offset: number;
    category?: string;
    search?: string;
}

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        vendorId: string,
        imageUrls: string[] = [],
    ): Promise<Product> {
        // Find the vendor profile
        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId },
        });

        if (!vendor) {
            throw new BadRequestException(
                'You must have a vendor profile to create products. Please contact admin.',
            );
        }

        // Check if vendor is approved
        if (vendor.approval_status !== ApprovalStatus.APPROVED) {
            throw new ForbiddenException(
                'You must be an approved vendor to add products.',
            );
        }

        // Create new product entity
        const product = this.productRepository.create({
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            images: imageUrls,
            attributes: createProductDto.attributes || {},
            is_zoura_mall: false,
            approval_status: ApprovalStatus.PENDING,
            vendor: vendor,
        });

        // Save product first to get ID
        const savedProduct = await this.productRepository.save(product);

        // Create variants if provided
        if (createProductDto.variants && createProductDto.variants.length > 0) {
            const variants = createProductDto.variants.map((variantDto) =>
                this.variantRepository.create({
                    product: savedProduct,
                    color: variantDto.color,
                    size: variantDto.size,
                    sku: variantDto.sku,
                    stock: variantDto.stock,
                    price_override: variantDto.price_override,
                }),
            );

            await this.variantRepository.save(variants);
            savedProduct.variants = variants;
        } else {
            // Create default variant with no size/color if no variants provided
            const defaultVariant = this.variantRepository.create({
                product: savedProduct,
                sku: `${savedProduct.id.substring(0, 8)}-DEFAULT`,
                stock: 0,
            });
            await this.variantRepository.save(defaultVariant);
            savedProduct.variants = [defaultVariant];
        }

        return savedProduct;
    }

    /**
     * PUBLIC API: Get all approved products with pagination, filtering, and search
     * This endpoint is accessible without authentication
     * STRICTLY returns only APPROVED products
     */
    async findAllPublic(query: PublicProductQuery): Promise<{ products: Product[]; total: number }> {
        const { limit, offset, category, search } = query;

        // Build where clause - MUST be APPROVED
        const where: any = {
            approval_status: ApprovalStatus.APPROVED,
        };

        // Add category filter if provided
        if (category) {
            where.category = category;
        }

        // Add name search if provided (partial match)
        if (search) {
            where.name = Like(`%${search}%`);
        }

        // Execute query with pagination
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['vendor', 'variants'],
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

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['vendor', 'variants'],
        });
    }

    async findMyProducts(vendorId: string): Promise<Product[]> {
        return this.productRepository.find({
            where: {
                vendor: { id: vendorId },
            },
            relations: ['vendor', 'variants'],
            order: {
                created_at: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor', 'variants'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async findVariant(variantId: string): Promise<ProductVariant> {
        const variant = await this.variantRepository.findOne({
            where: { id: variantId },
            relations: ['product'],
        });

        if (!variant) {
            throw new NotFoundException('Product variant not found');
        }

        return variant;
    }
}

