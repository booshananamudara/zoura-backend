import { Injectable } from '@nestjs/common';

@Injectable()
export class CommerceService {
    getStatus(): string {
        return 'Commerce module is running';
    }
}
