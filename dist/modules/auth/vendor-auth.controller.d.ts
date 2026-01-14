import { VendorAuthService, VendorRegisterDto, VendorLoginDto } from './vendor-auth.service';
export declare class VendorAuthController {
    private vendorAuthService;
    constructor(vendorAuthService: VendorAuthService);
    register(registerDto: VendorRegisterDto): Promise<{
        message: string;
        vendor: Omit<import("./entities").Vendor, "password">;
    }>;
    login(loginDto: VendorLoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(vendor: any): any;
}
