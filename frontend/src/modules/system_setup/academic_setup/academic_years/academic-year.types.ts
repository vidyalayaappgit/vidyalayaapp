// academic-year.types.ts

/**
 * Represents an academic year as returned by the backend.
 * Matches the backend AcademicYearRecord.
 */
export interface AcademicYear {
  id: number | null;
  school_id: number | null;
  year_code: string | null;
  year_name: string | null;
  start_date: string | null;   // ISO date string
  end_date: string | null;
  is_current: boolean | null;
  status_name: string | null;   // 'DRAFT', 'ACTIVE', etc.
  created_dt: string | null;
  updated_dt: string | null;
  message?: string | null;
}

/**
 * Payload for creating a new academic year.
 */
export interface CreateAcademicYearPayload {
  schoolId: number;
  yearName: string;
  yearCode: string;
  startDate: Date;
  endDate: Date;
  isCurrent?: boolean;
}

/**
 * Payload for updating an academic year.
 * All fields are optional except id and schoolId.
 */
export interface UpdateAcademicYearPayload {
  id: number;
  schoolId: number;
  yearName?: string;
  yearCode?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
}

/**
 * Parameters for fetching the academic year list.
 */
export interface ListAcademicYearParams {
  schoolId?: number;
  statusFilter?: string;
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Response from a single-record operation (create, update, delete, authorize).
 */
export interface SingleRecordResponse {
  success: boolean;
  data?: AcademicYear;
  message?: string;
}