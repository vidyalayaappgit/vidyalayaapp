// academic-year.types.ts

/**
 * Allowed operations for fn_manage_academic_year
 */
export enum AcademicYearOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  AUTHORIZE = 'AUTHORIZE',
  VIEW = 'VIEW',
}

/**
 * Input parameters for the PL/pgSQL function fn_manage_academic_year.
 * All optional fields accept null to allow the function to use defaults.
 */
export interface AcademicYearParams {
  operation: AcademicYearOperation;
  userId: number;
  schoolId?: number | null;
  id?: number | null;
  yearName?: string | null;
  yearCode?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isCurrent?: boolean | null;
  auditUserId?: number | null;
  statusFilter?: string | null;
  limit?: number | null;
  offset?: number | null;
  includeInactive?: boolean | null;
}

/**
 * Return type of the function: one row of the result set.
 * The message field contains success/error information.
 */
export interface AcademicYearRecord {
  id: number | null;
  school_id: number | null;
  year_code: string | null;
  year_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_current: boolean | null;
  status_name: string | null;
  created_dt: Date | null;
  updated_dt: Date | null;
  message: string | null;
}

export type AcademicYearListResult = AcademicYearRecord[];

/**
 * Operation result with success flag and message
 */
export interface AcademicYearOperationResult {
  success: boolean;
  data?: AcademicYearRecord;
  message?: string;
}