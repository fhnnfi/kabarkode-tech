import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { layout, spacing } from '@/theme';
import { useBreakpoint } from '@/hooks/useBreakpoint';


/** Kontainer terpusat dengan gutter (§12).
 * Wide desktop (>=1440px): batas dinaikkan ke 1600px agar gap kiri-kanan
 * tidak berlebihan pada layar ultrawide, topbar & konten tetap sejajar. */
export function Container({
  children,
  style,
  narrow = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  narrow?: boolean;
}) {
  const { bp, width } = useBreakpoint();
  // Wide desktop (>=1440px): 90% viewport — gap kiri-kanan proporsional
  // di layar ultrawide, topbar & konten tetap sejajar.
  const max = narrow
    ? layout.readingMaxWidth
    : bp === 'wide'
      ? Math.round(width * 0.9)
      : layout.containerMaxWidth;
  return (
    <View
      style={[
        styles.wrap,
        { maxWidth: max },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
});
