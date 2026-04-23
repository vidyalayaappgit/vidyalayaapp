// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\classes.api.ts
// import {
//   CreateClassPayload,
//   UpdateClassPayload,
//   ListClassParams,
//   Class,
//   ClassDB,
//   ListClassResponse,
//   SingleClassResponse,
// } from './classes.types';

// async function handleResponse<T>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: response.statusText }));
//     throw new Error(error.message || 'API request failed');
//   }
//   return response.json();
// }

// export async function getClasses(
//   basePath: string,
//   params: ListClassParams = {}
// ): Promise<{ items: Class[]; total: number }> {
//   const searchParams = new URLSearchParams();
  
//   if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
//   if (params.status !== undefined) searchParams.append('status', params.status.toString());
//   if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
//   if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

//   const url = `${basePath}?${searchParams.toString()}`;
//   const response = await fetch(url, { 
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' }
//   });
  
//   const payload = await handleResponse<ListClassResponse>(response);
  
//   const mappedItems = (payload.items ?? []).map((item: ClassDB) => ({
//     id: item.out_id,
//     classCode: item.out_class_code,
//     className: item.out_class_name,
//     classNumber: item.out_class_number,
//     academicLevel: item.out_academic_level,
//     status: item.out_status_name,
//     sections: item.out_sections || [],
//     createdDt: item.out_created_dt,
//     updatedDt: item.out_updated_dt,
//   }));

//   return {
//     items: mappedItems,
//     total: payload.total ?? mappedItems.length,
//   };
// }

// export async function getClassById(basePath: string, id: number): Promise<Class> {
//   const response = await fetch(`${basePath}/${id}`, { 
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' }
//   });
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Class not found');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }

// export async function createClass(basePath: string, data: CreateClassPayload): Promise<Class> {
//   const body = {
//     schoolId: data.schoolId,
//     classCode: data.classCode,
//     className: data.className,
//     classNumber: data.classNumber,
//     academicLevelId: data.academicLevelId,
//     classRomanNumeral: data.classRomanNumeral,
//     displayOrder: data.displayOrder,
//     minAgeRequired: data.minAgeRequired,
//     maxAgeRequired: data.maxAgeRequired,
//     description: data.description,
//     sections: data.sections?.map(s => ({
//       sectionCode: s.section_code,
//       sectionName: s.section_name,
//       roomId: s.room_id,
//       capacity: s.capacity,
//       startTime: s.start_time,
//       endTime: s.end_time,
//       displayOrder: s.display_order,
//       description: s.description,
//     })),
//   };

//   const response = await fetch(basePath, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(body),
//   });
  
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Failed to create class');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }

// export async function updateClass(basePath: string, data: UpdateClassPayload): Promise<Class> {
//   const body: any = {
//     schoolId: data.schoolId,
//   };
  
//   if (data.className !== undefined) body.className = data.className;
//   if (data.classRomanNumeral !== undefined) body.classRomanNumeral = data.classRomanNumeral;
//   if (data.displayOrder !== undefined) body.displayOrder = data.displayOrder;
//   if (data.minAgeRequired !== undefined) body.minAgeRequired = data.minAgeRequired;
//   if (data.maxAgeRequired !== undefined) body.maxAgeRequired = data.maxAgeRequired;
//   if (data.description !== undefined) body.description = data.description;
//   if (data.sections !== undefined) {
//     body.sections = data.sections.map(s => ({
//       id: s.id,
//       sectionCode: s.section_code,
//       sectionName: s.section_name,
//       roomId: s.room_id,
//       capacity: s.capacity,
//       startTime: s.start_time,
//       endTime: s.end_time,
//       displayOrder: s.display_order,
//       description: s.description,
//     }));
//   }
//   if (data.sectionsToDelete !== undefined) body.sectionsToDelete = data.sectionsToDelete;

//   const response = await fetch(`${basePath}/${data.id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(body),
//   });
  
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Failed to update class');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }

// export async function deleteClass(basePath: string, id: number, schoolId: number): Promise<{ message: string }> {
//   const response = await fetch(`${basePath}/${id}?schoolId=${schoolId}`, {
//     method: 'DELETE',
//     credentials: 'include',
//   });
  
//   const payload = await handleResponse<{ success: boolean; message: string }>(response);
//   return { message: payload.message || 'Deleted successfully' };
// }

// export async function activateClass(basePath: string, id: number, schoolId: number): Promise<Class> {
//   const response = await fetch(`${basePath}/${id}/activate?schoolId=${schoolId}`, {
//     method: 'POST',
//     credentials: 'include',
//   });
  
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Failed to activate class');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }

// export async function deactivateClass(basePath: string, id: number, schoolId: number): Promise<Class> {
//   const response = await fetch(`${basePath}/${id}/deactivate?schoolId=${schoolId}`, {
//     method: 'POST',
//     credentials: 'include',
//   });
  
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Failed to deactivate class');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }

// export async function authorizeClass(basePath: string, id: number, schoolId: number): Promise<Class> {
//   const response = await fetch(`${basePath}/${id}/authorize?schoolId=${schoolId}`, {
//     method: 'POST',
//     credentials: 'include',
//   });
  
//   const payload = await handleResponse<SingleClassResponse>(response);
//   if (!payload.data) {
//     throw new Error(payload.message || 'Failed to authorize class');
//   }
  
//   return {
//     id: payload.data.out_id,
//     classCode: payload.data.out_class_code,
//     className: payload.data.out_class_name,
//     classNumber: payload.data.out_class_number,
//     academicLevel: payload.data.out_academic_level,
//     status: payload.data.out_status_name,
//     sections: payload.data.out_sections || [],
//     createdDt: payload.data.out_created_dt,
//     updatedDt: payload.data.out_updated_dt,
//   };
// }


// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\classes.api.ts

import {
  CreateClassPayload,
  UpdateClassPayload,
  ListClassParams,
  Class,
  ClassDB,
  ListClassResponse,
  SingleClassResponse,
} from './classes.types';

// Define the API endpoint
const API_ENDPOINT = '/system_setup/academic_setup/classes';
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export async function getClasses(
  basePath: string,
  params: ListClassParams = {}
): Promise<{ items: Class[]; total: number }> {
  const searchParams = new URLSearchParams();
  
  if (params.schoolId !== undefined) searchParams.append('schoolId', params.schoolId.toString());
  if (params.status !== undefined) searchParams.append('status', params.status.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

  // Fix: Append the endpoint to basePath
  const url = `${basePath}${API_ENDPOINT}?${searchParams.toString()}`;
  console.log('Fetching classes from:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const payload = await handleResponse<ListClassResponse>(response);
  console.log('Response payload:', payload);
  
  const mappedItems = (payload.items ?? []).map((item: ClassDB) => ({
    id: item.out_id,
    classCode: item.out_class_code,
    className: item.out_class_name,
    classNumber: item.out_class_number,
    academicLevel: item.out_academic_level,
    status: item.out_status_name,
    sections: item.out_sections || [],
    createdDt: item.out_created_dt,
    updatedDt: item.out_updated_dt,
  }));

  return {
    items: mappedItems,
    total: payload.total ?? mappedItems.length,
  };
}

export async function getClassById(basePath: string, id: number): Promise<Class> {
  const url = `${basePath}${API_ENDPOINT}/${id}`;
  console.log('Fetching class by id from:', url);
  
  const response = await fetch(url, { 
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Class not found');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function createClass(basePath: string, data: CreateClassPayload): Promise<Class> {
  const body = {
    schoolId: data.schoolId,
    classCode: data.classCode,
    className: data.className,
    classNumber: data.classNumber,
    academicLevelId: data.academicLevelId,
    classRomanNumeral: data.classRomanNumeral,
    displayOrder: data.displayOrder,
    minAgeRequired: data.minAgeRequired,
    maxAgeRequired: data.maxAgeRequired,
    description: data.description,
    sections: data.sections?.map(s => ({
      sectionCode: s.section_code,
      sectionName: s.section_name,
      roomId: s.room_id,
      capacity: s.capacity,
      startTime: s.start_time,
      endTime: s.end_time,
      displayOrder: s.display_order,
      description: s.description,
    })),
  };

  const url = `${basePath}${API_ENDPOINT}`;
  console.log('Creating class at:', url);
  console.log('Request body:', body);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to create class');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function updateClass(basePath: string, data: UpdateClassPayload): Promise<Class> {
  const body: any = {
    schoolId: data.schoolId,
  };
  
  if (data.className !== undefined) body.className = data.className;
  if (data.classRomanNumeral !== undefined) body.classRomanNumeral = data.classRomanNumeral;
  if (data.displayOrder !== undefined) body.displayOrder = data.displayOrder;
  if (data.minAgeRequired !== undefined) body.minAgeRequired = data.minAgeRequired;
  if (data.maxAgeRequired !== undefined) body.maxAgeRequired = data.maxAgeRequired;
  if (data.description !== undefined) body.description = data.description;
  if (data.sections !== undefined) {
    body.sections = data.sections.map(s => ({
      id: s.id,
      sectionCode: s.section_code,
      sectionName: s.section_name,
      roomId: s.room_id,
      capacity: s.capacity,
      startTime: s.start_time,
      endTime: s.end_time,
      displayOrder: s.display_order,
      description: s.description,
    }));
  }
  if (data.sectionsToDelete !== undefined) body.sectionsToDelete = data.sectionsToDelete;

  const url = `${basePath}${API_ENDPOINT}/${data.id}`;
  console.log('Updating class at:', url);
  console.log('Request body:', body);

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to update class');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function deleteClass(basePath: string, id: number, schoolId: number): Promise<{ message: string }> {
  const url = `${basePath}${API_ENDPOINT}/${id}?schoolId=${schoolId}`;
  console.log('Deleting class at:', url);
  
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  const payload = await handleResponse<{ success: boolean; message: string }>(response);
  return { message: payload.message || 'Deleted successfully' };
}

export async function activateClass(basePath: string, id: number, schoolId: number): Promise<Class> {
  const url = `${basePath}${API_ENDPOINT}/${id}/activate?schoolId=${schoolId}`;
  console.log('Activating class at:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to activate class');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function deactivateClass(basePath: string, id: number, schoolId: number): Promise<Class> {
  const url = `${basePath}${API_ENDPOINT}/${id}/deactivate?schoolId=${schoolId}`;
  console.log('Deactivating class at:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to deactivate class');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}

export async function authorizeClass(basePath: string, id: number, schoolId: number): Promise<Class> {
  const url = `${basePath}${API_ENDPOINT}/${id}/authorize?schoolId=${schoolId}`;
  console.log('Authorizing class at:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  
  const payload = await handleResponse<SingleClassResponse>(response);
  if (!payload.data) {
    throw new Error(payload.message || 'Failed to authorize class');
  }
  
  return {
    id: payload.data.out_id,
    classCode: payload.data.out_class_code,
    className: payload.data.out_class_name,
    classNumber: payload.data.out_class_number,
    academicLevel: payload.data.out_academic_level,
    status: payload.data.out_status_name,
    sections: payload.data.out_sections || [],
    createdDt: payload.data.out_created_dt,
    updatedDt: payload.data.out_updated_dt,
  };
}