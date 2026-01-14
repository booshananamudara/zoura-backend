import { Order } from './order.entity';
import { Product } from '../../commerce/entities/product.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    price_at_purchase: number;
    created_at: Date;
}
