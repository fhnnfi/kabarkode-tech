import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { Platform } from 'react-native';

/**
 * Shell publik: Header sticky → konten → Footer (§12).
 *
 * Scroll memakai document/window biasa (bukan ScrollView internal) supaya:
 * - footer mengalir normal di paling bawah halaman (baru terlihat saat
 *   user scroll ke bawah),
 * - sticky header & sticky reading-progress tetap bekerja,
 * - posisi scroll antar halaman natural (browser restore).
 * Ctrl/Cmd+K membuka overlay pencarian di desktop (§60).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Kembali ke atas saat pindah halaman (scroll level document).
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <View style={styles.root}>
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <View style={styles.main}>{children}</View>
      <Footer />
      <SearchOverlay visible={searchOpen} onClose={() => setSearchOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    // '100%' tidak resolve di web (tinggi #root tidak fixed). react-native-web
    // menerima '100vh' saat runtime; tipe RN inti belum mengeksposenya.
    minHeight: '100vh' as unknown as number,
  },
  main: { flex: 1 },
});
