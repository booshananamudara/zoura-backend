import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/common/enums';

export class AdminLoginDto {
    email: string;
    password: string;
}

@Injectable()
export class AdminAuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
    ) { }

    /**
     * Login as admin using environment variables
     * @param loginDto - Contains email and password
     * @returns Object with access_token
     */
    async login(loginDto: AdminLoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        // Get admin credentials from environment
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

        // Validate credentials
        if (!adminEmail || !adminPassword) {
            throw new Error('Admin credentials not configured in environment');
        }

        if (email !== adminEmail || password !== adminPassword) {
            throw new UnauthorizedException('Invalid admin credentials');
        }

        // Generate JWT token with admin role
        const payload = {
            sub: 'admin',
            email: adminEmail,
            role: UserRole.ADMIN,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
        };
    }

    /**
     * Validate admin from JWT payload
     * @param payload - JWT payload
     * @returns Admin object or null
     */
    async validateAdmin(payload: any): Promise<{ id: string; email: string; role: string } | null> {
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

        if (payload.email !== adminEmail) {
            return null;
        }

        return {
            id: 'admin',
            email: payload.email,
            role: UserRole.ADMIN,
        };
    }
}
