import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../commerce/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productRepository: Repository<Product>);
    addToCart(user: User, dto: AddToCartDto): Promise<Cart>;
    getCart(user: User): Promise<Cart>;
    updateCartItem(user: User, itemId: string, dto: UpdateCartItemDto): Promise<Cart>;
    removeFromCart(user: User, itemId: string): Promise<Cart>;
    clearCart(user: User): Promise<void>;
    private calculateAndSaveTotal;
}
