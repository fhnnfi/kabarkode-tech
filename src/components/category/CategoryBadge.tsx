import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/theme';

/** Badge kategori — indikator hijau kecil di atas judul (§18). */
export function CategoryBadge({ name }: { name: string | null | undefined }) {
  if (!name) return null;
  return <Text style={styles.badge}>{name.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.black,
    backgroundColor: colors.accent,
    paddingHorizontal: radii.md,
    paddingVertical: 3,
    borderRadius: radii.sm,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});
