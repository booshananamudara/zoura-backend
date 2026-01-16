import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { ApprovalStatus } from '@/common/enums';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

export interface VendorLowStockItem {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    stock: number;
    productName: string;
    productId: string;
}

export interface VendorDashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    lowStockItems: VendorLowStockItem[];
    shopName: string;
}

// Legacy service for admin vendor management
// This is separate from VendorAuthService which handles vendor authentication

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) { }

    /**
     * Create a new vendor
     * @param createVendorDto - Vendor creation data
     * @returns Created vendor profile
     */
    async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
        const vendor = this.vendorRepository.create({
            ...createVendorDto,
            shop_name: createVendorDto.shopName,
            bank_details: createVendorDto.bankDetails,
            approval_status: ApprovalStatus.PENDING,
        });

        return this.vendorRepository.save(vendor);
    }

    /**
     * Get all vendors
     * @returns Array of all vendors
     */
    async findAll(): Promise<Vendor[]> {
        return this.vendorRepository.find({
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Get vendor by ID
     * @param id - Vendor ID
     * @returns Vendor profile
     */
    async findOne(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({
            where: { id },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return vendor;
    }

    /**
     * Approve a vendor
     * @param id - Vendor ID
     * @returns Updated vendor profile
     */
    async approve(id: string): Promise<Vendor> {
        const vendor = await this.findOne(id);

        vendor.approval_status = ApprovalStatus.APPROVED;

        return this.vendorRepository.save(vendor);
    }

    /**
     * Get dashboard stats for a specific vendor
     * @param vendorId - Vendor ID
     * @returns Dashboard statistics
     */
    async getDashboardStats(vendorId: string): Promise<VendorDashboardStats> {
        // Get vendor info for shop name
        const vendor = await this.findOne(vendorId);

        // Get total revenue from order items for this vendor's products
        const revenueResult = await this.orderItemRepository
            .createQueryBuilder('orderItem')
            .innerJoin('orderItem.product', 'product')
            .innerJoin('product.vendor', 'vendor')
            .where('vendor.id = :vendorId', { vendorId })
            .select('SUM(orderItem.price_at_purchase * orderItem.quantity)', 'total')
            .getRawOne();
        const totalRevenue = parseFloat(revenueResult?.total || '0');

        // Get count of unique orders containing this vendor's products
        const ordersResult = await this.orderItemRepository
            .createQueryBuilder('orderItem')
            .innerJoin('orderItem.product', 'product')
            .innerJoin('product.vendor', 'vendor')
            .innerJoin('orderItem.order', 'order')
            .where('vendor.id = :vendorId', { vendorId })
            .select('COUNT(DISTINCT order.id)', 'count')
            .getRawOne();
        const totalOrders = parseInt(ordersResult?.count || '0', 10);

        // Get total approved products for this vendor
        const totalProducts = await this.productRepository.count({
            where: {
                vendor: { id: vendorId },
                approval_status: ApprovalStatus.APPROVED,
            },
        });

        // Get low stock items (stock < 5) for this vendor
        const lowStockVariants = await this.variantRepository
            .createQueryBuilder('variant')
            .innerJoinAndSelect('variant.product', 'product')
            .innerJoin('product.vendor', 'vendor')
            .where('vendor.id = :vendorId', { vendorId })
            .andWhere('variant.stock < :threshold', { threshold: 5 })
            .orderBy('variant.stock', 'ASC')
            .take(5)
            .getMany();

        const lowStockItems: VendorLowStockItem[] = lowStockVariants.map(variant => ({
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
            totalProducts,
            lowStockItems,
            shopName: vendor.shop_name,
        };
    }
}
