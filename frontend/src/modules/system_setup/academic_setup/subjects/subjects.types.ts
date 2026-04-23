// =====================================================
// Subject Types
// =====================================================

export interface ClassMapping {
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

export interface SubjectDB {
  out_id: number;
  out_subject_code: string;
  out_subject_name: string;
  out_subject_short_name: string | null;
  out_subject_type: string | null;
  out_subject_category: string | null;
  out_status_name: string;
  out_class_mappings: ClassMapping[] | null;
  out_created_dt: string;
  out_updated_dt: string;
  out_message: string | null;
}

export interface Subject {
  id: number;
  subjectCode: string;
  subjectName: string;
  subjectShortName: string | null;
  subjectType: string | null;
  subjectCategory: string | null;
  status: string;
  classMappings: ClassMapping[];
  createdDt: string;
  updatedDt: string;
  // Additional fields for form
  subjectCategoryId?: number;
  languageGroupId?: number;
  subjectLevel?: number;
  parentSubjectId?: number;
  defaultTheoryCredits?: number;
  defaultPracticalCredits?: number;
  defaultPassingMarksTheory?: number;
  defaultPassingMarksPractical?: number;
  defaultMaxMarksTheory?: number;
  defaultMaxMarksPractical?: number;
  defaultMinAttendancePercent?: number;
  isGradeOnly?: boolean;
  hasPractical?: boolean;
  defaultPracticalGroupSize?: number;
  labRequired?: boolean;
  labId?: number;
  isOptional?: boolean;
  isCoScholastic?: boolean;
  coScholasticAreaId?: number;
  globalDisplayOrder?: number;
  description?: string;
}

export interface StatusOption {
  id: number;
  status_id: number;
  status_name: string;
  status_desc: string;
}

export interface CreateClassMappingPayload {
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
}

export interface UpdateClassMappingPayload extends CreateClassMappingPayload {
  id?: number;
}

export interface CreateSubjectPayload {
  schoolId: number;
  subjectCode: string;
  subjectName: string;
  subjectShortName?: string;
  subjectType?: string;
  subjectCategoryId?: number;
  languageGroupId?: number;
  subjectLevel?: number;
  parentSubjectId?: number;
  defaultTheoryCredits?: number;
  defaultPracticalCredits?: number;
  defaultPassingMarksTheory?: number;
  defaultPassingMarksPractical?: number;
  defaultMaxMarksTheory?: number;
  defaultMaxMarksPractical?: number;
  defaultMinAttendancePercent?: number;
  isGradeOnly?: boolean;
  hasPractical?: boolean;
  defaultPracticalGroupSize?: number;
  labRequired?: boolean;
  labId?: number;
  isOptional?: boolean;
  isCoScholastic?: boolean;
  coScholasticAreaId?: number;
  globalDisplayOrder?: number;
  description?: string;
  classMappings?: CreateClassMappingPayload[];
}

export interface UpdateSubjectPayload {
  id: number;
  schoolId: number;
  subjectCode?: string;
  subjectName?: string;
  subjectShortName?: string;
  subjectType?: string;
  subjectCategoryId?: number;
  languageGroupId?: number;
  subjectLevel?: number;
  parentSubjectId?: number;
  defaultTheoryCredits?: number;
  defaultPracticalCredits?: number;
  defaultPassingMarksTheory?: number;
  defaultPassingMarksPractical?: number;
  defaultMaxMarksTheory?: number;
  defaultMaxMarksPractical?: number;
  defaultMinAttendancePercent?: number;
  isGradeOnly?: boolean;
  hasPractical?: boolean;
  defaultPracticalGroupSize?: number;
  labRequired?: boolean;
  labId?: number;
  isOptional?: boolean;
  isCoScholastic?: boolean;
  coScholasticAreaId?: number;
  globalDisplayOrder?: number;
  description?: string;
  classMappings?: UpdateClassMappingPayload[];
  mappingsToDelete?: number[];
}

export interface ListSubjectParams {
  schoolId?: number;
  id?: number;
  status?: number;
  subjectType?: string;
  subjectCategoryId?: number;
  classId?: number;
  limit?: number;
  offset?: number;
}

export interface ListSubjectResponse {
  success: boolean;
  items: SubjectDB[];
  total: number;
}

export interface SingleSubjectResponse {
  success: boolean;
  data?: SubjectDB;
  message?: string;
}

export interface StatusOptionsResponse {
  success: boolean;
  data: StatusOption[];
  message?: string;
}