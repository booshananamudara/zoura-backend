import { Order } from './order.entity';
import { Product } from '../../commerce/entities/product.entity';
import { ProductVariant } from '../../commerce/entities/product-variant.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    product: Product;
    variant: ProductVariant;
    quantity: number;
    price_at_purchase: number;
    created_at: Date;
}
