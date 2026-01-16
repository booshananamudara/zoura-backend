import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vendor, Product, ProductVariant, Order])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }

