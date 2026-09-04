/**
 * Klien API terpusat (§49). Semua panggilan HTTP publik lewat sini —
 * tidak ada fetch() liar di komponen.
 */
import { API_URL } from '@/constants/config';
import type { ApiEnvelope } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Pesan user-friendly — error mentah API tidak pernah diteruskan ke UI (§44). */
export function friendlyErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 404) return 'Tidak ditemukan.';
    if (err.status === 429) return 'Terlalu banyak permintaan. Coba lagi sebentar.';
    if (err.status >= 500) return 'Server sedang mengalami masalah.';
  }
  if (err instanceof TypeError) return 'Tidak dapat terhubung ke server.';
  return 'Terjadi kesalahan.';
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiEnvelope<T>> {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new ApiError(0, 'network_error');
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* bukan JSON */
  }

  if (!res.ok) {
    const env = body as { error?: { message?: string } } | null;
    throw new ApiError(res.status, env?.error?.message ?? `http_${res.status}`);
  }
  return body as ApiEnvelope<T>;
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>(path, params),
};
