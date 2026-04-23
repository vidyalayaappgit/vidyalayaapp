"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@store/auth.store';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  activateSubject,
  deactivateSubject,
  getSubjectControls,
  getStatusOptions,
} from './subjects.api';
import {
  CreateSubjectPayload,
  UpdateSubjectPayload,
  ListSubjectParams,
  Subject,
  StatusOption,
} from './subjects.types';

type TokenPayload = {
  user_id: number;
  school_id: number;
  school_group_id: number;
  role_id: number;
};

function getApiBasePath(): string {
  if (typeof window !== 'undefined') {
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

export function useSubjects(params: ListSubjectParams): QueryState<{ items: Subject[]; total: number }> {
  const apiBasePath = getApiBasePath();
  const schoolId = useSchoolId();
  
  const stableParams = useMemo(() => ({
    ...params,
    schoolId: params.schoolId ?? schoolId,
  }), [params.schoolId, schoolId, params.status, params.subjectType, params.subjectCategoryId, params.classId, params.limit, params.offset]);
  
  const [data, setData] = useState<{ items: Subject[]; total: number }>();
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
      console.log('Fetching subjects from basePath:', apiBasePath);
      const result = await getSubjects(apiBasePath, stableParams);
      setData(result);
    } catch (queryError: unknown) {
      console.error('Error fetching subjects:', queryError);
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

export function useSubject(id: number | undefined): QueryState<Subject> {
  const apiBasePath = getApiBasePath();
  const [data, setData] = useState<Subject>();
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
      const result = await getSubjectById(apiBasePath, id);
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

export function useCreateSubject() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, data: CreateSubjectPayload) => createSubject(basePath, data),
    getBasePath
  );
}

export function useUpdateSubject() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, data: UpdateSubjectPayload) => updateSubject(basePath, data),
    getBasePath
  );
}

export function useDeleteSubject() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      deleteSubject(basePath, id, schoolId),
    getBasePath
  );
}

export function useActivateSubject() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      activateSubject(basePath, id, schoolId),
    getBasePath
  );
}

export function useDeactivateSubject() {
  const getBasePath = getApiBasePath;
  return useAsyncMutation(
    (basePath, { id, schoolId }: { id: number; schoolId: number }) =>
      deactivateSubject(basePath, id, schoolId),
    getBasePath
  );
}

export function useSubjectControls() {
  const [controls, setControls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const apiBasePath = getApiBasePath();
  const schoolId = useSchoolId();

  const fetchControls = useCallback(async () => {
    if (!schoolId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getSubjectControls(apiBasePath, schoolId);
      setControls(result);
    } catch (err) {
      setError(toError(err));
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, schoolId]);

  useEffect(() => {
    fetchControls();
  }, [fetchControls]);

  return { controls, isLoading, error, refetch: fetchControls };
}

// Updated useStatusOptions hook with immediate fallback
export function useStatusOptions(formId: number = 8) {
  // Initialize with fallback data immediately
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([
    { id: 1, status_id: 1, status_name: 'DRAFT', status_desc: 'Subject in draft mode - not yet ready for use' },
    { id: 2, status_id: 2, status_name: 'ACTIVE', status_desc: 'Subject is active and available for use' },
    { id: 3, status_id: 3, status_name: 'INACTIVE', status_desc: 'Subject is inactive/archived' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiBasePath = getApiBasePath();

  const fetchStatusOptions = useCallback(async () => {
    if (!apiBasePath) {
      console.warn('API base path not available, using fallback status options');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching status options from:', apiBasePath);
      const options = await getStatusOptions(apiBasePath, formId);
      console.log('Successfully fetched status options:', options);
      if (options && options.length > 0) {
        setStatusOptions(options);
      }
    } catch (err) {
      console.error('Error fetching status options, keeping fallback:', err);
      setError(toError(err));
      // Keep using the fallback data already set in state
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, formId]);

  useEffect(() => {
    fetchStatusOptions();
  }, [fetchStatusOptions]);

  return { statusOptions, isLoading, error, refetch: fetchStatusOptions };
}