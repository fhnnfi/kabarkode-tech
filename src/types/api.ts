/**
 * Tipe frontend — dicocokkan 1:1 dengan respons nyata kabarkode-backend
 * (diverifikasi dari src/repositories/article.repository.ts + OpenAPI live
 * di https://kabarkodeapi.fhanalabs.site/api/docs.json, 4 Sep 2026).
 *
 * envelope backend: { success: true, data, meta? }
 * meta: { page, limit, total, totalPages }
 */

export type ArticleStatus = 'draft' | 'published' | 'archived';
export type ArticleType = 'news' | 'analysis' | 'tutorial' | 'security' | 'release';

export interface ArticleRef {
  id: string;
  name: string;
  slug: string;
}

/** ArticleDetail backend: baris artikel + relasi ter-inline. */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  /** HTML bersih hasil sanitasi server (keluaran Tiptap). */
  content: string;
  status: ArticleStatus;
  article_type: ArticleType;
  author_id: string | null;
  category_id: string | null;
  /** ID media cover; URL publik TIDAK disertakan backend (butuh auth) — lihat utils/media.ts. */
  cover_media_id: string | null;
  source_name: string | null;
  source_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: { id: string; name: string; slug: string } | null;
  category: ArticleRef | null;
  tags: ArticleRef[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

/** Metadata media (GET /media/:id — publik). */
export interface Media {
  id: string;
  file_name: string;
  object_key: string;
  mime_type: string;
  size: number;
  bucket: string;
  public_url: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

/** Query GET /articles (listArticlesQuerySchema backend). */
export interface ArticleListParams {
  page?: number;
  limit?: number; // 1..100, default 20
  category?: string; // slug kategori
  tag?: string; // slug tag
  author?: string; // slug author
  article_type?: ArticleType;
  search?: string; // min 2 karakter
  date_from?: string;
  date_to?: string;
}
