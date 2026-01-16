"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const product_entity_1 = require("../commerce/entities/product.entity");
const product_variant_entity_1 = require("../commerce/entities/product-variant.entity");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    productRepository;
    variantRepository;
    constructor(cartRepository, cartItemRepository, productRepository, variantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }
    async addToCart(user, dto) {
        const { productId, variantId, quantity } = dto;
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['variants'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let variant = null;
        let availableStock;
        if (variantId) {
            variant = await this.variantRepository.findOne({
                where: { id: variantId, product: { id: productId } },
            });
            if (!variant) {
                throw new common_1.NotFoundException('Product variant not found');
            }
            availableStock = variant.stock;
        }
        else if (product.variants && product.variants.length > 0) {
            variant = product.variants[0];
            availableStock = variant.stock;
        }
        else {
            availableStock = 0;
        }
        if (availableStock < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Only ${availableStock} items available.`);
        }
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
        const existingItem = cart.items.find((item) => item.product.id === productId &&
            (item.variant?.id === variant?.id || (!item.variant && !variant)));
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (availableStock < newQuantity) {
                throw new common_1.BadRequestException(`Cannot add ${quantity} more. Only ${availableStock - existingItem.quantity} items available.`);
            }
            existingItem.quantity = newQuantity;
            await this.cartItemRepository.save(existingItem);
        }
        else {
            const basePrice = parseFloat(product.price.toString());
            const priceOverride = variant?.price_override ? parseFloat(variant.price_override.toString()) : 0;
            const finalPrice = basePrice + priceOverride;
            const cartItem = this.cartItemRepository.create({
                cart,
                product,
                variant: variant || undefined,
                quantity,
                price_at_add: finalPrice,
            });
            await this.cartItemRepository.save(cartItem);
        }
        return this.calculateAndSaveTotal(cart.id);
    }
    async getCart(user) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });
        if (!cart) {
            cart = this.cartRepository.create({
                user,
                total_price: 0,
                items: [],
            });
            await this.cartRepository.save(cart);
        }
        return cart;
    }
    async updateCartItem(user, itemId, dto) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'cart.user', 'product', 'variant'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.user.id !== user.id) {
            throw new common_1.BadRequestException('This item does not belong to your cart');
        }
        let availableStock = 0;
        if (cartItem.variant) {
            availableStock = cartItem.variant.stock;
        }
        else {
            const product = await this.productRepository.findOne({
                where: { id: cartItem.product.id },
                relations: ['variants'],
            });
            if (product?.variants && product.variants.length > 0) {
                availableStock = product.variants[0].stock;
            }
        }
        if (availableStock < dto.quantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Only ${availableStock} items available.`);
        }
        cartItem.quantity = dto.quantity;
        await this.cartItemRepository.save(cartItem);
        return this.calculateAndSaveTotal(cartItem.cart.id);
    }
    async removeFromCart(user, itemId) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'cart.user'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.cart.user.id !== user.id) {
            throw new common_1.BadRequestException('This item does not belong to your cart');
        }
        const cartId = cartItem.cart.id;
        await this.cartItemRepository.remove(cartItem);
        return this.calculateAndSaveTotal(cartId);
    }
    async clearCart(user) {
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
    async calculateAndSaveTotal(cartId) {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.product', 'items.product.vendor'],
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const total = cart.items.reduce((sum, item) => {
            const price = parseFloat(item.price_at_add.toString());
            return sum + price * item.quantity;
        }, 0);
        cart.total_price = total;
        return this.cartRepository.save(cart);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map