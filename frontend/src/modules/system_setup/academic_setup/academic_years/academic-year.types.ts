// academic-year.types.ts

export interface AcademicTerm {
  id?: number;
  term_name: string;
  term_code: string;
  term_order: number;
  start_date: string;
  end_date: string;
}

export interface AcademicYearDB {
  out_id: number;
  out_school_id: number;
  out_year_name: string;
  out_year_code: string;
  out_start_date: string;
  out_end_date: string;
  out_is_current: boolean;
  out_status_name: string;
  out_terms: any; // JSON string
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
  status: string;
  terms: AcademicTerm[];
  createdDt?: string;
  updatedDt?: string;
}

export interface CreateAcademicYearPayload {
  schoolId: number;
  yearName: string;
  yearCode: string;
  startDate: Date;
  endDate: Date;
  terms?: Omit<AcademicTerm, 'id'>[];
}

export interface UpdateAcademicYearPayload {
  id: number;
  schoolId: number;
  yearName?: string;
  yearCode?: string;
  startDate?: Date;
  endDate?: Date;
  terms?: Omit<AcademicTerm, 'id'>[];
}

export interface ListAcademicYearParams {
  schoolId?: number;
  limit?: number;
  offset?: number;
}

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