import {
  CreateSubjectPayload,
  UpdateSubjectPayload,
  ListSubjectParams,
  Subject,
  SubjectDB,
  ListSubjectResponse,
  SingleSubjectResponse,
  StatusOption,
  // StatusOptionsResponse,
} from './subjects.types';

const API_ENDPOINT = '/system_setup/academic_setup/subjects';

// Helper to get auth token
function getAuthToken(): string | null {
  // Try to get token from localStorage (adjust based on your auth setup)
  const token = localStorage.getItem('token');
  if (token) return token;
  
  // Alternative: try to get from sessionStorage
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) return sessionToken;
  
  // Try to get from your auth store (if it persists to localStorage)
  try {
    const authStore = localStorage.getItem('auth-storage');
    if (authStore) {
      const parsed = JSON.parse(authStore);
      return parsed?.state?.auth?.token || null;
    }
  } catch (e) {
    console.error('Error parsing auth store:', e);
  }
  
  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// Helper to create headers with auth token
function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function getSubjects(
  basePath: string,
  params: ListSubjectParams = {}
): Promise<{ items: Subject[]; total: number }> {
  const searchParams = new URLSearchParams();
  
  if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
  if (params.id !== undefined) searchParams.append('id', params.id.toString());
  if (params.status !== undefined) searchParams.append('status', params.status.toString());
  if (params.subjectType !== undefined) searchParams.append('subjectType', params.subjectType);
  if (params.subjectCategoryId !== undefined) searchParams.append('subjectCategoryId', params.subjectCategoryId.toString());
  if (params.classId !== undefined) searchParams.append('classId', params.classId.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

  const url = `${basePath}${API_ENDPOINT}?${searchParams.toString()}`;
  console.log('Fetching subjects from:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: createHeaders()
  });
  
  const payload = await handleResponse<ListSubjectResponse>(response);
  console.log('Response payload:', payload);
  
  const mappedItems = (payload.items ?? []).map((item: SubjectDB) => ({
    id: item.out_id,
    subjectCode: item.out_subject_code,
    subjectName: item.out_subject_name,
    subjectShortName: item.out_subject_short_name,
    subjectType: item.out_subject_type,
    subjectCategory: item.out_subject_category,
    status: item.out_status_name,
    classMappings: item.out_class_mappings || [],
    createdDt: item.out_created_dt,
    updatedDt: item.out_updated_dt,
  }));

  return {
    items: mappedItems,
    total: payload.total ?? mappedItems.length,
  };
}

export async function getSubjectById(basePath: string, id: number): Promise<Subject> {
  const url = `${basePath}${API_ENDPOINT}/${id}`;
  console.log('Fetching subject by id from:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: createHeaders()
  });
  const payload = await handleResponse<SingleSubjectResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Subject not found');
  }
  
  return {
    id: payload.data.out_id,
    subjectCode: payload.data.out_subject_code,
    subjectName: payload.data.out_subject_name,
    subjectShortName: payload.data.out_subject_short_name,
    subjectType: payload.data.out_subject_type,
    subjectCategory: payload.data.out_subject_category,
    status: payload.data.out_status_name,
    classMappings: payload.data.out_class_mappings || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function createSubject(basePath: string, data: CreateSubjectPayload): Promise<Subject> {
  const body = {
    schoolId: data.schoolId,
    subjectCode: data.subjectCode,
    subjectName: data.subjectName,
    subjectShortName: data.subjectShortName,
    subjectType: data.subjectType,
    subjectCategoryId: data.subjectCategoryId,
    languageGroupId: data.languageGroupId,
    subjectLevel: data.subjectLevel,
    parentSubjectId: data.parentSubjectId,
    defaultTheoryCredits: data.defaultTheoryCredits,
    defaultPracticalCredits: data.defaultPracticalCredits,
    defaultPassingMarksTheory: data.defaultPassingMarksTheory,
    defaultPassingMarksPractical: data.defaultPassingMarksPractical,
    defaultMaxMarksTheory: data.defaultMaxMarksTheory,
    defaultMaxMarksPractical: data.defaultMaxMarksPractical,
    defaultMinAttendancePercent: data.defaultMinAttendancePercent,
    isGradeOnly: data.isGradeOnly,
    hasPractical: data.hasPractical,
    defaultPracticalGroupSize: data.defaultPracticalGroupSize,
    labRequired: data.labRequired,
    labId: data.labId,
    isOptional: data.isOptional,
    isCoScholastic: data.isCoScholastic,
    coScholasticAreaId: data.coScholasticAreaId,
    globalDisplayOrder: data.globalDisplayOrder,
    description: data.description,
    classMappings: data.classMappings?.map(m => ({
      classId: m.class_id,
      subjectCodeOverride: m.subject_code_override,
      displayName: m.display_name,
      subjectNumber: m.subject_number,
      displayOrder: m.display_order,
      theoryCredits: m.theory_credits,
      practicalCredits: m.practical_credits,
      theoryHoursPerWeek: m.theory_hours_per_week,
      practicalHoursPerWeek: m.practical_hours_per_week,
      passingMarksTheory: m.passing_marks_theory,
      passingMarksPractical: m.passing_marks_practical,
      maxMarksTheory: m.max_marks_theory,
      maxMarksPractical: m.max_marks_practical,
      minAttendancePercent: m.min_attendance_percent,
      isOptional: m.is_optional,
      practicalGroupSize: m.practical_group_size,
      isTaught: m.is_taught,
      suggestedTeacherId: m.suggested_teacher_id,
    })),
  };

  const url = `${basePath}${API_ENDPOINT}`;
  console.log('Creating subject at:', url);
  console.log('Request body:', body);

  const response = await fetch(url, {
    method: 'POST',
    headers: createHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleSubjectResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to create subject');
  }
  
  return {
    id: payload.data.out_id,
    subjectCode: payload.data.out_subject_code,
    subjectName: payload.data.out_subject_name,
    subjectShortName: payload.data.out_subject_short_name,
    subjectType: payload.data.out_subject_type,
    subjectCategory: payload.data.out_subject_category,
    status: payload.data.out_status_name,
    classMappings: payload.data.out_class_mappings || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function updateSubject(basePath: string, data: UpdateSubjectPayload): Promise<Subject> {
  const body: any = {
    schoolId: data.schoolId,
  };
  
  if (data.subjectCode !== undefined) body.subjectCode = data.subjectCode;
  if (data.subjectName !== undefined) body.subjectName = data.subjectName;
  if (data.subjectShortName !== undefined) body.subjectShortName = data.subjectShortName;
  if (data.subjectType !== undefined) body.subjectType = data.subjectType;
  if (data.subjectCategoryId !== undefined) body.subjectCategoryId = data.subjectCategoryId;
  if (data.languageGroupId !== undefined) body.languageGroupId = data.languageGroupId;
  if (data.subjectLevel !== undefined) body.subjectLevel = data.subjectLevel;
  if (data.parentSubjectId !== undefined) body.parentSubjectId = data.parentSubjectId;
  if (data.defaultTheoryCredits !== undefined) body.defaultTheoryCredits = data.defaultTheoryCredits;
  if (data.defaultPracticalCredits !== undefined) body.defaultPracticalCredits = data.defaultPracticalCredits;
  if (data.defaultPassingMarksTheory !== undefined) body.defaultPassingMarksTheory = data.defaultPassingMarksTheory;
  if (data.defaultPassingMarksPractical !== undefined) body.defaultPassingMarksPractical = data.defaultPassingMarksPractical;
  if (data.defaultMaxMarksTheory !== undefined) body.defaultMaxMarksTheory = data.defaultMaxMarksTheory;
  if (data.defaultMaxMarksPractical !== undefined) body.defaultMaxMarksPractical = data.defaultMaxMarksPractical;
  if (data.defaultMinAttendancePercent !== undefined) body.defaultMinAttendancePercent = data.defaultMinAttendancePercent;
  if (data.isGradeOnly !== undefined) body.isGradeOnly = data.isGradeOnly;
  if (data.hasPractical !== undefined) body.hasPractical = data.hasPractical;
  if (data.defaultPracticalGroupSize !== undefined) body.defaultPracticalGroupSize = data.defaultPracticalGroupSize;
  if (data.labRequired !== undefined) body.labRequired = data.labRequired;
  if (data.labId !== undefined) body.labId = data.labId;
  if (data.isOptional !== undefined) body.isOptional = data.isOptional;
  if (data.isCoScholastic !== undefined) body.isCoScholastic = data.isCoScholastic;
  if (data.coScholasticAreaId !== undefined) body.coScholasticAreaId = data.coScholasticAreaId;
  if (data.globalDisplayOrder !== undefined) body.globalDisplayOrder = data.globalDisplayOrder;
  if (data.description !== undefined) body.description = data.description;
  
  if (data.classMappings !== undefined) {
    body.classMappings = data.classMappings.map(m => ({
      id: m.id,
      classId: m.class_id,
      subjectCodeOverride: m.subject_code_override,
      displayName: m.display_name,
      subjectNumber: m.subject_number,
      displayOrder: m.display_order,
      theoryCredits: m.theory_credits,
      practicalCredits: m.practical_credits,
      theoryHoursPerWeek: m.theory_hours_per_week,
      practicalHoursPerWeek: m.practical_hours_per_week,
      passingMarksTheory: m.passing_marks_theory,
      passingMarksPractical: m.passing_marks_practical,
      maxMarksTheory: m.max_marks_theory,
      maxMarksPractical: m.max_marks_practical,
      minAttendancePercent: m.min_attendance_percent,
      isOptional: m.is_optional,
      practicalGroupSize: m.practical_group_size,
      isTaught: m.is_taught,
      suggestedTeacherId: m.suggested_teacher_id,
    }));
  }
  
  if (data.mappingsToDelete !== undefined) {
    body.mappingsToDelete = data.mappingsToDelete;
  }

  const url = `${basePath}${API_ENDPOINT}/${data.id}`;
  console.log('Updating subject at:', url);
  console.log('Request body:', body);

  const response = await fetch(url, {
    method: 'PUT',
    headers: createHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleSubjectResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to update subject');
  }
  
  return {
    id: payload.data.out_id,
    subjectCode: payload.data.out_subject_code,
    subjectName: payload.data.out_subject_name,
    subjectShortName: payload.data.out_subject_short_name,
    subjectType: payload.data.out_subject_type,
    subjectCategory: payload.data.out_subject_category,
    status: payload.data.out_status_name,
    classMappings: payload.data.out_class_mappings || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function deleteSubject(basePath: string, id: number, schoolId: number): Promise<{ message: string }> {
  const url = `${basePath}${API_ENDPOINT}/${id}?schoolId=${schoolId}`;
  console.log('Deleting subject at:', url);
  
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: createHeaders(),
  });
  
  const payload = await handleResponse<{ success: boolean; message: string }>(response);
  return { message: payload.message || 'Deleted successfully' };
}

export async function activateSubject(basePath: string, id: number, schoolId: number): Promise<Subject> {
  const url = `${basePath}${API_ENDPOINT}/${id}/activate?schoolId=${schoolId}`;
  console.log('Activating subject at:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: createHeaders(),
  });
  
  const payload = await handleResponse<SingleSubjectResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to activate subject');
  }
  
  return {
    id: payload.data.out_id,
    subjectCode: payload.data.out_subject_code,
    subjectName: payload.data.out_subject_name,
    subjectShortName: payload.data.out_subject_short_name,
    subjectType: payload.data.out_subject_type,
    subjectCategory: payload.data.out_subject_category,
    status: payload.data.out_status_name,
    classMappings: payload.data.out_class_mappings || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function deactivateSubject(basePath: string, id: number, schoolId: number): Promise<Subject> {
  const url = `${basePath}${API_ENDPOINT}/${id}/deactivate?schoolId=${schoolId}`;
  console.log('Deactivating subject at:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: createHeaders(),
  });
  
  const payload = await handleResponse<SingleSubjectResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to deactivate subject');
  }
  
  return {
    id: payload.data.out_id,
    subjectCode: payload.data.out_subject_code,
    subjectName: payload.data.out_subject_name,
    subjectShortName: payload.data.out_subject_short_name,
    subjectType: payload.data.out_subject_type,
    subjectCategory: payload.data.out_subject_category,
    status: payload.data.out_status_name,
    classMappings: payload.data.out_class_mappings || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function getSubjectControls(basePath: string, schoolId: number): Promise<string[]> {
  const url = `${basePath}${API_ENDPOINT}/controls?schoolId=${schoolId}`;
  console.log('Fetching subject controls from:', url);
  
  const response = await fetch(url, {
    credentials: 'include',
    headers: createHeaders(),
  });
  
  const payload = await handleResponse<{ success: boolean; controls: string[] }>(response);
  return payload.controls || [];
}

// =====================================================
// Status Options API Functions
// =====================================================

// export async function getStatusOptions(
//   basePath: string,
//   formId: number = 8
// ): Promise<StatusOption[]> {
//   const url = `${basePath}${API_ENDPOINT}/status-options?formId=${formId}`;
//   console.log('Fetching status options from:', url);
//   console.log('Using auth token:', !!getAuthToken());
  
//   const response = await fetch(url, {
//     method: 'GET',
//     credentials: 'include',
//     headers: createHeaders(),
//   });
  
//   console.log('Response status:', response.status);
  
//   const payload = await handleResponse<StatusOptionsResponse>(response);
  
//   if (!payload.success) {
//     throw new Error(payload.message || 'Failed to fetch status options');
//   }
  
//   return payload.data;
// }

// export async function getStatusById(
//   basePath: string,
//   statusId: number
// ): Promise<StatusOption | null> {
//   const url = `${basePath}${API_ENDPOINT}/status-options/${statusId}`;
//   console.log('Fetching status by id from:', url);
  
//   const response = await fetch(url, {
//     method: 'GET',
//     credentials: 'include',
//     headers: createHeaders(),
//   });
  
//   const payload = await handleResponse<{ success: boolean; data: StatusOption | null }>(response);
  
//   if (!payload.success) {
//     return null;
//   }
  
//   return payload.data;
// }

// Replace the entire status options section in subjects.api.ts

// =====================================================
// Status Options API Functions - Simplified with Fallback
// =====================================================

export async function getStatusOptions(
  basePath: string,
  formId: number = 8
): Promise<StatusOption[]> {
  // Fallback data - same as in your database
  const fallbackData: StatusOption[] = [
    { id: 1, status_id: 1, status_name: 'DRAFT', status_desc: 'Subject in draft mode - not yet ready for use' },
    { id: 2, status_id: 2, status_name: 'ACTIVE', status_desc: 'Subject is active and available for use' },
    { id: 3, status_id: 3, status_name: 'INACTIVE', status_desc: 'Subject is inactive/archived' },
  ];
  
  // Try multiple possible endpoints
  const possiblePaths = [
    `${basePath}/system_setup/academic_setup/subjects/status-options`,
    `${basePath}/system_setup/academic_setup/subjects/status-options`,
    `${basePath}/system_setup/academic_setup/subjects/status-options`,
  ];
  
  for (const path of possiblePaths) {
    try {
      const url = new URL(path);
      url.searchParams.append('formId', formId.toString());
      
      console.log(`Trying endpoint: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {}),
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Success from ${path}:`, result);
        
        // Handle different response structures
        if (result.data && Array.isArray(result.data)) {
          return result.data;
        }
        if (result.success && result.data && Array.isArray(result.data)) {
          return result.data;
        }
        if (Array.isArray(result)) {
          return result;
        }
      } else {
        console.warn(`Endpoint ${path} returned ${response.status}`);
      }
    } catch (err) {
      console.warn(`Error calling ${path}:`, err);
    }
  }
  
  // If all endpoints fail, return fallback data
  console.log('All endpoints failed, using fallback status options');
  return fallbackData;
}

export async function getStatusById(
  basePath: string,
  statusId: number
): Promise<StatusOption | null> {
  // First try to get from fallback if needed
  const allStatuses = await getStatusOptions(basePath);
  return allStatuses.find(s => s.status_id === statusId) || null;
}