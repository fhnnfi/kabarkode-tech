/**
 * Responsive berbasis window width (web). Di native, selalu 'mobile'
 * sampai ditambahkan dimensi layar — komponen cukup cek `bp`.
 */
import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { breakpoints } from '@/theme';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

function compute(width: number): Breakpoint {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.tablet) return 'desktop';
  if (width >= breakpoints.mobile) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): { bp: Breakpoint; width: number } {
  const [width, setWidth] = useState<number>(() =>
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? window.innerWidth
      : Dimensions.get('window').width,
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      const sub = Dimensions.addEventListener('change', ({ window: w }) => setWidth(w.width));
      return () => sub.remove();
    }
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { bp: compute(width), width };
}

export const isDesktopBp = (bp: Breakpoint) => bp === 'desktop' || bp === 'wide';
export const isMobileBp = (bp: Breakpoint) => bp === 'mobile';
