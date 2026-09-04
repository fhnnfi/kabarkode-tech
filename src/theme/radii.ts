/** Radius restrained — editorial & teknis, bukan pill (§71). */
export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

/** Bayangan sangat hemat; kartu mengandalkan border (§72). */
export const shadows = {
  none: {},
  header: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
} as const;
