import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {

  private pool: Pool;

  constructor() {

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      max: 20, // max connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });

  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      console.log('PostgreSQL connected successfully');
      client.release();
    } catch (error) {
      console.error('PostgreSQL connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  // Simple Query
  async query(
    sql: string,
    params?: any[]
  ): Promise<QueryResult<any>> {

    const client = await this.pool.connect();

    try {

      const result = await client.query(sql, params);

      return result;

    } catch (error) {

      console.error('Database query error:', error);
      throw error;

    } finally {

      client.release();

    }
  }

  // Transaction Support
  async transaction(callback: (client: PoolClient) => Promise<any>) {

    const client = await this.pool.connect();

    try {

      await client.query('BEGIN');

      const result = await callback(client);

      await client.query('COMMIT');

      return result;

    } catch (error) {

      await client.query('ROLLBACK');

      console.error('Transaction failed:', error);

      throw error;

    } finally {

      client.release();

    }

  }

}