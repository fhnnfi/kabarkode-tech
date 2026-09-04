/**
 * SEO web-only: tag dinamis (title, description, OG, canonical, JSON-LD)
 * diterapkan via platform/web/seo — terisolasi dari komponen (§66).
 */
import { useEffect } from 'react';
import { applySeo, type SeoTags } from '@/platform/web/seo';
import { SITE_NAME, SITE_URL } from '@/constants/config';

export function usePageHead(tags: SeoTags) {
  useEffect(() => {
    applySeo(tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags.title, tags.description, tags.canonical, JSON.stringify(tags.og ?? {}), JSON.stringify(tags.jsonLd ?? {})]);

  return { siteName: SITE_NAME, siteUrl: SITE_URL };
}

/** Helper canonical sederhana. */
export function canonicalUrl(path: string): string {
  return `${SITE_URL.replace(/\/+$/, '')}${path}`;
}

export { SITE_NAME };
