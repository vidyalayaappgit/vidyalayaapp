// academic-year.service.ts

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import {
  AcademicYearListResult,
  AcademicYearOperation,
  AcademicYearParams,
  AcademicYearRecord,
} from './academic-year.types';

@Injectable()
export class AcademicYearService {
  private readonly logger = new Logger(AcademicYearService.name);

  constructor(@Inject('DATABASE_POOL') private readonly db: Pool) {}

  /**
   * Create a new academic year (status = DRAFT)
   */
  async create(
    params: Omit<AcademicYearParams, 'operation'>,
  ): Promise<AcademicYearRecord | null> {
    const rows = await this.execute({
      ...params,
      operation: AcademicYearOperation.CREATE,
    });
    return rows[0] ?? null;
  }

  /**
   * Update an existing academic year
   */
  async update(
    params: Omit<AcademicYearParams, 'operation'>,
  ): Promise<AcademicYearRecord | null> {
    const rows = await this.execute({
      ...params,
      operation: AcademicYearOperation.UPDATE,
    });
    return rows[0] ?? null;
  }

  /**
   * Delete an academic year (physical deletion)
   */
  async delete(
    params: Omit<AcademicYearParams, 'operation'>,
  ): Promise<AcademicYearRecord | null> {
    const rows = await this.execute({
      ...params,
      operation: AcademicYearOperation.DELETE,
    });
    return rows[0] ?? null;
  }

  /**
   * Authorize (activate) an academic year
   */
  async authorize(
    params: Omit<AcademicYearParams, 'operation'>,
  ): Promise<AcademicYearRecord | null> {
    const rows = await this.execute({
      ...params,
      operation: AcademicYearOperation.AUTHORIZE,
    });
    return rows[0] ?? null;
  }

  /**
   * View academic years with optional filters
   */
  async view(
    params: Omit<AcademicYearParams, 'operation'>,
  ): Promise<AcademicYearListResult> {
    return this.execute({
      ...params,
      operation: AcademicYearOperation.VIEW,
    });
  }

  /**
   * Execute the PostgreSQL function with parameters
   */
  private async execute(params: AcademicYearParams): Promise<AcademicYearListResult> {
    const query = `
      SELECT *
      FROM fn_manage_academic_year(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
    `;

    const values = [
      params.operation,
      params.userId,
      params.schoolId ?? null,
      params.id ?? null,
      params.yearName ?? null,
      params.yearCode ?? null,
      params.startDate ?? null,
      params.endDate ?? null,
      params.isCurrent ?? null,
      params.auditUserId ?? params.userId,
      params.statusFilter ?? null,
      params.limit ?? null,
      params.offset ?? null,
      params.includeInactive ?? true,
    ];

    this.logger.debug(`Executing ${params.operation} operation with userId: ${params.userId}`);

    try {
      const result = await this.db.query<AcademicYearRecord>(query, values);
      return result.rows;
    } catch (error) {
      this.logger.error(`Failed to execute ${params.operation}:`, error);
      throw error;
    }
  }
}