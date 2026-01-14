import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
import { ApprovalStatus } from '@/common/enums';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

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
