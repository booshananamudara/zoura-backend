import { CreateVariantDto } from './create-variant.dto';
export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    category?: string;
    attributes?: Record<string, any>;
    variants?: CreateVariantDto[];
}
