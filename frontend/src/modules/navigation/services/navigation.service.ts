import { apiFetch } from '@/core/api/api';
import type { Module } from '@modules/navigation/types/navigation.types';

export async function getNavigation(): Promise<Module[]> {
  return apiFetch<Module[]>('/navigation');
}