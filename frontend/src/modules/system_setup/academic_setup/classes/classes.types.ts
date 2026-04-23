// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\classes.types.ts

export interface Section {
  id?: number;
  section_code: string;
  section_name: string;
  room_id?: number | null;
  room_number?: string;
  capacity?: number;  // Made optional
  current_strength?: number;
  start_time?: string | null;
  end_time?: string | null;
  display_order?: number;
  status?: number;
  description?: string;
}

export interface ClassDB {
  out_id: number;
  out_class_code: string;
  out_class_name: string;
  out_class_number: number;
  out_academic_level: string;
  out_status_name: string;
  out_sections: Section[];
  out_created_dt: string;
  out_updated_dt: string;
  out_message: string | null;
}

export interface Class {
  id: number;
  classCode: string;
  className: string;
  classNumber: number;
  academicLevel: string;
  status: string;
  sections: Section[];
  createdDt?: string;
  updatedDt?: string;
  // Added missing properties
  classRomanNumeral?: string;
  displayOrder?: number;
  minAgeRequired?: number;
  maxAgeRequired?: number;
  description?: string;
  class_code?: string;
  class_name?: string;
  class_number?: number;
  academic_level?: string;
}

export interface CreateClassPayload {
  schoolId: number;
  classCode: string;
  className: string;
  classNumber: number;
  academicLevelId: number;
  classRomanNumeral?: string;
  displayOrder?: number;
  minAgeRequired?: number;
  maxAgeRequired?: number;
  description?: string;
  sections?: Omit<Section, 'id'>[];
}

export interface UpdateClassPayload {
  id: number;
  schoolId: number;
  className?: string;
  classRomanNumeral?: string;
  displayOrder?: number;
  minAgeRequired?: number;
  maxAgeRequired?: number;
  description?: string;
  sections?: Section[];
  sectionsToDelete?: number[];
}

export interface ListClassParams {
  schoolId?: number;
  id?: number;
  status?: number;
  limit?: number;
  offset?: number;
}

export interface ListClassResponse {
  success: boolean;
  items: ClassDB[];
  total: number;
}

export interface SingleClassResponse {
  success: boolean;
  data?: ClassDB;
  message?: string;
}