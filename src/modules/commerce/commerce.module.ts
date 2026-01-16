import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Vendor } from '../auth/entities/vendor.entity';
import { CloudinaryModule } from '../../common/cloudinary';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductVariant, Vendor]),
        CloudinaryModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class CommerceModule { }

