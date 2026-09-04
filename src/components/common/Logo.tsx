import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '@/theme';

/**
 * Logo brand K</> — kotak hitam dengan K putih + </> hijau (§7, §61).
 * Dipakai di header, footer, dan placeholder cover.
 */
export function Logo({
  size = 36,
  inverted = false,
  showWordmark = false,
}: {
  size?: number;
  inverted?: boolean;
  showWordmark?: boolean;
}) {
  const boxBg = inverted ? colors.white : colors.black;
  const boxFg = inverted ? colors.black : colors.white;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.3 }}>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: boxBg,
          borderRadius: radii.sm,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel="KabarKode"
      >
        <Text
          style={{
            fontFamily: typography.families.sans,
            fontWeight: '800',
            fontSize: size * 0.5,
            color: boxFg,
            lineHeight: size * 0.55,
          }}
        >
          K
        </Text>
        <Text
          style={{
            fontFamily: typography.families.mono,
            fontWeight: '700',
            fontSize: size * 0.26,
            color: colors.accent,
            marginTop: -size * 0.06,
          }}
        >
          {'</>'}
        </Text>
      </View>
      {showWordmark && (
        <Text
          style={{
            fontFamily: typography.families.sans,
            fontWeight: '800',
            fontSize: size * 0.55,
            color: inverted ? colors.white : colors.black,
            letterSpacing: -0.5,
          }}
        >
          KabarKode
        </Text>
      )}
    </View>
  );
}
