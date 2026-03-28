import { apiFetch } from '@core/api/api';

export interface LoginPayload {
  groupCode: string;
  userCode: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    user_code: string;
  };
  context: {
    role: unknown;
    school: unknown;
  };
}

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}