import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Vendor } from '../auth/entities/vendor.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Vendor, Order, OrderItem])],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class CommerceModule { }
