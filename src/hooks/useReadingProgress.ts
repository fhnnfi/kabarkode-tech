/**
 * Progress baca (0..1) berbasis scroll document/window di web.
 * Terisolasi: di native mengembalikan 0 (nanti pakai Animated.ScrollView).
 */
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}
