import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { OrderStatus } from './enums/order-status.enum';

@Controller('vendors/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VENDOR)
export class VendorOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * Get all orders containing vendor's products
     * GET /vendors/orders/my-orders
     */
    @Get('my-orders')
    async getMyOrders(@Request() req) {
        // For vendors, req.user.id IS the vendor ID
        return this.ordersService.getVendorOrders(req.user.id);
    }

    /**
     * Update order status (SHIPPED or DELIVERED)
     * PATCH /vendors/orders/:orderId/status
     */
    @Patch(':orderId/status')
    async updateOrderStatus(
        @Param('orderId') orderId: string,
        @Body('status') status: OrderStatus,
        @Request() req,
    ) {
        const order = await this.ordersService.updateVendorOrderStatus(
            req.user.id,  // For vendors, req.user.id IS the vendor ID
            orderId,
            status,
        );
        return {
            message: `Order status updated to ${status}`,
            order,
        };
    }
}

