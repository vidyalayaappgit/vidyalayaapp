// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\classes.hooks.ts

// "use client";

// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { usePage } from '@core/contexts/PageContext';
// import { useAuthStore } from '@store/auth.store';
// import {
//   getClasses,
//   getClassById,
//   createClass,
//   updateClass,
//   deleteClass,
//   activateClass,
//   deactivateClass,
//   authorizeClass,
// } from './classes.api';
// import {
//   CreateClassPayload,
//   UpdateClassPayload,
//   ListClassParams,
//   Class,
// } from './classes.types';

// type TokenPayload = {
//   user_id: number;
//   school_id: number;
//   school_group_id: number;
//   role_id: number;
// };

// export function useSchoolId(): number | undefined {
//   const token = useAuthStore((s) => s.auth.token);

//   return useMemo(() => {
//     if (!token) return undefined;
//     try {
//       const payload = jwtDecode<TokenPayload>(token);
//       return payload.school_id;
//     } catch {
//       return undefined;
//     }
//   }, [token]);
// }

// function toError(error: unknown): Error {
//   return error instanceof Error ? error : new Error('Unknown error');
// }

// type QueryState<T> = {
//   data: T | undefined;
//   error: Error | null;
//   isLoading: boolean;
//   refetch: () => Promise<void>;
// };

// type MutationState<TData, TVariables> = {
//   data: TData | undefined;
//   error: Error | null;
//   isPending: boolean;
//   mutate: (variables: TVariables) => void;
//   mutateAsync: (variables: TVariables) => Promise<TData>;
// };

// function useAsyncMutation<TData, TVariables>(
//   mutationFn: (basePath: string, variables: TVariables) => Promise<TData>,
//   getBasePath: () => string | null,
//   onSuccess?: (data: TData, variables: TVariables) => void
// ): MutationState<TData, TVariables> {
//   const [data, setData] = useState<TData>();
//   const [error, setError] = useState<Error | null>(null);
//   const [isPending, setIsPending] = useState(false);

//   const mutateAsync = useCallback(
//     async (variables: TVariables): Promise<TData> => {
//       const basePath = getBasePath();
//       if (!basePath) {
//         throw new Error('API base path not available');
//       }

//       setIsPending(true);
//       setError(null);

//       try {
//         const result = await mutationFn(basePath, variables);
//         setData(result);
//         onSuccess?.(result, variables);
//         return result;
//       } catch (mutationError: unknown) {
//         const normalizedError = toError(mutationError);
//         setError(normalizedError);
//         throw normalizedError;
//       } finally {
//         setIsPending(false);
//       }
//     },
//     [mutationFn, getBasePath, onSuccess]
//   );

//   const mutate = useCallback(
//     (variables: TVariables) => {
//       void mutateAsync(variables);
//     },
//     [mutateAsync]
//   );

//   return { data, error, isPending, mutate, mutateAsync };
// }

// export function useClasses(params: ListClassParams): QueryState<{ items: Class[]; total: number }> {
//   const { apiBasePath } = usePage();
//   const schoolId = useSchoolId();
  
//   const stableParams = useMemo(() => ({
//     ...params,
//     schoolId: params.schoolId ?? schoolId,
//   }), [params.schoolId, schoolId, params.status, params.limit, params.offset]);
  
//   const [data, setData] = useState<{ items: Class[]; total: number }>();
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const refetch = useCallback(async () => {
//     if (!apiBasePath) {
//       setError(new Error('API base path not available'));
//       setIsLoading(false);
//       return;
//     }

//     if (!stableParams.schoolId) {
//       setData({ items: [], total: 0 });
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await getClasses(apiBasePath, stableParams);
//       setData(result);
//     } catch (queryError: unknown) {
//       setError(toError(queryError));
//       setData({ items: [], total: 0 });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [apiBasePath, stableParams]);

//   useEffect(() => {
//     if (stableParams.schoolId) {
//       refetch();
//     } else {
//       setIsLoading(false);
//       setData({ items: [], total: 0 });
//     }
//   }, [refetch, stableParams.schoolId]);

//   return { data, error, isLoading, refetch };
// }

// export function useClass(id: number | undefined): QueryState<Class> {
//   const { apiBasePath } = usePage();
//   const [data, setData] = useState<Class>();
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(id !== undefined);

//   const refetch = useCallback(async () => {
//     if (id === undefined) {
//       setIsLoading(false);
//       return;
//     }

//     if (!apiBasePath) {
//       setError(new Error('API base path not available'));
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await getClassById(apiBasePath, id);
//       setData(result);
//     } catch (queryError: unknown) {
//       setError(toError(queryError));
//     } finally {
//       setIsLoading(false);
//     }
//   }, [apiBasePath, id]);

//   useEffect(() => {
//     void refetch();
//   }, [refetch]);

//   return { data, error, isLoading, refetch };
// }

// export function useCreateClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, data: CreateClassPayload) => createClass(basePath, data),
//     getBasePath
//   );
// }

// export function useUpdateClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, data: UpdateClassPayload) => updateClass(basePath, data),
//     getBasePath
//   );
// }

// export function useDeleteClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
//       deleteClass(basePath, id, schoolId),
//     getBasePath
//   );
// }

// export function useActivateClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
//       activateClass(basePath, id, schoolId),
//     getBasePath
//   );
// }

// export function useDeactivateClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
//       deactivateClass(basePath, id, schoolId),
//     getBasePath
//   );
// }

// export function useAuthorizeClass() {
//   const { apiBasePath } = usePage();
//   const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
//   return useAsyncMutation(
//     (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
//       authorizeClass(basePath, id, schoolId),
//     getBasePath
//   );
// }


// D:\schoolapp\frontend\src\modules\system_setup\academic_setup\classes\classes.hooks.ts

"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@store/auth.store';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  activateClass,
  deactivateClass,
  authorizeClass,
} from './classes.api';
import {
  CreateClassPayload,
  UpdateClassPayload,
  ListClassParams,
  Class,
} from './classes.types';

type TokenPayload = {
  user_id: number;
  school_id: number;
  school_group_id: number;
  role_id: number;
};

// Get API base URL - this should be just the base URL without /api
function getApiBasePath(): string {
  if (typeof window !== 'undefined') {
    // Use environment variable or default to localhost:3001
    // Do NOT add /api here - it will be added in the API_ENDPOINT
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  return 'http://localhost:3001';
}

export function useSchoolId(): number | undefined {
  const token = useAuthStore((s) => s.auth.token);

  return useMemo(() => {
    if (!token) return undefined;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      return payload.school_id;
    } catch {
      return undefined;
    }
  }, [token]);
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown error');
}

type QueryState<T> = {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

type MutationState<TData, TVariables> = {
  data: TData | undefined;
  error: Error | null;
  isPending: boolean;
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
};

function useAsyncMutation<TData, TVariables>(
  mutationFn: (basePath: string, variables: TVariables) => Promise<TData>,
  getBasePath: () => string,
  onSuccess?: (data: TData, variables: TVariables) => void
): MutationState<TData, TVariables> {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      const basePath = getBasePath();
      if (!basePath) {
        throw new Error('API base path not available');
      }

      setIsPending(true);
      setError(null);

      try {
        const result = await mutationFn(basePath, variables);
        setData(result);
        onSuccess?.(result, variables);
        return result;
      } catch (mutationError: unknown) {
        const normalizedError = toError(mutationError);
        setError(normalizedError);
        throw normalizedError;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, getBasePath, onSuccess]
  );

  const mutate = useCallback(
    (variables: TVariables) => {
      void mutateAsync(variables);
    },
    [mutateAsync]
  );

  return { data, error, isPending, mutate, mutateAsync };
}

export function useClasses(params: ListClassParams): QueryState<{ items: Class[]; total: number }> {
  const apiBasePath = getApiBasePath();
  const schoolId = useSchoolId();
  
  const stableParams = useMemo(() => ({
    ...params,
    schoolId: params.schoolId ?? schoolId,
  }), [params.schoolId, schoolId, params.status, params.limit, params.offset]);
  
  const [data, setData] = useState<{ items: Class[]; total: number }>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!apiBasePath) {
      setError(new Error('API base path not available'));
      setIsLoading(false);
      return;
    }

    if (!stableParams.schoolId) {
      setData({ items: [], total: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching classes from basePath:', apiBasePath);
      const result = await getClasses(apiBasePath, stableParams);
      setData(result);
    } catch (queryError: unknown) {
      console.error('Error fetching classes:', queryError);
      setError(toError(queryError));
      setData({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, stableParams]);

  useEffect(() => {
    if (stableParams.schoolId) {
      refetch();
    } else {
      setIsLoading(false);
      setData({ items: [], total: 0 });
    }
  }, [refetch, stableParams.schoolId]);

  return { data, error, isLoading, refetch };
}

export function useClass(id: number | undefined): QueryState<Class> {
  const apiBasePath = getApiBasePath();
  const [data, setData] = useState<Class>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(id !== undefined);

  const refetch = useCallback(async () => {
    if (id === undefined) {
      setIsLoading(false);
      return;
    }

    if (!apiBasePath) {
      setError(new Error('API base path not available'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getClassById(apiBasePath, id);
      setData(result);
    } catch (queryError: unknown) {
      setError(toError(queryError));
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, id]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, error, isLoading, refetch };
}

export function useCreateClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, data: CreateClassPayload) => createClass(basePath, data),
    getBasePath
  );
}

export function useUpdateClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, data: UpdateClassPayload) => updateClass(basePath, data),
    getBasePath
  );
}

export function useDeleteClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      deleteClass(basePath, id, schoolId),
    getBasePath
  );
}

export function useActivateClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      activateClass(basePath, id, schoolId),
    getBasePath
  );
}

export function useDeactivateClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      deactivateClass(basePath, id, schoolId),
    getBasePath
  );
}

export function useAuthorizeClass() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      authorizeClass(basePath, id, schoolId),
    getBasePath
  );
}