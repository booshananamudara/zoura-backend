import { AdminService } from './admin.service';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<import("./admin.service").DashboardStats>;
    approveVendor(id: string): Promise<{
        message: string;
        vendor: import("../auth/entities").Vendor;
    }>;
    approveProduct(id: string): Promise<{
        message: string;
        product: import("../commerce/entities").Product;
    }>;
    getAllVendors(): Promise<import("../auth/entities").Vendor[]>;
    getAllProducts(): Promise<import("../commerce/entities").Product[]>;
    getPendingVendors(): Promise<import("../auth/entities").Vendor[]>;
    getPendingProducts(): Promise<import("../commerce/entities").Product[]>;
    rejectProduct(id: string): Promise<{
        message: string;
        product: import("../commerce/entities").Product;
    }>;
    getPendingPosts(): Promise<import("../social/entities").Post[]>;
    updatePostStatus(id: string, dto: UpdatePostStatusDto): Promise<{
        message: string;
        post: import("../social/entities").Post;
    }>;
}
