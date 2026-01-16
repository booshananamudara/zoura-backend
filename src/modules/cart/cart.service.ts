import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { User } from '../auth/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
    ) { }

    /**
     * Add item to cart or update quantity if already exists
     * Now supports variants - stock is checked from variant if variantId is provided
     */
    async addToCart(user: User, dto: AddToCartDto): Promise<Cart> {
        const { productId, variantId, quantity } = dto;

        // Find product
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['variants'],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Find and validate variant if provided
        let variant: ProductVariant | null = null;
        let availableStock: number;

        if (variantId) {
            variant = await this.variantRepository.findOne({
                where: { id: variantId, product: { id: productId } },
            });

            if (!variant) {
                throw new NotFoundException('Product variant not found');
            }

            availableStock = variant.stock;
        } else if (product.variants && product.variants.length > 0) {
            // If no variantId but product has variants, use first variant
            variant = product.variants[0];
            availableStock = variant.stock;
        } else {
            // Fallback for products without variants (shouldn't happen after migration)
            availableStock = 0;
        }

        if (availableStock < quantity) {
            throw new BadRequestException(
                `Insufficient stock. Only ${availableStock} items available.`,
            );
        }

        // Find or create cart for user
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.variant'],
        });

        if (!cart) {
            cart = this.cartRepository.create({
                user,
                total_price: 0,
                items: [],
            });
            await this.cartRepository.save(cart);
        }

        // Check if item already in cart (matching both product and variant)
        const existingItem = cart.items.find(
            (item) => 
                item.product.id === productId && 
                (item.variant?.id === variant?.id || (!item.variant && !variant))
        );

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;

            if (availableStock < newQuantity) {
                throw new BadRequestException(
                    `Cannot add ${quantity} more. Only ${availableStock - existingItem.quantity} items available.`,
                );
            }

            existingItem.quantity = newQuantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            // Calculate price (base price + variant override if any)
            const basePrice = parseFloat(product.price.toString());
            const priceOverride = variant?.price_override ? parseFloat(variant.price_override.toString()) : 0;
            const finalPrice = basePrice + priceOverride;

            // Create new cart item
            const cartItem = this.cartItemRepository.create({
                cart,
                product,
                variant: variant || undefined,
                quantity,
                price_at_add: finalPrice,
            });
            await this.cartItemRepository.save(cartItem);
        }

        // Recalculate total price
        return this.calculateAndSaveTotal(cart.id);
    }

    /**
     * Get user's cart with all items
     */
    async getCart(user: User): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = this.cartRepository.create({
                user,
                total_price: 0,
                items: [],
            });
            await this.cartRepository.save(cart);
        }

        return cart;
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(
        user: User,
        itemId: string,
        dto: UpdateCartItemDto,
    ): Promise<Cart> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'cart.user', 'product', 'variant'],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (cartItem.cart.user.id !== user.id) {
            throw new BadRequestException('This item does not belong to your cart');
        }

        // Check stock from variant if available, otherwise from first product variant
        let availableStock = 0;
        if (cartItem.variant) {
            availableStock = cartItem.variant.stock;
        } else {
            // Fallback: get product variants
            const product = await this.productRepository.findOne({
                where: { id: cartItem.product.id },
                relations: ['variants'],
            });
            if (product?.variants && product.variants.length > 0) {
                availableStock = product.variants[0].stock;
            }
        }

        if (availableStock < dto.quantity) {
            throw new BadRequestException(
                `Insufficient stock. Only ${availableStock} items available.`,
            );
        }

        cartItem.quantity = dto.quantity;
        await this.cartItemRepository.save(cartItem);

        // Recalculate total
        return this.calculateAndSaveTotal(cartItem.cart.id);
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(user: User, itemId: string): Promise<Cart> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'cart.user'],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (cartItem.cart.user.id !== user.id) {
            throw new BadRequestException('This item does not belong to your cart');
        }

        const cartId = cartItem.cart.id;
        await this.cartItemRepository.remove(cartItem);

        // Recalculate total
        return this.calculateAndSaveTotal(cartId);
    }

    /**
     * Clear entire cart
     */
    async clearCart(user: User): Promise<void> {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items'],
        });

        if (cart) {
            await this.cartItemRepository.remove(cart.items);
            cart.total_price = 0;
            await this.cartRepository.save(cart);
        }
    }

    /**
     * Helper: Calculate and save cart total price
     */
    private async calculateAndSaveTotal(cartId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.price_at_add.toString());
            return sum + price * item.quantity;
        }, 0);

        cart.total_price = total;
        return this.cartRepository.save(cart);
    }
}
