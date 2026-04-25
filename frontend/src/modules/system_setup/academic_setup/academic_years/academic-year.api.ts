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

function parseTerms(termsData: any): any[] {
  if (!termsData) return [];
  
  // If it's already an array
  if (Array.isArray(termsData)) return termsData;
  
  // If it's a string, try to parse it
  if (typeof termsData === 'string') {
    try {
      const parsed = JSON.parse(termsData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  // If it's an object with values
  if (typeof termsData === 'object') {
    // Check if it's a JSON object that needs to be converted
    if (termsData && typeof termsData === 'object') {
      return Object.values(termsData);
    }
  }
  
  return [];
}

export async function getAcademicYears(
  basePath: string,
  params: ListAcademicYearParams = {}
): Promise<{ items: AcademicYear[]; total: number }> {
  const searchParams = new URLSearchParams();
  
  if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

  const url = `${basePath}?${searchParams.toString()}`;
  console.log('API URL:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const payload = await handleResponse<{
    success: boolean;
    items: any[];
    total: number;
  }>(response);

  console.log('API Payload items:', payload.items);

  const mappedItems = (payload.items ?? []).map((item: any) => {
    // Parse terms from the response
    let terms = [];
    if (item.out_terms || item.terms) {
      const termsData = item.out_terms || item.terms;
      terms = parseTerms(termsData);
      console.log(`Terms for year ${item.out_id || item.id}:`, terms);
    }

    return {
      id: item.out_id || item.id,
      schoolId: item.out_school_id || item.school_id,
      yearName: item.out_year_name || item.year_name,
      yearCode: item.out_year_code || item.year_code,
      startDate: item.out_start_date || item.start_date,
      endDate: item.out_end_date || item.end_date,
      isCurrent: item.out_is_current || item.is_current,
      status: item.out_status_name || item.status_name,
      terms: terms,
      createdDt: item.out_created_dt || item.created_dt,
      updatedDt: item.out_updated_dt || item.updated_dt,
    };
  });

  console.log('Mapped items with terms:', mappedItems);

  return {
    items: mappedItems,
    total: payload.total ?? mappedItems.length,
  };
}

export async function getAcademicYearById(basePath: string, id: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}`, { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Academic year not found');
  }
  return payload.data;
}

export async function createAcademicYear(basePath: string, data: CreateAcademicYearPayload): Promise<AcademicYear> {
  const body: any = {
    schoolId: data.schoolId,
    yearName: data.yearName,
    yearCode: data.yearCode,
    startDate: data.startDate.toISOString().split('T')[0],
    endDate: data.endDate.toISOString().split('T')[0],
  };

  if (data.terms && data.terms.length > 0) {
    body.terms = data.terms;
  }

  console.log('Creating academic year with body:', JSON.stringify(body, null, 2));

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
  if (data.terms !== undefined) body.terms = data.terms;

  console.log('Updating academic year with body:', JSON.stringify(body, null, 2));

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
  const response = await fetch(`${basePath}/${id}?schoolId=${schoolId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  const payload = await handleResponse<BasicResponse>(response);
  return { message: payload.message || 'Deleted successfully' };
}

export async function activateAcademicYear(basePath: string, id: number, schoolId: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}/activate?schoolId=${schoolId}`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to activate academic year');
  }
  return payload.data;
}

export async function completeAcademicYear(basePath: string, id: number, schoolId: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}/complete?schoolId=${schoolId}`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to complete academic year');
  }
  return payload.data;
}

export async function cancelAcademicYear(basePath: string, id: number, schoolId: number): Promise<AcademicYear> {
  const response = await fetch(`${basePath}/${id}/cancel?schoolId=${schoolId}`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleAcademicYearResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to cancel academic year');
  }
  return payload.data;
}