"use client";

// academic-year.hooks.ts

import { useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { usePage } from '@core/contexts/PageContext';
import { useAuthStore } from '@store/auth.store';
import {
  getAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  activateAcademicYear,
  completeAcademicYear,
  cancelAcademicYear,
} from './academic-year.api';
import { CreateAcademicYearPayload, UpdateAcademicYearPayload, ListAcademicYearParams } from './academic-year.types';

// Query keys for caching
export const academicYearKeys = {
  all: ['academic-years'] as const,
  lists: () => [...academicYearKeys.all, 'list'] as const,
  list: (params: ListAcademicYearParams) => [...academicYearKeys.lists(), params] as const,
  details: () => [...academicYearKeys.all, 'detail'] as const,
  detail: (id: number) => [...academicYearKeys.details(), id] as const,
};

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

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unknown error');
}

type TokenPayload = {
  user_id: number;
  school_id: number;
  school_group_id: number;
  role_id: number;
};

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

function useAsyncMutation<TData, TVariables>(
  mutationFn: (basePath: string, variables: TVariables) => Promise<TData>,
  getBasePath: () => string | null,
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

/**
 * Hook to fetch paginated list of academic years.
 */
export function useAcademicYears(params: ListAcademicYearParams): QueryState<{ items: import('./academic-year.types').AcademicYear[]; total: number }> {
  const { apiBasePath } = usePage();
  const schoolId = useSchoolId();
  
  // Memoize params to prevent unnecessary re-renders
  const stableParams = useMemo(() => ({
    ...params,
    schoolId: params.schoolId ?? schoolId,
  }), [params.schoolId, schoolId, params.limit, params.offset]);
  
  const [data, setData] = useState<{ items: import('./academic-year.types').AcademicYear[]; total: number }>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!apiBasePath) {
      setError(new Error('API base path not available'));
      setIsLoading(false);
      return;
    }

    if (!stableParams.schoolId) {
      // Don't set error, just return empty data
      setData({ items: [], total: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching academic years with params:', stableParams);
      const result = await getAcademicYears(apiBasePath, stableParams);
      console.log('Fetched result:', result);
      setData(result);
    } catch (queryError: unknown) {
      console.error('Error fetching academic years:', queryError);
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

/**
 * Hook to fetch a single academic year by ID.
 */
export function useAcademicYear(id: number | undefined): QueryState<import('./academic-year.types').AcademicYear> {
  const { apiBasePath } = usePage();
  const [data, setData] = useState<import('./academic-year.types').AcademicYear>();
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
      const result = await getAcademicYearById(apiBasePath, id);
      console.log('Fetched single academic year:', result);
      setData(result);
    } catch (queryError: unknown) {
      console.error('Error fetching academic year:', queryError);
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

/**
 * Hook to create a new academic year.
 */
export function useCreateAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, data: CreateAcademicYearPayload) => createAcademicYear(basePath, data),
    getBasePath
  );
}

/**
 * Hook to update an academic year.
 */
export function useUpdateAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, data: UpdateAcademicYearPayload) => updateAcademicYear(basePath, data),
    getBasePath
  );
}

/**
 * Hook to delete an academic year.
 */
export function useDeleteAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      deleteAcademicYear(basePath, id, schoolId),
    getBasePath
  );
}

/**
 * Hook to activate an academic year (DRAFT -> ACTIVE)
 */
export function useActivateAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      activateAcademicYear(basePath, id, schoolId),
    getBasePath
  );
}

/**
 * Hook to complete an academic year (ACTIVE -> COMPLETED)
 */
export function useCompleteAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      completeAcademicYear(basePath, id, schoolId),
    getBasePath
  );
}

/**
 * Hook to cancel an academic year (DRAFT or ACTIVE -> CANCELLED)
 */
export function useCancelAcademicYear() {
  const { apiBasePath } = usePage();
  
  const getBasePath = useCallback(() => apiBasePath, [apiBasePath]);
  
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      cancelAcademicYear(basePath, id, schoolId),
    getBasePath
  );
}