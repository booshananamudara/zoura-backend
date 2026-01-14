import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
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
    private vendorRepository;
    constructor(productRepository: Repository<Product>, vendorRepository: Repository<Vendor>);
    create(createProductDto: CreateProductDto, vendorId: string): Promise<Product>;
    findAllPublic(query: PublicProductQuery): Promise<{
        products: Product[];
        total: number;
    }>;
    findAll(): Promise<Product[]>;
    findMyProducts(vendorId: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
}
