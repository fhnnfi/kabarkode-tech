import React from 'react';
import { View } from 'react-native';
import { LogoMark, LogoWord } from '@/components/common/LogoMark';

/**
 * Logo brand KabarKode (SVG resmi, lihat LogoMark) + wordmark opsional.
 * Dipakai di header (variant black) dan footer (variant white).
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
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.3 }}>
      <LogoMark size={size} variant={inverted ? 'white' : 'black'} />
      {showWordmark && (
        <LogoWord size={size} color={inverted ? '#FFFFFF' : '#111111'} />
      )}
    </View>
  );
}
