import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

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
