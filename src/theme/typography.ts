/**
 * Tipografi editorial: Inter untuk teks, JetBrains Mono untuk metadata teknis.
 * Di web, font dimuat via platform/web/fonts (terisolasi dari komponen).
 * Di native, fallback ke font sistem sampai font bundle ditambahkan.
 */
const SANS = 'Inter';
const MONO = 'JetBrains Mono';

const sansStack = `${SANS}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
const monoStack = `${MONO}, "SF Mono", Menlo, Consolas, monospace`;

export const typography = {
  families: {
    sans: sansStack,
    mono: monoStack,
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 36,
    '4xl': 48,
    '5xl': 64,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  /** Label kecil uppercase bergaya teknis (kategori, metadata). */
  label: {
    fontFamily: monoStack,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;
