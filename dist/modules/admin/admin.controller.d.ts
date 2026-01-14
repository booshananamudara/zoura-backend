import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
}
