/**
 * Penanganan media (§27–28).
 *
 * GET /media/:id kini PUBLIK di backend (hanya metadata) sehingga situs
 * publik bisa resolve `cover_media_id` -> `public_url` (cdn.fhanalabs.site)
 * tanpa auth. Lihat services/api/media.ts + components/media/ArticleCover.tsx.
 *
 * Domain media tidak pernah di-hard-code — URL selalu dari respons backend.
 * Fallback brand K</> dipakai bila artikel tanpa cover atau URL gagal dimuat.
 */
export function isPublicImageUrl(url: string | null | undefined): boolean {
  return !!url && /^https?:\/\//i.test(url);
}
