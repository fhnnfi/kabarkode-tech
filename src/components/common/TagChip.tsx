import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, typography } from '@/theme';

/** Chip tag ringan: #React (§32). */
export function TagChip({ name, slug }: { name: string; slug: string }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/tag/[slug]', params: { slug } })}
      style={({ pressed, hovered }) => [
        styles.chip,
        hovered && styles.chipHover,
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="link"
      accessibilityLabel={`Tag ${name}`}
    >
      <Text style={styles.text}>#{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.white,
  },
  chipHover: {
    borderColor: colors.black,
  },
  text: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
