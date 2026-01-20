import { IsString, IsInt, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    productId: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[]; // Cloudinary URLs (uploaded via separate endpoint)
}
