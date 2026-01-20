import { IsEnum } from 'class-validator';
import { PostStatus } from '@/common/enums';

export class UpdatePostStatusDto {
    @IsEnum(PostStatus)
    status: PostStatus;
}
