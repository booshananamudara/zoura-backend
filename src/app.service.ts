import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async getHealthStatus() {
    const isDbConnected = this.connection.isInitialized;

    return {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: isDbConnected ? 'connected' : 'disconnected',
          type: this.connection.options.type,
          database: (this.connection.options as any).database,
        },
      },
      application: {
        name: 'Zoura Backend',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }
}
