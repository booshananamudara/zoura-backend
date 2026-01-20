import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsString()
    content: string;

    @IsString()
    @IsOptional()
    image_url?: string; // Will be set by controller after upload
}
