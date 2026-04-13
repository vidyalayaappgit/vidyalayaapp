import { Injectable, Logger } from '@nestjs/common';

import { PostgresService } from '@core/database/postgres.service';

import {
  AcademicYearRecord,
  AcademicYearListResult,
} from './academic-year.types';

type Operation = 'create' | 'update' | 'delete' | 'authorize' | 'view';

@Injectable()
export class AcademicYearService {
  private readonly logger = new Logger(AcademicYearService.name);
  private readonly fnName = 'fn_manage_academic_year';

  constructor(private readonly db: PostgresService) {}

  /**
   * Helper to execute the underlying database function with positional parameters.
   */
  private async callFunction(
    operation: Operation,
    params: {
      userId: number;
      schoolId?: number;
      id?: number;
      yearName?: string;
      yearCode?: string;
      startDate?: Date;
      endDate?: Date;
      isCurrent?: boolean;
      limit?: number;
      offset?: number;
    },
  ): Promise<AcademicYearListResult> {
    const sql = `SELECT * FROM ${this.fnName}($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
    const values = [
      operation,
      params.userId,
      params.schoolId ?? null,
      params.id ?? null,
      params.yearName ?? null,
      params.yearCode ?? null,
      params.startDate ?? null,
      params.endDate ?? null,
      params.isCurrent ?? null,
      params.limit ?? 100,
      params.offset ?? 0,
    ];

    const result = await this.db.query<AcademicYearRecord>(sql, values);
    return result.rows ?? [];
  }

  /**
   * Create a new academic year.
   */
  async create(data: {
    schoolId: number;
    yearName: string;
    yearCode: string;
    startDate: Date;
    endDate: Date;
    isCurrent?: boolean;
    userId: number;
    auditUserId?: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('create', {
      userId: data.userId,
      schoolId: data.schoolId,
      yearName: data.yearName,
      yearCode: data.yearCode,
      startDate: data.startDate,
      endDate: data.endDate,
      ...(data.isCurrent !== undefined ? { isCurrent: data.isCurrent } : {}),
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Create academic year -> school:${data.schoolId}, name:${data.yearName}`);
    return rows[0] ?? null;
  }

  /**
   * Update an existing academic year.
   */
  async update(data: {
    id: number;
    schoolId: number;
    yearName?: string;
    yearCode?: string;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
    userId: number;
    auditUserId?: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('update', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      ...(data.yearName !== undefined ? { yearName: data.yearName } : {}),
      ...(data.yearCode !== undefined ? { yearCode: data.yearCode } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
      ...(data.isCurrent !== undefined ? { isCurrent: data.isCurrent } : {}),
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Update academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * Delete an academic year.
   */
  async delete(data: {
    id: number;
    schoolId: number;
    userId: number;
    auditUserId?: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('delete', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Delete academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * Authorize (activate) an academic year.
   */
  async authorize(data: {
    id: number;
    schoolId: number;
    userId: number;
    auditUserId?: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('authorize', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Authorize academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * View academic years with optional filters.
   */
  async view(data: {
    schoolId?: number;
    id?: number;
    statusFilter?: string;
    includeInactive?: boolean;
    limit?: number;
    offset?: number;
    userId: number;
  }): Promise<AcademicYearListResult> {
    const rows = await this.callFunction('view', {
      userId: data.userId,
      ...(data.schoolId !== undefined ? { schoolId: data.schoolId } : {}),
      ...(data.id !== undefined ? { id: data.id } : {}),
      limit: data.limit ?? 100,
      offset: data.offset ?? 0,
    });

    this.logger.debug(`Viewing academic years returned ${rows.length} rows`);
    return rows;
  }

  /**
   * Retrieve RBAC/form controls for the Academic Years page.
   */
  async getControls(data: { userId: number; schoolId: number }): Promise<string[]> {
    const result = await this.db.query<{ controls: string[] }>(
      `SELECT fn_academic_year_controls($1,$2) AS controls`,
      [data.userId, data.schoolId],
    );

    return result.rows?.[0]?.controls ?? [];
  }
}
