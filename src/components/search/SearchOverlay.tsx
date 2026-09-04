import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '@/theme';
import { useDebounce } from '@/hooks/useDebounce';
import { useArticles } from '@/services/queries';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { formatDateShortId } from '@/utils/date';

/**
 * Overlay pencarian gaya command (desktop, §31) — fade + scale sederhana.
 * Mobile memakai layar /search penuh; overlay ini tetap bisa dipakai via Ctrl+K.
 * Search memakai endpoint nyata: GET /articles?search=... (min. 2 karakter).
 */
export function SearchOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState('');
  const debounced = useDebounce(query, 300);
  const inputRef = React.useRef<TextInput>(null);

  const { data, isFetching, isError } = useArticles({
    search: debounced,
    page: 1,
    limit: 6,
  });
  const enabled = debounced.trim().length >= 2;
  const results = enabled ? data?.articles ?? [] : [];

  React.useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery('');
  }, [visible]);

  // Esc untuk menutup.
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityViewIsModal>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.inputRow}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search KabarKode…"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              accessibilityLabel="Kolom pencarian"
            />
            <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Tutup pencarian">
              <Text style={styles.closeText}>ESC</Text>
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 420 }} keyboardShouldPersistTaps="handled">
            {!enabled && !query && (
              <Text style={styles.hint}>
                Ketik minimal 2 karakter untuk mencari artikel.
              </Text>
            )}
            {enabled && isFetching && !data && (
              <View style={{ padding: spacing.base }}>
                <ArticleCardSkeleton variant="row" />
              </View>
            )}
            {enabled && isError && (
              <Text style={styles.hint}>Pencarian gagal dimuat. Coba lagi.</Text>
            )}
            {enabled && !isFetching && results.length === 0 && (
              <Text style={styles.hint}>Artikel tidak ditemukan.{'\n'}Coba gunakan kata kunci lain.</Text>
            )}
            {results.map((a) => (
              <Pressable
                key={a.id}
                style={({ hovered }) => [styles.result, hovered && styles.resultHover]}
                onPress={() => {
                  onClose();
                  router.push({ pathname: '/article/[slug]', params: { slug: a.slug } });
                }}
                accessibilityRole="link"
              >
                <Text style={styles.resultCat}>
                  {a.category?.name?.toUpperCase() ?? 'BERITA'}
                </Text>
                <Text style={styles.resultTitle} numberOfLines={2}>{a.title}</Text>
                <Text style={styles.resultMeta}>
                  {a.author?.name ?? 'Redaksi'} • {formatDateShortId(a.published_at)}
                </Text>
              </Pressable>
            ))}
            {enabled && results.length > 0 && (
              <Pressable
                style={styles.viewAll}
                onPress={() => {
                  onClose();
                  router.push({ pathname: '/search', params: { q: debounced } });
                }}
              >
                <Text style={styles.viewAllText}>Lihat semua hasil →</Text>
              </Pressable>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.45)',
    alignItems: 'center',
    paddingTop: 96,
  },
  panel: {
    width: '92%',
    maxWidth: 640,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    color: colors.black,
    paddingVertical: spacing.base,
    outlineStyle: 'none' as never,
  },
  closeBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  closeText: {
    fontFamily: typography.families.mono,
    fontSize: 10,
    color: colors.textSecondary,
  },
  hint: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    padding: spacing.base,
    lineHeight: 22,
  },
  result: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 3,
  },
  resultHover: { backgroundColor: colors.bg },
  resultCat: {
    fontFamily: typography.families.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  resultTitle: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.base,
    fontWeight: '700',
    color: colors.black,
  },
  resultMeta: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    color: colors.textSecondary,
  },
  viewAll: { padding: spacing.base },
  viewAllText: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    fontWeight: '600',
    color: colors.black,
  },
});
