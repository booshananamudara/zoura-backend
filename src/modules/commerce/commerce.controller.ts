import { Controller, Get } from '@nestjs/common';
import { CommerceService } from './commerce.service';

@Controller('commerce')
export class CommerceController {
    constructor(private readonly commerceService: CommerceService) { }

    @Get()
    getStatus(): string {
        return this.commerceService.getStatus();
    }
}
