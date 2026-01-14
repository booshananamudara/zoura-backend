import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any): Promise<{
        message: string;
        order: import("./entities/order.entity").Order;
    }>;
    getOrderHistory(req: any): Promise<import("./entities/order.entity").Order[]>;
    getOrderById(orderId: string, req: any): Promise<import("./entities/order.entity").Order>;
}
