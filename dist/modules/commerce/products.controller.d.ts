import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any): Promise<{
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
