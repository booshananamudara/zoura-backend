import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(dto: AddToCartDto, req: any): Promise<{
        message: string;
        cart: import("./entities/cart.entity").Cart;
    }>;
    getCart(req: any): Promise<import("./entities/cart.entity").Cart>;
    updateCartItem(itemId: string, dto: UpdateCartItemDto, req: any): Promise<{
        message: string;
        cart: import("./entities/cart.entity").Cart;
    }>;
    removeFromCart(itemId: string, req: any): Promise<{
        message: string;
        cart: import("./entities/cart.entity").Cart;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
