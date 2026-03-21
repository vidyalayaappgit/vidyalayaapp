export interface User {
  id: number;
  user_name: string;
}

export interface Permission {
  page_id: number;
  form_id: number;
  control_code: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  permissions: Permission[];
}