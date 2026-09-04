/**
 * Service media — GET /media/:id kini publik di backend (hanya metadata),
 * dipakai untuk resolve cover artikel & avatar author tanpa auth.
 */
import { apiClient } from './client';
import type { Media } from '@/types/api';

export async function getMedia(id: string): Promise<Media> {
  const env = await apiClient.get<Media>(`/media/${encodeURIComponent(id)}`);
  return env.data;
}
