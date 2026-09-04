import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';
import { formatDateShortId } from '@/utils/date';

/** "Fahmi • 4 Sep 2026 • 5 mnt baca" — metadata kartu (§18). */
export function ArticleMeta({
  authorName,
  publishedAt,
  readingMinutes,
}: {
  authorName?: string | null;
  publishedAt?: string | null;
  readingMinutes?: number | null;
}) {
  const parts = [
    authorName ?? 'Redaksi',
    formatDateShortId(publishedAt),
    readingMinutes ? `${readingMinutes} mnt baca` : '',
  ].filter(Boolean);
  return <Text style={styles.meta}>{parts.join('  •  ')}</Text>;
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
