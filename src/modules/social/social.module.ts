import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { Review } from './entities/review.entity';
import { Post } from './entities/post.entity';
import { Product } from '../commerce/entities/product.entity';
import { CloudinaryModule } from '@/common/cloudinary';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review, Post, Product]),
        CloudinaryModule,
    ],
    controllers: [SocialController],
    providers: [SocialService],
    exports: [SocialService],
})
export class SocialModule { }
