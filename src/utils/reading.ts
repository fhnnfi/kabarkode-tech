/**
 * Waktu baca dihitung andal dari konten (200 wpm, konvensi umum) —
 * hanya ditampilkan bila bisa dihitung dari teks nyata (§65).
 */
export function estimateReadingMinutes(html: string | null | undefined): number | null {
  if (!html) return null;
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 50) return null; // terlalu pendek, jangan tampilkan angka palsu
  return Math.max(1, Math.round(words / 200));
}

/** Plain text dari HTML (untuk meta description). */
export function htmlToPlainText(html: string | null | undefined, maxLen = 160): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}
