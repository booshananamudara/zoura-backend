import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingAddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsString()
    postalCode: string;

    @IsString()
    phone: string;
}

export class CreateOrderDto {
    @IsObject()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @IsOptional()
    @IsString()
    paymentMethod?: string;
}
