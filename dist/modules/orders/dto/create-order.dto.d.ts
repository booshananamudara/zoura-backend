export declare class ShippingAddressDto {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
}
export declare class CreateOrderDto {
    shippingAddress: ShippingAddressDto;
    paymentMethod?: string;
}
