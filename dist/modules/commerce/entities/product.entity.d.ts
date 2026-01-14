import { ApprovalStatus } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
export declare class Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    is_zoura_mall: boolean;
    approval_status: ApprovalStatus;
    vendor: Vendor;
    created_at: Date;
    updated_at: Date;
}
