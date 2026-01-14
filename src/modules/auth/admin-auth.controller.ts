import { Controller, Post, Body } from '@nestjs/common';
import { AdminAuthService, AdminLoginDto } from './admin-auth.service';

@Controller('auth/admin')
export class AdminAuthController {
    constructor(private adminAuthService: AdminAuthService) { }

    @Post('login')
    async login(@Body() loginDto: AdminLoginDto) {
        return this.adminAuthService.login(loginDto);
    }
}
