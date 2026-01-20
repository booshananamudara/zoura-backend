import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';
import { Post } from '../social/entities/post.entity';
import { ApprovalStatus, PostStatus } from '@/common/enums';

export interface LowStockItem {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    stock: number;
    productName: string;
    productId: string;
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalVendors: number;
    lowStockItems: LowStockItem[];
}

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) { }

    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        // Get total revenue from all orders
        const ordersResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total_amount)', 'total')
            .getRawOne();
        const totalRevenue = parseFloat(ordersResult?.total || '0');

        // Get total orders count
        const totalOrders = await this.orderRepository.count();

        // Get total vendors count
        const totalVendors = await this.vendorRepository.count({
            where: { approval_status: ApprovalStatus.APPROVED },
        });

        // Get low stock items (stock < 5) across all vendors
        const lowStockVariants = await this.variantRepository
            .createQueryBuilder('variant')
            .innerJoinAndSelect('variant.product', 'product')
            .where('variant.stock < :threshold', { threshold: 5 })
            .orderBy('variant.stock', 'ASC')
            .take(10)
            .getMany();

        const lowStockItems: LowStockItem[] = lowStockVariants.map(variant => ({
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

    /**
     * Get all vendors
     */
    async getAllVendors(): Promise<Vendor[]> {
        return this.vendorRepository.find({
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Get all products
     */
    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['vendor', 'variants'],
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Get pending vendor approvals
     */
    async getPendingVendorApprovals(): Promise<Vendor[]> {
        return this.vendorRepository.find({
            where: { approval_status: ApprovalStatus.PENDING },
            order: { created_at: 'ASC' },
        });
    }

    /**
     * Get pending product approvals
     */
    async getPendingProductApprovals(): Promise<Product[]> {
        return this.productRepository.find({
            where: { approval_status: ApprovalStatus.PENDING },
            relations: ['vendor', 'variants'],
            order: { created_at: 'ASC' },
        });
    }

    /**
     * Approve a vendor
     * @param id - Vendor ID
     * @returns Updated vendor
     */
    async approveVendor(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({ where: { id } });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        vendor.approval_status = ApprovalStatus.APPROVED;

        return this.vendorRepository.save(vendor);
    }

    /**
     * Approve a product
     * @param id - Product ID
     * @returns Updated product
     */
    async approveProduct(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.approval_status = ApprovalStatus.APPROVED;

        await this.productRepository.save(product);
        return product;
    }

    /**
     * Reject a product
     * @param id - Product ID
     * @returns Updated product
     */
    async rejectProduct(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.approval_status = ApprovalStatus.REJECTED;

        return this.productRepository.save(product);
    }

    // =========== SOCIAL MODERATION ===========

    /**
     * Get all pending social posts awaiting moderation
     */
    async getPendingPosts(): Promise<Post[]> {
        return this.postRepository.find({
            where: { status: PostStatus.PENDING },
            order: { created_at: 'ASC' },
            relations: ['user'],
        });
    }

    /**
     * Update post moderation status
     * @param postId - Post ID
     * @param status - New status (APPROVED or REJECTED)
     */
    async updatePostStatus(postId: string, status: PostStatus): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        post.status = status;
        await this.postRepository.save(post);
        return post;
    }
}
