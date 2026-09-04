export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
} as const;

/** Kontainer terpusat sesuai requirement §12. */
export const layout = {
  containerMaxWidth: 1280,
  /** Lebar baca artikel (§24). */
  readingMaxWidth: 720,
  headerHeight: 64,
  gutter: 24,
} as const;

/** Breakpoint (§11). */
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  wide: 1440,
} as const;
