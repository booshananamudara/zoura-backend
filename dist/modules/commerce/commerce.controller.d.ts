import { CommerceService } from './commerce.service';
export declare class CommerceController {
    private readonly commerceService;
    constructor(commerceService: CommerceService);
    getStatus(): string;
}
