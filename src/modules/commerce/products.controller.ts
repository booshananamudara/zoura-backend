import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.VENDOR)
    async create(@Body() createProductDto: CreateProductDto, @Request() req) {
        // req.user contains { id, email, role: 'VENDOR' }
        const product = await this.productsService.create(
            createProductDto,
            req.user.id,
        );
        return {
            message: 'Product created successfully and submitted for approval',
            product,
        };
    }

    /**
     * PUBLIC API: Get all approved products for mobile app
     * Supports pagination, category filtering, and name search
     */
    @Get()
    async findAll(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAllPublic({
            limit: limit ? parseInt(limit, 10) : 20,
            offset: offset ? parseInt(offset, 10) : 0,
            category,
            search,
        });
    }

    @Get('my-products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.VENDOR)
    async findMyProducts(@Request() req) {
        // req.user contains { id, email, role: 'VENDOR' }
        return this.productsService.findMyProducts(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }
}
