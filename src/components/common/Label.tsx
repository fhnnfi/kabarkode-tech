import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

/** Label kecil uppercase monospace — SECURITY // 02 (§38). */
export function Label({
  children,
  color = colors.textSecondary,
}: {
  children: string;
  color?: string;
}) {
  return <Text style={[styles.label, { color }]} numberOfLines={1}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    fontFamily: typography.families.mono,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
