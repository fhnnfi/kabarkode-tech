import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/theme';
import { Logo } from '@/components/common/Logo';

/**
 * Area cover artikel. Backend publik tidak menyediakan URL cover
 * (GET /media/:id butuh auth — lihat utils/media.ts), jadi selalu tampil
 * fallback brand K</> (§61). Bila nanti backend membuka URL cover publik,
 * cukup ganti komponen ini — pemakaian di kartu tidak berubah.
 */
export function ArticleCover({
  ratio = 16 / 9,
  compact = false,
  title,
}: {
  ratio?: number;
  compact?: boolean;
  title?: string;
}) {
  return (
    <View
      style={[styles.wrap, { aspectRatio: ratio }]}
      accessibilityLabel={title ? `Sampul artikel: ${title}` : 'Sampul KabarKode'}
    >
      <View style={styles.grid} />
      <Logo size={compact ? 28 : 44} />
      {!compact && (
        <Text style={styles.word}>KABARKODE</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.5,
  },
  word: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 4,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
