import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_DATABASE || 'zoura_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Temporarily true to create tables
        logging: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
    }),
);
