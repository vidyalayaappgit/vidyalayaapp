import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '@core/database/postgres.service';
import { AcademicYearRecord, AcademicYearListResult } from './academic-year.types';

type Operation = 'create' | 'edit' | 'delete' | 'activate' | 'complete' | 'cancel' | 'view';

@Injectable()
export class AcademicYearService {
  private readonly logger = new Logger(AcademicYearService.name);
  private readonly fnName = 'fn_manage_academic_year';

  constructor(private readonly db: PostgresService) {}

  /**
   * Helper to execute the underlying database function with positional parameters.
   * Now supports 12 parameters including p_terms_json
   */
  private async callFunction(
    operation: Operation,
    params: {
      userId: number;
      schoolId?: number | null;
      id?: number | null;
      yearName?: string | null;
      yearCode?: string | null;
      startDate?: Date | null;
      endDate?: Date | null;
      isCurrent?: boolean | null;
      limit?: number;
      offset?: number;
      termsJson?: any | null;  // JSONB for terms
    },
  ): Promise<AcademicYearListResult> {
    // SQL function expects 12 parameters (added p_terms_json)
    const sql = `SELECT * FROM ${this.fnName}($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;
    const values = [
      operation,
      params.userId,
      params.schoolId !== undefined ? params.schoolId : null,
      params.id !== undefined ? params.id : null,
      params.yearName !== undefined ? params.yearName : null,
      params.yearCode !== undefined ? params.yearCode : null,
      params.startDate !== undefined ? params.startDate : null,
      params.endDate !== undefined ? params.endDate : null,
      params.isCurrent !== undefined ? params.isCurrent : null,
      params.limit ?? 100,
      params.offset ?? 0,
      params.termsJson !== undefined ? params.termsJson : null,
    ];

    const result = await this.db.query<AcademicYearRecord>(sql, values);
    return result.rows ?? [];
  }

  /**
   * Create a new academic year (always DRAFT status) with optional terms
   */
  async create(data: {
    schoolId: number;
    yearName: string;
    yearCode: string;
    startDate: Date;
    endDate: Date;
    userId: number;
    terms?: any[];  // Optional terms array
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('create', {
      userId: data.userId,
      schoolId: data.schoolId,
      yearName: data.yearName,
      yearCode: data.yearCode,
      startDate: data.startDate,
      endDate: data.endDate,
      termsJson: data.terms ? JSON.stringify(data.terms) : null,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Create academic year -> school:${data.schoolId}, name:${data.yearName}`);
    return rows[0] ?? null;
  }

  /**
   * Update an existing academic year (only DRAFT or CANCELLED status) with optional terms
   */
  async update(data: {
    id: number;
    schoolId: number;
    yearName?: string;
    yearCode?: string;
    startDate?: Date;
    endDate?: Date;
    userId: number;
    terms?: any[];  // Optional terms array
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('edit', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      yearName: data.yearName ?? null,
      yearCode: data.yearCode ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      termsJson: data.terms ? JSON.stringify(data.terms) : null,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Update academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * Delete an academic year permanently (only DRAFT status)
   */
  async delete(data: {
    id: number;
    schoolId: number;
    userId: number;
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
   * Activate academic year (DRAFT -> ACTIVE)
   * Only one ACTIVE year per school
   */
  async activate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('activate', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Activate academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * Complete academic year (ACTIVE -> COMPLETED)
   */
  async complete(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('complete', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Complete academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * Cancel academic year (DRAFT or ACTIVE -> CANCELLED)
   */
  async cancel(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    const rows = await this.callFunction('cancel', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Cancel academic year -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  /**
   * View academic years with optional filters
   */
  async view(data: {
    schoolId?: number;
    id?: number;
    limit?: number;
    offset?: number;
    userId: number;
  }): Promise<AcademicYearListResult> {
    const rows = await this.callFunction('view', {
      userId: data.userId,
      schoolId: data.schoolId ?? null,
      id: data.id ?? null,
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