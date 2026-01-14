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
exports.AdminAuthService = exports.AdminLoginDto = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const enums_1 = require("../../common/enums");
class AdminLoginDto {
    email;
    password;
}
exports.AdminLoginDto = AdminLoginDto;
let AdminAuthService = class AdminAuthService {
    configService;
    jwtService;
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');
        if (!adminEmail || !adminPassword) {
            throw new Error('Admin credentials not configured in environment');
        }
        if (email !== adminEmail || password !== adminPassword) {
            throw new common_1.UnauthorizedException('Invalid admin credentials');
        }
        const payload = {
            sub: 'admin',
            email: adminEmail,
            role: enums_1.UserRole.ADMIN,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
        };
    }
    async validateAdmin(payload) {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        if (payload.email !== adminEmail) {
            return null;
        }
        return {
            id: 'admin',
            email: payload.email,
            role: enums_1.UserRole.ADMIN,
        };
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map