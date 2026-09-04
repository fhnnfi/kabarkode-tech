# KabarKode Tech — Public News Website

Situs berita publik **KabarKode**: media penyebaran berita teknologi Indonesia
(software engineering, programming, developer tools, framework, library, AI,
cybersecurity, open source, rilis teknologi).

Dibangun dengan **Expo + React Native Web + Expo Router + TypeScript** sehingga
codebase yang sama siap dikembangkan menjadi aplikasi Android/iOS native.

## Stack

- Expo SDK 54 + Expo Router v6 (file-based routing)
- React Native Web (target utama: web responsif)
- TypeScript strict
- TanStack Query v5 (server state + caching)
- Design token terpusat di `src/theme/`

## Backend

API publik `kabarkode-backend` — frontend **beradaptasi penuh** dengan API yang
sudah berjalan; tidak ada endpoint backend yang diubah/ditambah.

Endpoint yang dipakai (diverifikasi langsung dari kode + OpenAPI live):

| Endpoint | Kegunaan |
| --- | --- |
| `GET /api/v1/articles` | List artikel published. Filter: `page, limit (max 100), category (slug), tag (slug), author (slug), article_type, search (min 2 char), date_from, date_to` |
| `GET /api/v1/articles/:slug` | Detail artikel by slug (publik hanya yang published) |
| `GET /api/v1/categories` | List kategori (publik, tanpa meta) |
| `GET /api/v1/tags` | List tag (publik, dengan meta pagination) |

Envelope respons: `{ success: true, data, meta? }` dengan
`meta = { page, limit, total, totalPages }`.

Artikel (`ArticleDetail`): `id, title, slug, excerpt, content (HTML tersanitasi),
status, article_type, author_id, category_id, cover_media_id, source_name,
source_url, published_at, created_at, updated_at` + relasi inline
`author {id,name,slug}`, `category {id,name,slug}`, `tags [{id,name,slug}]`.

### Catatan penting: cover image

`GET /media/:id` kini publik di backend (hanya metadata), sehingga frontend
resolve `cover_media_id` → `public_url` (cdn.fhanalabs.site) tanpa auth —
lihat `services/api/media.ts` + `useMedia()`. Kartu/artikel menampilkan gambar
nyata via `expo-image` (lazy + fade); artikel tanpa cover atau saat URL gagal
dimuat memakai fallback brand K</> (`ArticleCover`). Domain media tidak pernah
di-hard-code; URL selalu dari respons backend.

### Catatan penting: search & related

- Search memakai filter nyata `?search=` (LIKE pada title+excerpt+content).
- Tidak ada endpoint related-articles; related difallback via
  `GET /articles?category=<slug>` (artikel sekategori, tanpa logika rekomendasi
  mahal di klien).

## Development

```bash
npm install
cp .env.example .env
npm run web        # expo start --web (default port 8080)
```

Environment:

```
EXPO_PUBLIC_API_URL=https://kabarkodeapi.fhanalabs.site/api/v1
EXPO_PUBLIC_SITE_URL=http://localhost:8080   # untuk canonical/OG
```

## Build produksi (web)

```bash
npm run build:web  # expo export --platform web -> dist/
```

Output statis di `dist/` (HTML shell + JS bundle per-route).

## Struktur

```
src/
├── app/                  # rute Expo Router
│   ├── index.tsx         # homepage (hero, terbaru, topik, load more)
│   ├── article/[slug]    # detail + reading progress + related
│   ├── category/[slug]   # halaman kategori
│   ├── tag/[slug]        # halaman tag
│   ├── search.tsx        # layar pencarian (?q=)
│   ├── categories.tsx    # indeks kategori + tag
│   ├── about.tsx
│   └── +html.tsx         # shell HTML web (font, meta dasar)
├── components/           # layout/, navigation/, article/, category/,
│                         # media/, search/, common/
├── services/
│   ├── api/              # client.ts (fetch terpusat), articles, categories
│   └── queries/          # hook TanStack Query
├── hooks/                # usePageHead, useBreakpoint, useDebounce, useReducedMotion
├── platform/web/         # kode browser-spesifik terisolasi (SEO, openExternal)
├── theme/                # design tokens: colors, typography, spacing, radii, animation
├── types/                # tipe API 1:1 dengan backend nyata
└── utils/                # date (ID), reading time, html parser, media
```

## Desain

- Palet: hitam `#111111`, putih, warm neutral `#F7F7F5`, border `#E7E7E5`,
  teks sekunder `#6B6B6B`, aksen hijau `#A3FF12` (hemat).
- Tipografi: Inter (editorial) + JetBrains Mono (metadata teknis, `LATEST // 01`).
- Breakpoint: mobile <768, tablet 768–1023, desktop ≥1024, wide ≥1440.
- Animasi subtle 150–300ms ease-out; `prefers-reduced-motion` dihormati.
- `Ctrl/Cmd+K` membuka overlay pencarian; `Esc` menutup.

## SEO

`output: "static"` Expo web + `+html.tsx` menghasilkan HTML shell dengan meta
dasar; tag dinamis per halaman (title, description, canonical, Open Graph,
`article:published_time`, JSON-LD `NewsArticle`) diterapkan dari
`src/platform/web/seo.ts` (terisolasi dari komponen). Karena arsitekturnya
client-render (bukan SSR penuh seperti Next.js), crawler yang tidak
mengeksekusi JS hanya melihat shell + meta dasar — ini batasan nyata dari
React Native Web yang diakui, bukan SEO palsu.

## Prinsip

- Semua data dari backend; tidak ada konten karangan.
- Tidak ada `fetch()` liar di komponen — semua lewat `services/api`.
- Tidak ada URL/secret backend yang di-hard-code; hanya env publik.
- Komponen memakai primitif RN (View/Text/Pressable/ScrollView) — siap untuk
  native Android/iOS di fase berikutnya.
