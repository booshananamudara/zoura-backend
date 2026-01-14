import { Repository } from 'typeorm';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
export declare class AdminService {
    private vendorRepository;
    private productRepository;
    constructor(vendorRepository: Repository<Vendor>, productRepository: Repository<Product>);
    approveVendor(id: string): Promise<Vendor>;
    approveProduct(id: string): Promise<Product>;
    getAllVendors(): Promise<Vendor[]>;
    getAllProducts(): Promise<Product[]>;
    getPendingVendors(): Promise<Vendor[]>;
    getPendingProducts(): Promise<Product[]>;
    rejectProduct(id: string): Promise<Product>;
}
