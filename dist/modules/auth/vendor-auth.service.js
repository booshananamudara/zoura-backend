"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorAuthService = exports.VendorLoginDto = exports.VendorRegisterDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const vendor_entity_1 = require("./entities/vendor.entity");
const enums_1 = require("../../common/enums");
class VendorRegisterDto {
    email;
    password;
    name;
    shop_name;
    bank_details;
}
exports.VendorRegisterDto = VendorRegisterDto;
class VendorLoginDto {
    email;
    password;
}
exports.VendorLoginDto = VendorLoginDto;
let VendorAuthService = class VendorAuthService {
    vendorRepository;
    jwtService;
    constructor(vendorRepository, jwtService) {
        this.vendorRepository = vendorRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name, shop_name, bank_details } = registerDto;
        const existingVendor = await this.vendorRepository.findOne({
            where: { email },
        });
        if (existingVendor) {
            throw new common_1.ConflictException('Vendor with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const vendor = this.vendorRepository.create({
            email,
            password: hashedPassword,
            name,
            shop_name,
            bank_details: bank_details || '',
            approval_status: enums_1.ApprovalStatus.PENDING,
        });
        const savedVendor = await this.vendorRepository.save(vendor);
        const { password: _, ...vendorWithoutPassword } = savedVendor;
        return vendorWithoutPassword;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const vendor = await this.vendorRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'approval_status', 'shop_name'],
        });
        if (!vendor) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: vendor.id,
            email: vendor.email,
            role: 'VENDOR',
            shop: vendor.shop_name,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
        };
    }
    async validateVendor(payload) {
        const vendor = await this.vendorRepository.findOne({
            where: { id: payload.sub },
        });
        return vendor;
    }
    async findByEmail(email) {
        return this.vendorRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.vendorRepository.findOne({ where: { id } });
    }
};
exports.VendorAuthService = VendorAuthService;
exports.VendorAuthService = VendorAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], VendorAuthService);
//# sourceMappingURL=vendor-auth.service.js.map