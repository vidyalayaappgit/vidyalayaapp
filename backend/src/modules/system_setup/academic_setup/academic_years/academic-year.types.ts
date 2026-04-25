export interface AcademicTerm {
  id: number;
  term_name: string;
  term_code: string;
  term_order: number;
  start_date: Date | string;
  end_date: Date | string;
}

export interface AcademicYearRecord {
  id: number | null;
  school_id: number | null;
  year_code: string | null;
  year_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_current: boolean | null;
  status_name: string | null;  // DRAFT, ACTIVE, COMPLETED, CANCELLED
  terms: any | null;  // JSONB field for terms
  created_dt: Date | null;
  updated_dt: Date | null;
  message: string | null;
}

export type AcademicYearListResult = AcademicYearRecord[];