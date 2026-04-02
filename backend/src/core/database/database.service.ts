import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  /**
   * Execute a query and return the result with typed rows.
   * @param text - SQL query string
   * @param params - Query parameters
   * @returns QueryResult with rows of type T
   */
  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  /**
   * Get a database client from the pool (for transactions)
   */
  async getClient() {
    return this.pool.connect();
  }

  /**
   * Execute a query and return the first row or null
   */
  async queryOne<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.pool.query<T>(text, params);
    return result.rows[0] || null;
  }

  /**
   * Execute a query and return all rows
   */
  async queryAll<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query<T>(text, params);
    return result.rows;
  }

  /**
   * Execute a query that returns a single value
   */
  async queryValue<T = any>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.pool.query(text, params);
    return result.rows[0]?.[0] || null;
  }
}