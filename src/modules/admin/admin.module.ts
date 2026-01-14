import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vendor, Product])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }
