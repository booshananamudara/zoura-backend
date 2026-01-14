import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './modules/auth/entities/user.entity';
import { Vendor } from './modules/auth/entities/vendor.entity';
import { Product } from './modules/commerce/entities/product.entity';
import { Order } from './modules/commerce/entities/order.entity';
import { OrderItem } from './modules/commerce/entities/order-item.entity';
import { SocialPost } from './modules/social/entities/social-post.entity';
import { Comment } from './modules/social/entities/comment.entity';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'zoura_db',
    entities: [User, Vendor, Product, Order, OrderItem, SocialPost, Comment],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
