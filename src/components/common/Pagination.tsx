import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import type { ApiMeta } from '@/types/api';

/**
 * Load-more berbasis meta pagination backend { page, limit, total, totalPages } (§48).
 */
export function LoadMoreButton({
  meta,
  loading,
  onLoadMore,
}: {
  meta: ApiMeta;
  loading: boolean;
  onLoadMore: () => void;
}) {
  const hasMore = meta.page < meta.totalPages;
  if (!hasMore) {
    return (
      <View style={styles.endWrap}>
        <Text style={styles.endText}>— END OF FEED // {meta.total} ARTIKEL —</Text>
      </View>
    );
  }
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onLoadMore}
        disabled={loading}
        style={({ hovered }) => [styles.btn, hovered && !loading && styles.btnHover, loading && styles.btnDisabled]}
        accessibilityRole="button"
      >
        <Text style={[styles.btnText, loading && { color: colors.textSecondary }]}>
          {loading ? 'MEMUAT…' : 'MUAT LEBIH BANYAK'}
        </Text>
      </Pressable>
      <Text style={styles.count}>
        {meta.page} / {meta.totalPages} • {meta.total} artikel
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  btn: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  btnHover: { backgroundColor: colors.black },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.black,
  },
  count: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    color: colors.textSecondary,
  },
  endWrap: { alignItems: 'center', marginTop: spacing.xl },
  endText: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textSecondary,
  },
});
