// academic-year.types.ts

/**
 * Represents an academic year as returned by the backend.
 * Matches the backend AcademicYearRecord.
 */
export interface AcademicYearDB {
  out_id: number;
  out_school_id: number;
  out_year_name: string;
  out_year_code: string;
  out_start_date: string;
  out_end_date: string;
  out_is_current: boolean;
  out_status_name: string;
  out_created_dt: string;
  out_updated_dt: string;
}


export interface AcademicYear {
  id: number;
  schoolId: number;
  yearName: string;
  yearCode: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: string;  // Will be 'FRESH' or 'AUTHORISED' from database
  createdDt?: string;
  updatedDt?: string;
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
  limit?: number;
  offset?: number;
}

/**
 * Generic API envelopes coming from the backend.
 */
export interface ListAcademicYearResponse {
  success: boolean;
  items: AcademicYear[];
  total: number;
  message?: string | null;
}

export interface SingleAcademicYearResponse {
  success: boolean;
  data?: AcademicYear;
  message?: string | null;
}

export interface BasicResponse {
  success: boolean;
  message?: string | null;
}
