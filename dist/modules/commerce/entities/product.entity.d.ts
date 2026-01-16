import { ApprovalStatus } from '@/common/enums';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
import { ProductVariant } from './product-variant.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    attributes: Record<string, any>;
    is_zoura_mall: boolean;
    approval_status: ApprovalStatus;
    vendor: Vendor;
    variants: ProductVariant[];
    created_at: Date;
    updated_at: Date;
    get totalStock(): number;
}
