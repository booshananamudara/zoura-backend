import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateVariantDto {
    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsString()
    sku: string;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price_override?: number;
}
