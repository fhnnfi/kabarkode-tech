/**
 * Penanganan media (§27–28).
 *
 * FAKTA backend (diverifikasi): respons artikel publik hanya memuat
 * `cover_media_id`; `GET /media/:id` butuh token staff/author sehingga
 * situs publik TIDAK bisa resolve URL cover. Backend tidak boleh diubah.
 *
 * Keputusan: cover memakai fallback brand K</> (§61). Gambar INLINE di
 * konten artikel tetap tampil karena HTML hasil CMS sudah berisi URL
 * publik cdn.fhanalabs.site. Domain media tidak pernah di-hard-code.
 */
export function hasPublicCover(): false {
  return false;
}
