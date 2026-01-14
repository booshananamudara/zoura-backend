import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
export declare class VendorsService {
    private vendorRepository;
    constructor(vendorRepository: Repository<Vendor>);
    create(createVendorDto: CreateVendorDto): Promise<Vendor>;
    findAll(): Promise<Vendor[]>;
    findOne(id: string): Promise<Vendor>;
    approve(id: string): Promise<Vendor>;
}
