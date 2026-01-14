import { VendorsService } from './vendors.service';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: CreateVendorDto): Promise<{
        message: string;
        vendor: import("./entities").Vendor;
    }>;
    findAll(): Promise<import("./entities").Vendor[]>;
    findOne(id: string): Promise<import("./entities").Vendor>;
    approve(id: string): Promise<{
        message: string;
        vendor: import("./entities").Vendor;
    }>;
}
