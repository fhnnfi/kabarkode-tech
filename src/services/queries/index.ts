/**
 * Hook TanStack Query (§50). Nama disesuaikan kapabilitas backend nyata.
 * Cache: homepage/kategori stale 60s, detail artikel 5 menit (§52).
 */
import { useQuery, useQueries, keepPreviousData } from '@tanstack/react-query';
import {
  getArticleBySlug,
  getRelatedArticles,
  listArticles,
  type ArticlePage,
} from '@/services/api/articles';
import { listCategories, listTags } from '@/services/api/categories';
import type { ArticleListParams } from '@/types/api';

export const queryKeys = {
  articles: (p: ArticleListParams) => ['articles', p] as const,
  article: (slug: string) => ['articles', 'detail', slug] as const,
  related: (slug: string) => ['articles', 'related', slug] as const,
  categories: () => ['categories'] as const,
  tags: () => ['tags'] as const,
};

const STALE_LIST = 60_000;
const STALE_DETAIL = 300_000;

export function useArticles(params: ArticleListParams) {
  return useQuery({
    queryKey: queryKeys.articles(params),
    queryFn: () => listArticles(params),
    staleTime: STALE_LIST,
    // Load-more: data halaman sebelumnya tetap tampil selagi halaman baru dimuat.
    placeholderData: keepPreviousData,
  });
}

/** Satu halaman artikel (helper untuk section homepage). */
export function useArticlePage(params: ArticleListParams) {
  return useArticles(params);
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.article(slug),
    queryFn: () => getArticleBySlug(slug),
    staleTime: STALE_DETAIL,
  });
}

/** Related articles — fallback berbasis kategori (backend tidak punya endpoint related). */
export function useRelatedArticles(article: ArticlePage['articles'][number] | undefined) {
  return useQuery({
    queryKey: queryKeys.related(article?.slug ?? '-'),
    queryFn: () => getRelatedArticles(article!),
    enabled: !!article,
    staleTime: STALE_DETAIL,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: listCategories,
    staleTime: STALE_LIST,
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags(),
    queryFn: () => listTags(100),
    staleTime: STALE_LIST,
  });
}

/**
 * Data homepage: beberapa section difetch paralel tapi terisolasi —
 * satu section gagal tidak merobohkan seluruh halaman (§77).
 */
export function useHomeFeed() {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.articles({ page: 1, limit: 12 }),
        queryFn: () => listArticles({ page: 1, limit: 12 }),
        staleTime: STALE_LIST,
      },
      {
        queryKey: queryKeys.categories(),
        queryFn: listCategories,
        staleTime: STALE_LIST,
      },
    ],
  });
  const [latest, categories] = results;
  return {
    latest: latest.data,
    latestError: latest.isError,
    isLoading: latest.isLoading,
    categories: categories.data ?? [],
    categoriesError: categories.isError,
  };
}
