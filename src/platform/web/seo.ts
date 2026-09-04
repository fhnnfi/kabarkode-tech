/**
 * Isolasi kode spesifik platform (§66). Komponen reusable TIDAK menyentuh
 * window/document/localStorage langsung — semuanya lewat modul ini, dengan
 * stub native yang aman.
 */
import { Platform } from 'react-native';

export interface SeoTags {
  title: string;
  description?: string;
  canonical?: string;
  og?: Record<string, string>;
  /** JSON-LD structured data (schema.org Article). */
  jsonLd?: Record<string, unknown>;
}

/** Terapkan tag SEO ke document — no-op di native. */
export function applySeo(tags: SeoTags): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  document.title = tags.title;
  if (tags.description) setMeta('name', 'description', tags.description);

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (tags.canonical) {
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = tags.canonical;
  }

  if (tags.og) {
    for (const [k, v] of Object.entries(tags.og)) setMeta('property', k, v);
  }

  if (tags.jsonLd) {
    let script = document.getElementById('kk-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'kk-jsonld';
      (script as HTMLScriptElement).type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(tags.jsonLd);
  }
}

/** Buka URL eksternal — di native nanti pakai Linking. */
export function openExternal(url: string): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Preferensi reduced motion pengguna. */
export function prefersReducedMotion(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
