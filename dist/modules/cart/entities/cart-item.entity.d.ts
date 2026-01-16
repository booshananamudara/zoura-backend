import { Cart } from './cart.entity';
import { Product } from '../../commerce/entities/product.entity';
import { ProductVariant } from '../../commerce/entities/product-variant.entity';
export declare class CartItem {
    id: string;
    cart: Cart;
    product: Product;
    variant: ProductVariant;
    quantity: number;
    price_at_add: number;
    created_at: Date;
    updated_at: Date;
}
