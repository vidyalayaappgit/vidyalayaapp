// academic-year.api.ts

import { CreateAcademicYearPayload, UpdateAcademicYearPayload, ListAcademicYearParams, AcademicYear } from './academic-year.types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export async function getAcademicYears(
  basePath: string,
  params: ListAcademicYearParams = {}
): Promise<{ items: AcademicYear[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
  if (params.statusFilter) searchParams.append('status', params.statusFilter);
  if (params.includeInactive !== undefined) searchParams.append('includeInactive', params.includeInactive.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

  const url = `${basePath}?${searchParams.toString()}`;
  const response = await fetch(url, { credentials: 'include' });
  return handleResponse<{ items: AcademicYear[]; total: number }>(response);
}

export async function getAcademicYearById(basePath: string, id: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}`, { credentials: 'include' });
  return handleResponse<AcademicYear>(response);
}

export async function createAcademicYear(basePath: string, data: CreateAcademicYearPayload): Promise<AcademicYear> {
  const response = await fetch(basePath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<AcademicYear>(response);
}

export async function updateAcademicYear(basePath: string, data: UpdateAcademicYearPayload): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<AcademicYear>(response);
}

export async function deleteAcademicYear(basePath: string, id: number, schoolId: number): Promise<{ message: string }> {
  const response = await fetch(`${basePath}/${id}?schoolId=${schoolId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse<{ message: string }>(response);
}

export async function authorizeAcademicYear(basePath: string, id: number, schoolId: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}/authorize?schoolId=${schoolId}`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse<AcademicYear>(response);
}
