import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    /**
     * Add item to cart
     * POST /cart
     */
    @Post()
    async addToCart(@Body() dto: AddToCartDto, @Request() req) {
        const cart = await this.cartService.addToCart(req.user, dto);
        return {
            message: 'Item added to cart successfully',
            cart,
        };
    }

    /**
     * Get user's cart
     * GET /cart
     */
    @Get()
    async getCart(@Request() req) {
        return this.cartService.getCart(req.user);
    }

    /**
     * Update cart item quantity
     * PATCH /cart/:itemId
     */
    @Patch(':itemId')
    async updateCartItem(
        @Param('itemId') itemId: string,
        @Body() dto: UpdateCartItemDto,
        @Request() req,
    ) {
        const cart = await this.cartService.updateCartItem(req.user, itemId, dto);
        return {
            message: 'Cart item updated successfully',
            cart,
        };
    }

    /**
     * Remove item from cart
     * DELETE /cart/:itemId
     */
    @Delete(':itemId')
    async removeFromCart(@Param('itemId') itemId: string, @Request() req) {
        const cart = await this.cartService.removeFromCart(req.user, itemId);
        return {
            message: 'Item removed from cart',
            cart,
        };
    }

    /**
     * Clear entire cart
     * DELETE /cart
     */
    @Delete()
    async clearCart(@Request() req) {
        await this.cartService.clearCart(req.user);
        return {
            message: 'Cart cleared successfully',
        };
    }
}
