import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { VendorOrdersController } from './vendor-orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../commerce/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart, Product])],
    controllers: [OrdersController, VendorOrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule { }

