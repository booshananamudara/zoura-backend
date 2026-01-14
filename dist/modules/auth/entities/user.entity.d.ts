import { SubscriptionTier } from '@/common/enums';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    nic: string;
    subscription_tier: SubscriptionTier;
    created_at: Date;
    updated_at: Date;
}
