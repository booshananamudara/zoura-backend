import { ApprovalStatus } from '@/common/enums';
import { Product } from '@/modules/commerce/entities/product.entity';
export declare class Vendor {
    id: string;
    email: string;
    password: string;
    name: string;
    shop_name: string;
    bank_details: string;
    approval_status: ApprovalStatus;
    products: Product[];
    created_at: Date;
    updated_at: Date;
}
