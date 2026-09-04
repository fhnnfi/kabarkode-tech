/**
 * Service artikel — endpoint publik nyata:
 *   GET /articles            (list published, filter category/tag/search, meta pagination)
 *   GET /articles/:idOrSlug  (detail by slug)
 * Tidak ada endpoint related-articles; related difetch via list per kategori.
 */
import { apiClient } from './client';
import type { Article, ArticleListParams, ApiEnvelope, ApiMeta } from '@/types/api';

export interface ArticlePage {
  articles: Article[];
  meta: ApiMeta;
}

function toParams(p: ArticleListParams): Record<string, string | number | undefined> {
  return {
    page: p.page,
    limit: p.limit,
    category: p.category,
    tag: p.tag,
    author: p.author,
    article_type: p.article_type,
    search: p.search,
    date_from: p.date_from,
    date_to: p.date_to,
  };
}

export async function listArticles(params: ArticleListParams): Promise<ArticlePage> {
  const env: ApiEnvelope<Article[]> = await apiClient.get<Article[]>('/articles', toParams(params));
  const meta: ApiMeta = env.meta ?? {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    total: env.data.length,
    totalPages: 1,
  };
  return { articles: env.data, meta };
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const env = await apiClient.get<Article>(`/articles/${encodeURIComponent(slug)}`);
  return env.data;
}

/** Related articles: artikel terbaru sekategori, mengecualikan artikel ini. */
export async function getRelatedArticles(article: Article): Promise<Article[]> {
  if (!article.category?.slug) return [];
  const { articles } = await listArticles({
    category: article.category.slug,
    page: 1,
    limit: 5,
  });
  return articles.filter((a) => a.id !== article.id).slice(0, 4);
}
