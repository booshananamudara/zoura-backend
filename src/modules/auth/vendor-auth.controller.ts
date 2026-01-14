import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { VendorAuthService, VendorRegisterDto, VendorLoginDto } from './vendor-auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('vendor-auth')
export class VendorAuthController {
    constructor(private vendorAuthService: VendorAuthService) { }

    @Post('register')
    async register(@Body() registerDto: VendorRegisterDto) {
        const vendor = await this.vendorAuthService.register(registerDto);
        return {
            message: 'Vendor registered successfully. Pending approval.',
            vendor,
        };
    }

    @Post('login')
    async login(@Body() loginDto: VendorLoginDto) {
        return this.vendorAuthService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() vendor: any) {
        return vendor;
    }
}
