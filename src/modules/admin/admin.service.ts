import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';
import { ApprovalStatus } from '@/common/enums';

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
    ) { }

    /**
     * Get dashboard statistics
     * @returns Dashboard stats including revenue, orders, vendors, and low stock items
     */
    async getDashboardStats(): Promise<DashboardStats> {
        // Get total revenue
        const revenueResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total_amount)', 'total')
            .getRawOne();
        const totalRevenue = parseFloat(revenueResult?.total || '0');

        // Get total orders count
        const totalOrders = await this.orderRepository.count();

        // Get total vendors count
        const totalVendors = await this.vendorRepository.count();

        // Get low stock items (stock < 5)
        const lowStockVariants = await this.variantRepository.find({
            where: { stock: LessThan(5) },
            relations: ['product'],
            order: { stock: 'ASC' },
            take: 5,
        });

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
     * Approve a vendor
     * @param id - Vendor ID
     * @returns Updated vendor profile
     */
    async approveVendor(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({
            where: { id },
        });

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

        return this.productRepository.save(product);
    }

    /**
     * Get all vendors
     * @returns Array of all vendors
     */
    async getAllVendors(): Promise<Vendor[]> {
        return this.vendorRepository.find({
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Get all products
     * @returns Array of all products
     */
    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['vendor'],
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Get pending vendors (approval_status = PENDING)
     * @returns Array of vendors pending approval
     */
    async getPendingVendors(): Promise<Vendor[]> {
        return this.vendorRepository.find({
            where: { approval_status: ApprovalStatus.PENDING },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Get pending products (approval_status = PENDING)
     * @returns Array of products pending approval
     */
    async getPendingProducts(): Promise<Product[]> {
        return this.productRepository.find({
            where: { approval_status: ApprovalStatus.PENDING },
            relations: ['vendor'],
            order: {
                created_at: 'DESC',
            },
        });
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
}

