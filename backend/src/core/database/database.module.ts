import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PostgresService } from './postgres.service';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
      inject: [ConfigService],
    },
    PostgresService, // ✅ Add PostgresService as a provider
    DatabaseService, // ✅ Add DatabaseService as a provider
  ],
  exports: ['DATABASE_POOL', PostgresService, DatabaseService], // ✅ Export both services
})
export class DatabaseModule {}