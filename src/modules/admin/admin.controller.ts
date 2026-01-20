import { Controller, Patch, Param, UseGuards, Get, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';

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
        return this.adminService.getPendingVendorApprovals();
    }

    @Get('approvals/products')
    async getPendingProducts() {
        return this.adminService.getPendingProductApprovals();
    }

    @Patch('products/:id/reject')
    async rejectProduct(@Param('id') id: string) {
        const product = await this.adminService.rejectProduct(id);
        return {
            message: 'Product rejected successfully',
            product,
        };
    }

    // =========== SOCIAL MODERATION ===========

    /**
     * Get all pending posts awaiting moderation
     * GET /admin/social/pending
     */
    @Get('social/pending')
    async getPendingPosts() {
        return this.adminService.getPendingPosts();
    }

    /**
     * Update post moderation status
     * PATCH /admin/social/:id/status
     */
    @Patch('social/:id/status')
    async updatePostStatus(
        @Param('id') id: string,
        @Body() dto: UpdatePostStatusDto,
    ) {
        const post = await this.adminService.updatePostStatus(id, dto.status);
        return {
            message: `Post ${dto.status.toLowerCase()} successfully`,
            post,
        };
    }
}

