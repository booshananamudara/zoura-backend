import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Vendor } from '../auth/entities/vendor.entity';
import { CreateProductDto } from './dto/create-product.dto';
export interface PublicProductQuery {
    limit: number;
    offset: number;
    category?: string;
    search?: string;
}
export declare class ProductsService {
    private productRepository;
    private variantRepository;
    private vendorRepository;
    constructor(productRepository: Repository<Product>, variantRepository: Repository<ProductVariant>, vendorRepository: Repository<Vendor>);
    create(createProductDto: CreateProductDto, vendorId: string, imageUrls?: string[]): Promise<Product>;
    findAllPublic(query: PublicProductQuery): Promise<{
        products: Product[];
        total: number;
    }>;
    findAll(): Promise<Product[]>;
    findMyProducts(vendorId: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    findVariant(variantId: string): Promise<ProductVariant>;
}
