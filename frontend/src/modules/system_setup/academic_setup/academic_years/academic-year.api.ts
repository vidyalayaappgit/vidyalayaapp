// academic-year.api.ts

// academic-year.api.ts

import {
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
  ListAcademicYearParams,
  AcademicYear,
  AcademicYearDB,
  SingleAcademicYearResponse,
  BasicResponse,
} from './academic-year.types';

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
  
  // Backend expects camelCase query keys
  if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

  const url = `${basePath}?${searchParams.toString()}`;
  console.log('API URL:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  console.log('API Response status:', response.status);
  const payload = await handleResponse<{
  success: boolean;
  items: AcademicYearDB[];
  total: number;
}>(response);

  console.log('API Payload:', payload);
  
const mappedItems = (payload.items ?? []).map((item: any) => ({
  id: item.out_id,
  schoolId: item.out_school_id,
  yearName: item.out_year_name,
  yearCode: item.out_year_code,
  startDate: item.out_start_date,
  endDate: item.out_end_date,
  isCurrent: item.out_is_current,
  status: item.out_status_name,
  createdDt: item.out_created_dt,
  updatedDt: item.out_updated_dt,
}));

return {
  items: mappedItems,
  total: payload.total ?? mappedItems.length,
};
}

export async function getAcademicYearById(basePath: string, id: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}`, { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Academic year not found');
  }
  return payload.data;
}

export async function createAcademicYear(basePath: string, data: CreateAcademicYearPayload): Promise<AcademicYear> {
  // Convert to API shape (camelCase + date strings)
  const body = {
    schoolId: data.schoolId,
    yearName: data.yearName,
    yearCode: data.yearCode,
    startDate: data.startDate.toISOString().split('T')[0],
    endDate: data.endDate.toISOString().split('T')[0],
    isCurrent: data.isCurrent ?? false,
  };

  console.log('Creating academic year with body:', body);

  const response = await fetch(basePath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  console.log('Create response payload:', payload);
  
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to create academic year');
  }
  return payload.data;
}

export async function updateAcademicYear(basePath: string, data: UpdateAcademicYearPayload): Promise<AcademicYear> {
  const body: any = {
    schoolId: data.schoolId,
  };
  
  if (data.yearName !== undefined) body.yearName = data.yearName;
  if (data.yearCode !== undefined) body.yearCode = data.yearCode;
  if (data.startDate !== undefined) body.startDate = data.startDate.toISOString().split('T')[0];
  if (data.endDate !== undefined) body.endDate = data.endDate.toISOString().split('T')[0];
  if (data.isCurrent !== undefined) body.isCurrent = data.isCurrent;

  console.log('Updating academic year with body:', body);

  const response = await fetch(`${basePath}/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  console.log('Update response payload:', payload);
  
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to update academic year');
  }
  return payload.data;
}

export async function deleteAcademicYear(basePath: string, id: number, schoolId: number): Promise<{ message: string }> {
  console.log(`Deleting academic year ID: ${id}, School ID: ${schoolId}`);
  
  const response = await fetch(`${basePath}/${id}?schoolId=${schoolId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  const payload = await handleResponse<BasicResponse>(response);
  console.log('Delete response payload:', payload);
  
  return { message: payload.message || 'Deleted successfully' };
}

export async function authorizeAcademicYear(basePath: string, id: number, schoolId: number): Promise<AcademicYear> {
  console.log(`Authorizing academic year ID: ${id}, School ID: ${schoolId}`);
  
  const response = await fetch(`${basePath}/${id}/authorize?schoolId=${schoolId}`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  console.log('Authorize response payload:', payload);
  
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to authorize academic year');
  }
  return payload.data;
}
