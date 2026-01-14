import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * Checkout - Create order from cart
     * POST /orders
     */
    @Post()
    async checkout(@Request() req) {
        const order = await this.ordersService.createOrder(req.user);
        return {
            message: 'Order placed successfully',
            order,
        };
    }

    /**
     * Get order history
     * GET /orders
     */
    @Get()
    async getOrderHistory(@Request() req) {
        return this.ordersService.getOrderHistory(req.user);
    }

    /**
     * Get specific order details
     * GET /orders/:id
     */
    @Get(':id')
    async getOrderById(@Param('id') orderId: string, @Request() req) {
        return this.ordersService.getOrderById(req.user, orderId);
    }
}
