import { Connection } from 'typeorm';
export declare class AppService {
    private readonly connection;
    constructor(connection: Connection);
    getHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: {
                status: string;
                type: "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-mysql" | "aurora-postgres" | "expo" | "better-sqlite3" | "capacitor" | "spanner";
                database: any;
            };
        };
        application: {
            name: string;
            version: string;
            environment: string;
        };
    }>;
}
