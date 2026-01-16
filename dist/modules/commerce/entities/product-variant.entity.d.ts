import { Product } from './product.entity';
export declare class ProductVariant {
    id: string;
    product: Product;
    color: string;
    size: string;
    sku: string;
    stock: number;
    price_override: number;
    created_at: Date;
    updated_at: Date;
}
