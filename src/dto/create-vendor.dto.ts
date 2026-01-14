import { IsString, IsUUID } from 'class-validator';

export class CreateVendorDto {
    @IsUUID()
    userId: string;

    @IsString()
    shopName: string;

    @IsString()
    bankDetails: string;
}
