"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./modules/auth/entities/user.entity");
const vendor_entity_1 = require("./modules/auth/entities/vendor.entity");
const product_entity_1 = require("./modules/commerce/entities/product.entity");
const order_entity_1 = require("./modules/commerce/entities/order.entity");
const order_item_entity_1 = require("./modules/commerce/entities/order-item.entity");
const social_post_entity_1 = require("./modules/social/entities/social-post.entity");
const comment_entity_1 = require("./modules/social/entities/comment.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'zoura_db',
    entities: [user_entity_1.User, vendor_entity_1.Vendor, product_entity_1.Product, order_entity_1.Order, order_item_entity_1.OrderItem, social_post_entity_1.SocialPost, comment_entity_1.Comment],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
//# sourceMappingURL=data-source.js.map