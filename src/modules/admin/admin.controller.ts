import { Controller, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Patch('vendors/:id/approve')
    async approveVendor(@Param('id') id: string) {
        const vendor = await this.adminService.approveVendor(id);
        return {
            message: 'Vendor approved successfully',
            vendor,
        };
    }

    @Patch('products/:id/approve')
    async approveProduct(@Param('id') id: string) {
        const product = await this.adminService.approveProduct(id);
        return {
            message: 'Product approved successfully',
            product,
        };
    }

    @Get('vendors')
    getAllVendors() {
        return this.adminService.getAllVendors();
    }

    @Get('products')
    getAllProducts() {
        return this.adminService.getAllProducts();
    }

    @Get('approvals/vendors')
    async getPendingVendors() {
        return this.adminService.getPendingVendors();
    }

    @Get('approvals/products')
    async getPendingProducts() {
        return this.adminService.getPendingProducts();
    }

    @Patch('products/:id/reject')
    async rejectProduct(@Param('id') id: string) {
        const product = await this.adminService.rejectProduct(id);
        return {
            message: 'Product rejected successfully',
            product,
        };
    }
}

