import { Cart } from './cart.entity';
import { Product } from '../../commerce/entities/product.entity';
export declare class CartItem {
    id: string;
    cart: Cart;
    product: Product;
    quantity: number;
    price_at_add: number;
    created_at: Date;
    updated_at: Date;
}
