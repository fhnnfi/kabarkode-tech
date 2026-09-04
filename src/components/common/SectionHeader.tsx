import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/theme';

/**
 * Judul section editorial dengan dekorasi teknis: "LATEST // 01" (§38).
 */
export function SectionHeader({
  title,
  index,
  viewAllHref,
  viewAllLabel = 'Lihat semua →',
}: {
  title: string;
  index?: string;
  viewAllHref?: string | object;
  viewAllLabel?: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        {index && <Text style={styles.index}>// {index}</Text>}
      </View>
      {viewAllHref && (
        <Pressable
          onPress={() => router.push(viewAllHref as never)}
          style={({ hovered }) => hovered && { opacity: 0.7 }}
          accessibilityRole="link"
        >
          <Text style={styles.viewAll}>{viewAllLabel}</Text>
        </Pressable>
      )}
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    paddingBottom: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.black,
  },
  index: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewAll: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.black,
    fontWeight: '600',
  },
  rule: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
});
