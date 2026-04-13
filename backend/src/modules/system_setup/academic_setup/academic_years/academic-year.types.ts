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
