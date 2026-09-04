/** Reduced motion: disable animasi dekoratif, fungsi tetap (§41). */
import { useEffect, useState } from 'react';
import { Platform, AccessibilityInfo } from 'react-native';
import { prefersReducedMotion } from '@/platform/web/seo';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (Platform.OS === 'web') return prefersReducedMotion();
    return false;
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => setReduced(mq.matches);
      mq.addEventListener?.('change', onChange);
      return () => mq.removeEventListener?.('change', onChange);
    }
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => !cancelled && setReduced(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return reduced;
}
