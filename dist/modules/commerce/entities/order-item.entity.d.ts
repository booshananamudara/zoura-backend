import { Order } from './order.entity';
import { Product } from './product.entity';
export declare class OrderItem {
    id: string;
    quantity: number;
    price_at_purchase: number;
    order: Order;
    product: Product;
    created_at: Date;
    updated_at: Date;
}
