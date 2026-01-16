import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
export interface VendorLowStockItem {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    stock: number;
    productName: string;
    productId: string;
}
export interface VendorDashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    lowStockItems: VendorLowStockItem[];
    shopName: string;
}
export declare class VendorsService {
    private vendorRepository;
    private productRepository;
    private variantRepository;
    private orderItemRepository;
    constructor(vendorRepository: Repository<Vendor>, productRepository: Repository<Product>, variantRepository: Repository<ProductVariant>, orderItemRepository: Repository<OrderItem>);
    create(createVendorDto: CreateVendorDto): Promise<Vendor>;
    findAll(): Promise<Vendor[]>;
    findOne(id: string): Promise<Vendor>;
    approve(id: string): Promise<Vendor>;
    getDashboardStats(vendorId: string): Promise<VendorDashboardStats>;
}
