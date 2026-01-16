import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Query,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { CloudinaryService } from '../../common/cloudinary';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    /**
     * Create product with image uploads
     * Accepts multipart form data with:
     * - images: array of image files
     * - data: JSON string containing product details and variants
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.VENDOR)
    @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 images
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('data') dataString: string,
        @Request() req,
    ) {
        // Parse the JSON data from form
        let productData: CreateProductDto;
        try {
            productData = JSON.parse(dataString || '{}');
        } catch (e) {
            throw new BadRequestException('Invalid product data format');
        }

        // Upload images to Cloudinary if provided
        let imageUrls: string[] = [];
        if (files && files.length > 0) {
            imageUrls = await this.cloudinaryService.uploadImages(files);
        }

        // Create product with images and variants
        const product = await this.productsService.create(
            productData,
            req.user.id,
            imageUrls,
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

