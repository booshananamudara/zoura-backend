import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// User Auth (Mobile App)
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

// Vendor Auth (Vendor Website)
import { VendorAuthController } from './vendor-auth.controller';
import { VendorAuthService } from './vendor-auth.service';
import { Vendor } from './entities/vendor.entity';

// Admin Auth (Admin Dashboard)
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

// Admin Management (Legacy - needs cleanup)
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Vendor]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-this-in-production',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,           // User auth endpoints
    VendorAuthController,     // Vendor auth endpoints
    AdminAuthController,      // Admin auth endpoints
    VendorsController,        // Admin vendor management
  ],
  providers: [
    // User Auth
    AuthService,
    LocalStrategy,
    // Vendor Auth
    VendorAuthService,
    // Admin Auth
    AdminAuthService,
    // Unified JWT Strategy (handles all 3 roles)
    JwtStrategy,
    // Admin Management
    VendorsService,
  ],
  exports: [AuthService, VendorAuthService, AdminAuthService, VendorsService],
})
export class AuthModule { }
