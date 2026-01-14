import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { VendorAuthService } from '../vendor-auth.service';
import { AdminAuthService } from '../admin-auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    private vendorAuthService;
    private adminAuthService;
    constructor(configService: ConfigService, authService: AuthService, vendorAuthService: VendorAuthService, adminAuthService: AdminAuthService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
}
export {};
