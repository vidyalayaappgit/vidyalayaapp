// D:\schoolapp\backend\src\modules\system_setup\academic_setup\classes\classes.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '@core/database/postgres.service';
import { ClassRecord, ClassListResult } from './classes.types';

type Operation = 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'authorize' | 'view';

@Injectable()
export class ClassService {
  private readonly logger = new Logger(ClassService.name);
  private readonly fnName = 'fn_manage_class_section';

  constructor(private readonly db: PostgresService) {}

  private async callFunction(
    operation: Operation,
    params: {
      userId: number;
      schoolId?: number;
      id?: number;
      data?: any; // JSONB data for create/update
      limit?: number;
      offset?: number;
    },
  ): Promise<ClassListResult> {
    const sql = `SELECT * FROM ${this.fnName}($1,$2,$3,$4,$5,$6,$7)`;
    const values = [
      operation,
      params.userId,
      params.schoolId ?? null,
      params.id ?? null,
      params.data ?? null,
      params.limit ?? 100,
      params.offset ?? 0,
    ];

    const result = await this.db.query<ClassRecord>(sql, values);
    return result.rows ?? [];
  }

  async create(data: {
    schoolId: number;
    classData: {
      class_code: string;
      class_name: string;
      class_number: number;
      academic_level_id: number;
      class_roman_numeral?: string;
      display_order?: number;
      min_age_required?: number;
      max_age_required?: number;
      description?: string;
    };
    sections?: Array<{
      section_code: string;
      section_name: string;
      room_id?: number;
      capacity?: number;
      start_time?: string;
      end_time?: string;
      display_order?: number;
      description?: string;
    }>;
    userId: number;
  }): Promise<ClassRecord> {
    const payload = {
      ...data.classData,
      sections: data.sections || []
    };

    const rows = await this.callFunction('create', {
      userId: data.userId,
      schoolId: data.schoolId,
      data: payload,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Create class -> school:${data.schoolId}, name:${data.classData.class_name}`);
    return rows[0] ?? null;
  }

  async update(data: {
    id: number;
    schoolId: number;
    classData: {
      class_name?: string;
      class_roman_numeral?: string;
      display_order?: number;
      min_age_required?: number;
      max_age_required?: number;
      description?: string;
    };
    sections?: Array<{
      id?: number;
      section_code: string;
      section_name: string;
      room_id?: number;
      capacity?: number;
      start_time?: string;
      end_time?: string;
      display_order?: number;
      description?: string;
    }>;
    sectionsToDelete?: number[];
    userId: number;
  }): Promise<ClassRecord> {
    const payload: any = {
      ...data.classData,
      sections: data.sections || []
    };
    
    if (data.sectionsToDelete?.length) {
      payload.sections_to_delete = data.sectionsToDelete;
    }

    const rows = await this.callFunction('update', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      data: payload,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Update class -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  async delete(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<ClassRecord> {
    const rows = await this.callFunction('delete', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Delete class -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  async activate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<ClassRecord> {
    const rows = await this.callFunction('activate', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Activate class -> id:${data.id}`);
    return rows[0] ?? null;
  }

  async deactivate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<ClassRecord> {
    const rows = await this.callFunction('deactivate', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Deactivate class -> id:${data.id}`);
    return rows[0] ?? null;
  }

  async authorize(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<ClassRecord> {
    const rows = await this.callFunction('authorize', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Authorize class -> id:${data.id}`);
    return rows[0] ?? null;
  }

  async view(data: {
    schoolId?: number;
    id?: number;
    status?: number;
    limit?: number;
    offset?: number;
    userId: number;
  }): Promise<ClassListResult> {
    const rows = await this.callFunction('view', {
      userId: data.userId,
      ...(data.schoolId !== undefined ? { schoolId: data.schoolId } : {}),
      ...(data.id !== undefined ? { id: data.id } : {}),
      ...(data.status !== undefined ? { data: { status: data.status } } : {}),
      limit: data.limit ?? 100,
      offset: data.offset ?? 0,
    });

    this.logger.debug(`Viewing classes returned ${rows.length} rows`);
    return rows;
  }

  async getControls(data: {
    userId: number;
    schoolId: number;
  }): Promise<string[]> {
    const result = await this.db.query<{ controls: string[] }>(
      `SELECT fn_class_controls($1,$2) AS controls`,
      [data.userId, data.schoolId],
    );

    return result.rows?.[0]?.controls ?? [];
  }
}
