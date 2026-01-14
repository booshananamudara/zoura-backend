"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
const vendor_auth_service_1 = require("../vendor-auth.service");
const admin_auth_service_1 = require("../admin-auth.service");
const enums_1 = require("../../../common/enums");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    authService;
    vendorAuthService;
    adminAuthService;
    constructor(configService, authService, vendorAuthService, adminAuthService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
        });
        this.authService = authService;
        this.vendorAuthService = vendorAuthService;
        this.adminAuthService = adminAuthService;
    }
    async validate(payload) {
        const role = payload.role;
        switch (role) {
            case enums_1.UserRole.ADMIN:
                const admin = await this.adminAuthService.validateAdmin(payload);
                if (!admin) {
                    throw new common_1.UnauthorizedException('Invalid admin token');
                }
                return admin;
            case enums_1.UserRole.VENDOR:
                const vendor = await this.vendorAuthService.validateVendor(payload);
                if (!vendor) {
                    throw new common_1.UnauthorizedException('Invalid vendor token');
                }
                return {
                    id: vendor.id,
                    email: vendor.email,
                    role: enums_1.UserRole.VENDOR,
                };
            case enums_1.UserRole.USER:
                const user = await this.authService.validateUser(payload);
                if (!user) {
                    throw new common_1.UnauthorizedException('Invalid user token');
                }
                return {
                    id: user.id,
                    email: user.email,
                    role: enums_1.UserRole.USER,
                };
            default:
                throw new common_1.UnauthorizedException('Invalid token role');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService,
        vendor_auth_service_1.VendorAuthService,
        admin_auth_service_1.AdminAuthService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map