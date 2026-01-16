import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from '@/common/enums';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    /**
     * Get dashboard stats for the logged-in vendor
     * Overrides class-level ADMIN role to allow VENDOR access
     */
    @Get('stats')
    @Roles(UserRole.VENDOR)
    async getDashboardStats(@CurrentUser() user: any) {
        return this.vendorsService.getDashboardStats(user.id);
    }

    @Post()
    async create(@Body() createVendorDto: CreateVendorDto) {
        const vendor = await this.vendorsService.create(createVendorDto);
        return {
            message: 'Vendor profile created successfully. Pending approval.',
            vendor,
        };
    }

    @Get()
    findAll() {
        return this.vendorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vendorsService.findOne(id);
    }

    @Patch(':id/approve')
    async approve(@Param('id') id: string) {
        const vendor = await this.vendorsService.approve(id);
        return {
            message: 'Vendor approved successfully',
            vendor,
        };
    }
}
