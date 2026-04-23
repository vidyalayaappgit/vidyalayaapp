// D:\schoolapp\backend\src\modules\system_setup\academic_setup\classes\classes.types.ts
export interface ClassRecord {
  out_id: number | null;
  out_class_code: string | null;
  out_class_name: string | null;
  out_class_number: number | null;
  out_academic_level: string | null;
  out_status_name: string | null;
  out_sections: any | null; // JSONB array of sections
  out_created_dt: Date | null;
  out_updated_dt: Date | null;
  out_message: string | null;
}

export interface SectionRecord {
  id: number;
  section_code: string;
  section_name: string;
  room_id: number | null;
  room_number?: string;
  capacity: number;
  current_strength: number;
  start_time: string | null;
  end_time: string | null;
  display_order: number;
  status: number;
}

export type ClassListResult = ClassRecord[];
