import { ProductsService } from './products.service';
import { CloudinaryService } from '../../common/cloudinary';
export declare class ProductsController {
    private readonly productsService;
    private readonly cloudinaryService;
    constructor(productsService: ProductsService, cloudinaryService: CloudinaryService);
    create(files: Express.Multer.File[], dataString: string, req: any): Promise<{
        message: string;
        product: import("./entities").Product;
    }>;
    findAll(limit?: string, offset?: string, category?: string, search?: string): Promise<{
        products: import("./entities").Product[];
        total: number;
    }>;
    findMyProducts(req: any): Promise<import("./entities").Product[]>;
    findOne(id: string): Promise<import("./entities").Product>;
}
