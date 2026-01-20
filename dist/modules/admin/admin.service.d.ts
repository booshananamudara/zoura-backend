import { Repository } from 'typeorm';
import { Vendor } from '../auth/entities/vendor.entity';
import { Product } from '../commerce/entities/product.entity';
import { ProductVariant } from '../commerce/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';
import { Post } from '../social/entities/post.entity';
import { PostStatus } from '@/common/enums';
export interface LowStockItem {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    stock: number;
    productName: string;
    productId: string;
}
export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalVendors: number;
    lowStockItems: LowStockItem[];
}
export declare class AdminService {
    private vendorRepository;
    private productRepository;
    private variantRepository;
    private orderRepository;
    private postRepository;
    constructor(vendorRepository: Repository<Vendor>, productRepository: Repository<Product>, variantRepository: Repository<ProductVariant>, orderRepository: Repository<Order>, postRepository: Repository<Post>);
    getDashboardStats(): Promise<DashboardStats>;
    getAllVendors(): Promise<Vendor[]>;
    getAllProducts(): Promise<Product[]>;
    getPendingVendorApprovals(): Promise<Vendor[]>;
    getPendingProductApprovals(): Promise<Product[]>;
    approveVendor(id: string): Promise<Vendor>;
    approveProduct(id: string): Promise<Product>;
    rejectProduct(id: string): Promise<Product>;
    getPendingPosts(): Promise<Post[]>;
    updatePostStatus(postId: string, status: PostStatus): Promise<Post>;
}
