import { Controller, Get } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) { }

    @Get()
    getStatus(): string {
        return this.socialService.getStatus();
    }
}
