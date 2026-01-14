import { AdminAuthService, AdminLoginDto } from './admin-auth.service';
export declare class AdminAuthController {
    private adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(loginDto: AdminLoginDto): Promise<{
        access_token: string;
    }>;
}
