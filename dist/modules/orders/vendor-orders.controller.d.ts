import { OrdersService } from './orders.service';
import { OrderStatus } from './enums/order-status.enum';
export declare class VendorOrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getMyOrders(req: any): Promise<any[]>;
    updateOrderStatus(orderId: string, status: OrderStatus, req: any): Promise<{
        message: string;
        order: import("./entities/order.entity").Order;
    }>;
}
