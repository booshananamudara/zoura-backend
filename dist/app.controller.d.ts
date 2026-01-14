import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHealthCheck(): Promise<{
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
