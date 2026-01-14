import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialService {
    getStatus(): string {
        return 'Social module is running';
    }
}
