import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { ApprovalStatus } from '@/common/enums';
import { CreateVendorDto } from '../../dto/create-vendor.dto';

// Legacy service for admin vendor management
// This is separate from VendorAuthService which handles vendor authentication

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
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
}
