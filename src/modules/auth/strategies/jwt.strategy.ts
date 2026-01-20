import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { VendorAuthService } from '../vendor-auth.service';
import { AdminAuthService } from '../admin-auth.service';
import { UserRole } from '@/common/enums';

/**
 * Unified JWT Strategy for all three authentication roles:
 * - USER (mobile app buyers)
 * - VENDOR (shop owners)
 * - ADMIN (system administrators)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private authService: AuthService,
        private vendorAuthService: VendorAuthService,
        private adminAuthService: AdminAuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const role = payload.role;

        // Route to appropriate validation based on role
        switch (role) {
            case UserRole.ADMIN:
                // Admin authentication (environment-based)
                const admin = await this.adminAuthService.validateAdmin(payload);
                if (!admin) {
                    throw new UnauthorizedException('Invalid admin token');
                }
                return admin;

            case UserRole.VENDOR:
                // Vendor authentication (database-backed)
                const vendor = await this.vendorAuthService.validateVendor(payload);
                if (!vendor) {
                    throw new UnauthorizedException('Invalid vendor token');
                }
                return {
                    id: vendor.id,
                    email: vendor.email,
                    role: UserRole.VENDOR,
                };

            case UserRole.USER:
                // User authentication (database-backed)
                const user = await this.authService.validateUser(payload);
                if (!user) {
                    throw new UnauthorizedException('Invalid user token');
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    subscription_tier: user.subscription_tier,
                    role: UserRole.USER,
                };

            default:
                throw new UnauthorizedException('Invalid token role');
        }
    }
}
