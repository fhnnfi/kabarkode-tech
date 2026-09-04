import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/theme';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { Platform } from 'react-native';

/**
 * Shell publik: Header sticky → konten → Footer (§12).
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
    minHeight: '100%',
  },
  main: { flex: 1 },
});
