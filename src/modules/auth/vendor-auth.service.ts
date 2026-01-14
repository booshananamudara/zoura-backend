import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Vendor } from './entities/vendor.entity';
import { ApprovalStatus } from '@/common/enums';

export class VendorRegisterDto {
    email: string;
    password: string;
    name: string;
    shop_name: string;
    bank_details?: string;
}

export class VendorLoginDto {
    email: string;
    password: string;
}

@Injectable()
export class VendorAuthService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        private jwtService: JwtService,
    ) { }

    /**
     * Register a new vendor (vendor website only)
     * @param registerDto - Contains email, password, name, shop_name, bank_details (optional)
     * @returns The new vendor without password
     */
    async register(registerDto: VendorRegisterDto): Promise<Omit<Vendor, 'password'>> {
        const { email, password, name, shop_name, bank_details } = registerDto;

        // Check if vendor exists
        const existingVendor = await this.vendorRepository.findOne({
            where: { email },
        });

        if (existingVendor) {
            throw new ConflictException('Vendor with this email already exists');
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create vendor
        const vendor = this.vendorRepository.create({
            email,
            password: hashedPassword,
            name,
            shop_name,
            bank_details: bank_details || '',
            approval_status: ApprovalStatus.PENDING,
        });

        // Save to DB
        const savedVendor = await this.vendorRepository.save(vendor);

        // Return vendor without password
        const { password: _, ...vendorWithoutPassword } = savedVendor;
        return vendorWithoutPassword;
    }

    /**
     * Login a vendor (vendor website only)
     * @param loginDto - Contains email and password
     * @returns Object with access_token
     */
    async login(loginDto: VendorLoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        // Find vendor with password field
        const vendor = await this.vendorRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'approval_status', 'shop_name'],
        });

        if (!vendor) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compare password hash
        const isPasswordValid = await bcrypt.compare(password, vendor.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const payload = {
            sub: vendor.id,
            email: vendor.email,
            role: 'VENDOR', // Role-based authentication
            shop: vendor.shop_name, // Vendor-specific context
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
        };
    }

    /**
     * Validate vendor by JWT payload (used by Vendor JWT strategy)
     * @param payload - JWT payload containing sub (vendor ID)
     * @returns Vendor object or null
     */
    async validateVendor(payload: any): Promise<Vendor | null> {
        const vendor = await this.vendorRepository.findOne({
            where: { id: payload.sub },
        });

        return vendor;
    }

    /**
     * Find vendor by email
     * @param email - Vendor email
     * @returns Vendor object or null
     */
    async findByEmail(email: string): Promise<Vendor | null> {
        return this.vendorRepository.findOne({ where: { email } });
    }

    /**
     * Find vendor by ID
     * @param id - Vendor ID
     * @returns Vendor object or null
     */
    async findById(id: string): Promise<Vendor | null> {
        return this.vendorRepository.findOne({ where: { id } });
    }
}
