import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PostgresService } from '@core/database/postgres.service';
import { SubjectRecord, SubjectListResult, StatusMaster } from './subjects.types';

type Operation =
  | 'create'
  | 'update'
  | 'delete'
  | 'activate'
  | 'deactivate'
  | 'view';

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name);
  private readonly fnName = 'fn_manage_subject';

  constructor(private readonly db: PostgresService) {}

  private async callFunction(
    operation: Operation,
    params: {
      userId: number;
      schoolId?: number;
      id?: number;
      data?: any;
      limit?: number;
      offset?: number;
    },
  ): Promise<SubjectListResult> {
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

    const result = await this.db.query<SubjectRecord>(sql, values);
    return result.rows ?? [];
  }

  // =====================================================
  // CREATE Operation
  // =====================================================
  async create(data: {
    schoolId: number;
    subjectData: {
      subject_code: string;
      subject_name: string;
      subject_short_name?: string;
      subject_type?: string;
      subject_category_id?: number;
      language_group_id?: number;
      subject_level?: number;
      parent_subject_id?: number;
      default_theory_credits?: number;
      default_practical_credits?: number;
      default_passing_marks_theory?: number;
      default_passing_marks_practical?: number;
      default_max_marks_theory?: number;
      default_max_marks_practical?: number;
      default_min_attendance_percent?: number;
      is_grade_only?: boolean;
      has_practical?: boolean;
      default_practical_group_size?: number;
      lab_required?: boolean;
      lab_id?: number;
      is_optional?: boolean;
      is_co_scholastic?: boolean;
      co_scholastic_area_id?: number;
      global_display_order?: number;
      description?: string;
    };
    classMappings?: Array<{
      class_id: number;
      subject_code_override?: string;
      display_name?: string;
      subject_number?: number;
      display_order?: number;
      theory_credits?: number;
      practical_credits?: number;
      theory_hours_per_week?: number;
      practical_hours_per_week?: number;
      passing_marks_theory?: number;
      passing_marks_practical?: number;
      max_marks_theory?: number;
      max_marks_practical?: number;
      min_attendance_percent?: number;
      is_optional?: boolean;
      practical_group_size?: number;
      is_taught?: boolean;
      suggested_teacher_id?: number;
    }>;
    userId: number;
  }): Promise<SubjectRecord | null> {
    const payload: Record<string, unknown> = {
      ...data.subjectData,
      class_mappings: data.classMappings || [],
    };

    const rows = await this.callFunction('create', {
      userId: data.userId,
      schoolId: data.schoolId,
      data: payload,
      limit: 1,
      offset: 0,
    });

    this.logger.log(
      `Create subject -> school:${data.schoolId}, code:${data.subjectData.subject_code}`,
    );
    return rows[0] ?? null;
  }

  // =====================================================
  // UPDATE Operation
  // =====================================================
  async update(data: {
    id: number;
    schoolId: number;
    subjectData: {
      subject_code?: string;
      subject_name?: string;
      subject_short_name?: string;
      subject_type?: string;
      subject_category_id?: number;
      language_group_id?: number;
      subject_level?: number;
      parent_subject_id?: number;
      default_theory_credits?: number;
      default_practical_credits?: number;
      default_passing_marks_theory?: number;
      default_passing_marks_practical?: number;
      default_max_marks_theory?: number;
      default_max_marks_practical?: number;
      default_min_attendance_percent?: number;
      is_grade_only?: boolean;
      has_practical?: boolean;
      default_practical_group_size?: number;
      lab_required?: boolean;
      lab_id?: number;
      is_optional?: boolean;
      is_co_scholastic?: boolean;
      co_scholastic_area_id?: number;
      global_display_order?: number;
      description?: string;
    };
    classMappings?: Array<{
      id?: number;
      class_id?: number;
      subject_code_override?: string;
      display_name?: string;
      subject_number?: number;
      display_order?: number;
      theory_credits?: number;
      practical_credits?: number;
      theory_hours_per_week?: number;
      practical_hours_per_week?: number;
      passing_marks_theory?: number;
      passing_marks_practical?: number;
      max_marks_theory?: number;
      max_marks_practical?: number;
      min_attendance_percent?: number;
      is_optional?: boolean;
      practical_group_size?: number;
      is_taught?: boolean;
      suggested_teacher_id?: number;
    }>;
    mappingsToDelete?: number[];
    userId: number;
  }): Promise<SubjectRecord | null> {
    const payload: Record<string, unknown> = {
      ...data.subjectData,
    };

    if (data.classMappings && data.classMappings.length > 0) {
      payload['class_mappings'] = data.classMappings;
    }

    if (data.mappingsToDelete && data.mappingsToDelete.length > 0) {
      payload['mappings_to_delete'] = data.mappingsToDelete;
    }

    const rows = await this.callFunction('update', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      data: payload,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Update subject -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  // =====================================================
  // DELETE Operation
  // =====================================================
  async delete(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<SubjectRecord | null> {
    const rows = await this.callFunction('delete', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Delete subject -> id:${data.id}, school:${data.schoolId}`);
    return rows[0] ?? null;
  }

  // =====================================================
  // ACTIVATE Operation
  // =====================================================
  async activate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<SubjectRecord | null> {
    const rows = await this.callFunction('activate', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Activate subject -> id:${data.id}`);
    return rows[0] ?? null;
  }

  // =====================================================
  // DEACTIVATE Operation
  // =====================================================
  async deactivate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<SubjectRecord | null> {
    const rows = await this.callFunction('deactivate', {
      userId: data.userId,
      schoolId: data.schoolId,
      id: data.id,
      limit: 1,
      offset: 0,
    });

    this.logger.log(`Deactivate subject -> id:${data.id}`);
    return rows[0] ?? null;
  }

  // =====================================================
  // VIEW Operation
  // =====================================================
  async view(data: {
    schoolId?: number;
    id?: number;
    status?: number;
    subjectType?: string;
    subjectCategoryId?: number;
    classId?: number;
    limit?: number;
    offset?: number;
    userId: number;
  }): Promise<SubjectListResult> {
    const filterData: Record<string, number | string> = {};

    if (data.status !== undefined) {
      filterData['status'] = data.status;
    }

    if (data.subjectType !== undefined) {
      filterData['subject_type'] = data.subjectType;
    }

    if (data.subjectCategoryId !== undefined) {
      filterData['subject_category_id'] = data.subjectCategoryId;
    }

    if (data.classId !== undefined) {
      filterData['class_id'] = data.classId;
    }

    const rows = await this.callFunction('view', {
      userId: data.userId,
      ...(data.schoolId !== undefined ? { schoolId: data.schoolId } : {}),
      ...(data.id !== undefined ? { id: data.id } : {}),
      ...(Object.keys(filterData).length > 0 ? { data: filterData } : {}),
      limit: data.limit ?? 100,
      offset: data.offset ?? 0,
    });

    this.logger.debug(`View subjects returned ${rows.length} rows`);
    return rows;
  }

  // =====================================================
  // GET CONTROLS (RBAC Permissions)
  // =====================================================
  async getControls(data: {
    userId: number;
    schoolId: number;
  }): Promise<string[]> {
    const result = await this.db.query<{ control_code: string }>(
      `SELECT control_code FROM fn_get_user_form_controls($1,$2,$3)`,
      [data.userId, data.schoolId, 'subject_management_main'],
    );

    return result.rows.map((row) => row.control_code);
  }

  // =====================================================
  // GET STATUS OPTIONS from form_status_master
  // =====================================================
  async getStatusOptions(formId?: number): Promise<StatusMaster[]> {
    try {
      let query = `
        SELECT 
          id,
          status_id,
          status_name,
          status_desc
        FROM form_status_master
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      if (formId) {
        query += ` AND form_id = $${params.length + 1}`;
        params.push(formId);
      }
      
      // Order by status_id for consistent display
      query += ` ORDER BY status_id ASC`;
      
      const result = await this.db.query<StatusMaster>(query, params);
      
      if (!result.rows.length && formId) {
        // Fallback to get all statuses if none found for specific form
        const fallbackResult = await this.db.query<StatusMaster>(
          `SELECT id, status_id, status_name, status_desc 
           FROM form_status_master 
           ORDER BY status_id ASC`
        );
        return fallbackResult.rows;
      }
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching status options:', error);
      throw new InternalServerErrorException('Failed to fetch status options');
    }
  }

  // =====================================================
  // GET STATUS BY ID
  // =====================================================
  async getStatusById(statusId: number): Promise<StatusMaster | null> {
    try {
      const result = await this.db.query<StatusMaster>(
        `SELECT id, status_id, status_name, status_desc 
         FROM form_status_master 
         WHERE status_id = $1`,
        [statusId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error('Error fetching status by ID:', error);
      return null;
    }
  }
}