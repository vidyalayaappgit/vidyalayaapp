// =====================================================
// Subject Types
// =====================================================

export interface ClassMappingRecord {
  id: number;
  class_id: number;
  class_name: string;
  class_number: number;
  subject_code_override: string | null;
  display_name: string | null;
  subject_number: number;
  display_order: number;
  theory_credits: number;
  practical_credits: number;
  total_credits: number;
  theory_hours_per_week: number;
  practical_hours_per_week: number;
  total_hours_per_week: number;
  passing_marks_theory: number;
  passing_marks_practical: number;
  max_marks_theory: number;
  max_marks_practical: number;
  min_attendance_percent: number;
  is_optional: boolean;
  practical_group_size: number | null;
  is_taught: boolean;
  suggested_teacher_id: number | null;
  teacher_name: string | null;
  status: number;
}

export interface SubjectRecord {
  out_id: number | null;
  out_subject_code: string | null;
  out_subject_name: string | null;
  out_subject_short_name: string | null;
  out_subject_type: string | null;
  out_subject_category: string | null;
  out_status_name: string | null;
  out_class_mappings: ClassMappingRecord[] | null;
  out_created_dt: Date | null;
  out_updated_dt: Date | null;
  out_message: string | null;
}


// Status master

export interface StatusMaster {
  id: number;
  status_id: number;
  status_name: string;
  status_desc: string;
}

export interface GetStatusOptionsQuery {
  formId?: number; // For filtering by specific form
}


export type SubjectListResult = SubjectRecord[];
