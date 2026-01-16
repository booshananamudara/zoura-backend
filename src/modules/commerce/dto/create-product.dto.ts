import { IsString, IsNumber, Min, IsOptional, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsObject()
    attributes?: Record<string, any>;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    variants?: CreateVariantDto[];

    // Images are handled via file upload, not in DTO
}

