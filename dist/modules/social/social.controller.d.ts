import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    getStatus(): string;
}
