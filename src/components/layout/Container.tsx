import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { layout, spacing } from '@/theme';


/** Kontainer terpusat max 1280px dengan gutter (§12). */
export function Container({
  children,
  style,
  narrow = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  narrow?: boolean;
}) {
  return (
    <View
      style={[
        styles.wrap,
        { maxWidth: narrow ? layout.readingMaxWidth : layout.containerMaxWidth },
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
