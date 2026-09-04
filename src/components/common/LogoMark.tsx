import React from 'react';
import { Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { typography } from '@/theme';

/**
 * Logo resmi KabarKode dari assets/images/kabarkode{black,white}.svg —
 * dirender inline via react-native-svg: tajam di semua ukuran (dibanding
 * PNG 300px), tanpa request jaringan, dan kompatibel native.
 *
 * variant 'black' = kotak hitam (untuk latar terang: header)
 * variant 'white' = kotak putih (untuk latar gelap: footer)
 */
export function LogoMark({
  size = 34,
  variant = 'black',
}: {
  size?: number;
  variant?: 'black' | 'white';
}) {
  const box = variant === 'black' ? '#000000' : '#FFFFFF';
  const letter = variant === 'black' ? '#FFFFFF' : '#000000';
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" fill="none" accessibilityLabel="KabarKode">
      <Rect width="300" height="300" rx="30" fill={box} />
      <Path
        d="M45.4361 180V117.455H58.6598V145.032H59.4844L81.9922 117.455H97.8423L74.6321 145.46L98.1172 180H82.2976L65.1648 154.286L58.6598 162.226V180H45.4361Z"
        fill={letter}
      />
      <Path
        d="M107.02 154.499V143.749L150.02 124.815V137.183L120.579 149.002L120.976 148.361V149.888L120.579 149.246L150.02 161.065V173.434L107.02 154.499ZM190.179 114.523L170.023 189.406H158.815L178.971 114.523H190.179ZM241.982 160.363L198.982 179.298V166.929L228.423 155.11L228.026 155.751V154.224L228.423 154.866L198.982 143.047V130.678L241.982 149.613V160.363Z"
        fill="#A3F011"
      />
    </Svg>
  );
}

/** Wordmark "KabarKode" di samping logo (primitif RN — kompatibel native). */
export function LogoWord({ size = 34, color = '#111111' }: { size?: number; color?: string }) {
  return (
    <Text
      style={{
        fontFamily: typography.families.sans,
        fontWeight: '800',
        fontSize: size * 0.55,
        color,
        letterSpacing: -0.5,
      }}
    >
      KabarKode
    </Text>
  );
}
