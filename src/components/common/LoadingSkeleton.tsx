import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

/** Skeleton yang menyerupai layout asli (§42) — bukan spinner generik. */
export function SkeletonBlock({
  width = '100%',
  height = 14,
  radius = radii.sm,
  style,
}: {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: object;
}) {
  return (
    <View
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.skeleton }, style]}
      accessibilityElementsHidden
    />
  );
}

export function ArticleCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'row' }) {
  if (variant === 'row') {
    return (
      <View style={styles.row}>
        <SkeletonBlock width={140} height={105} radius={radii.md} />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <SkeletonBlock width={80} height={12} />
          <SkeletonBlock height={18} />
          <SkeletonBlock width="70%" height={18} />
          <SkeletonBlock width="50%" height={12} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <SkeletonBlock height={180} radius={radii.md} />
      <View style={{ gap: spacing.sm, paddingTop: spacing.base }}>
        <SkeletonBlock width={90} height={12} />
        <SkeletonBlock height={20} />
        <SkeletonBlock width="80%" height={20} />
        <SkeletonBlock width="60%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.base,
    backgroundColor: colors.white,
  },
});
