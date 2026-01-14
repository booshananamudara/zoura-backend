import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AdminLoginDto {
    email: string;
    password: string;
}
export declare class AdminAuthService {
    private configService;
    private jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    login(loginDto: AdminLoginDto): Promise<{
        access_token: string;
    }>;
    validateAdmin(payload: any): Promise<{
        id: string;
        email: string;
        role: string;
    } | null>;
}
