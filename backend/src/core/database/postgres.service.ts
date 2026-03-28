import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT') || 5432,
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB_NAME'),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      this.logger.log('✅ PostgreSQL connected successfully');
      client.release();
    } catch (error) {
      this.logger.error('❌ PostgreSQL connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  // 🔹 Simple Query
  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    try {
      return await this.pool.query<T>(sql, params);
    } catch (error) {
      this.logger.error('❌ Database query error', error);
      throw error;
    }
  }

  // 🔹 Transaction Support
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const result = await callback(client);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('❌ Transaction failed', error);
      throw error;
    } finally {
      client.release();
    }
  }
}