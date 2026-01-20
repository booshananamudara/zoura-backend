import { User } from '@/modules/auth/entities/user.entity';
import { Product } from '@/modules/commerce/entities/product.entity';
export declare class Review {
    id: string;
    user: User;
    product: Product;
    rating: number;
    comment: string;
    images: string[];
    created_at: Date;
}
