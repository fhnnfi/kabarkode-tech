/**
 * Service kategori & tag — endpoint publik nyata:
 *   GET /categories  (list, tanpa meta pagination)
 *   GET /tags        (list, dengan meta pagination)
 */
import { apiClient } from './client';
import type { Category, Tag } from '@/types/api';

export async function listCategories(): Promise<Category[]> {
  const env = await apiClient.get<Category[]>('/categories');
  return env.data;
}

export async function listTags(limit = 50): Promise<Tag[]> {
  const env = await apiClient.get<Tag[]>('/tags', { page: 1, limit });
  return env.data;
}
