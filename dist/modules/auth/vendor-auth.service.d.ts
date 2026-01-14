import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Vendor } from './entities/vendor.entity';
export declare class VendorRegisterDto {
    email: string;
    password: string;
    name: string;
    shop_name: string;
    bank_details?: string;
}
export declare class VendorLoginDto {
    email: string;
    password: string;
}
export declare class VendorAuthService {
    private vendorRepository;
    private jwtService;
    constructor(vendorRepository: Repository<Vendor>, jwtService: JwtService);
    register(registerDto: VendorRegisterDto): Promise<Omit<Vendor, 'password'>>;
    login(loginDto: VendorLoginDto): Promise<{
        access_token: string;
    }>;
    validateVendor(payload: any): Promise<Vendor | null>;
    findByEmail(email: string): Promise<Vendor | null>;
    findById(id: string): Promise<Vendor | null>;
}
