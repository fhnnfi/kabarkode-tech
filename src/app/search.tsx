import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/common/States';
import { LoadMoreButton } from '@/components/common/Pagination';
import { useArticlePage } from '@/services/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { friendlyErrorMessage } from '@/services/api/client';

/**
 * Layar pencarian penuh (§29–30): /search?q=...
 * Endpoint nyata: GET /articles?search= (LIKE title+excerpt+content, min 2 char).
 */
export default function SearchPage() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [input, setInput] = useState(params.q ?? '');
  const debounced = useDebounce(input, 300);
  const q = debounced.trim();
  const [page, setPage] = useState(1);

  // Sinkronkan URL saat query berubah (web).
  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
      window.history.replaceState(null, '', url);
    }
    setPage(1);
  }, [q]);

  const enabled = q.length >= 2;
  const { data, isLoading, isFetching, isError, error, refetch } = useArticlePage({
    search: enabled ? q : undefined,
    page,
    limit: 12,
  });

  usePageHead({
    title: q ? `Pencarian: ${q} — KabarKode` : 'Pencarian — KabarKode',
    canonical: canonicalUrl('/search'),
  });

  const articles = enabled ? data?.articles ?? [] : [];

  return (
    <SiteShell>
      <Container style={styles.head}>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Cari berita, tutorial, analisis…"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            autoFocus
            accessibilityLabel="Kolom pencarian"
            returnKeyType="search"
          />
          {input.length > 0 && (
            <View style={styles.count}>
              <Text style={styles.countText}>
                {enabled && data ? `${data.meta.total} artikel ditemukan` : 'min. 2 karakter'}
              </Text>
            </View>
          )}
        </View>
      </Container>

      <Container>
        {enabled && (
          <SectionHeader
            title={`Hasil untuk "${q}"`}
            index={data ? String(data.meta.total).padStart(2, '0') : undefined}
          />
        )}
        {!enabled ? (
          <EmptyState
            title="Mulai mengetik"
            subtitle="Cari berdasarkan judul, isi artikel, atau kata kunci teknologi."
          />
        ) : isError ? (
          <ErrorState message={friendlyErrorMessage(error)} onRetry={() => refetch()} />
        ) : isLoading && page === 1 ? (
          <View style={styles.grid}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.gridItem}>
                <ArticleCardSkeleton />
              </View>
            ))}
          </View>
        ) : articles.length === 0 ? (
          <EmptyState title="Artikel tidak ditemukan." subtitle="Coba gunakan kata kunci lain." />
        ) : (
          <>
            <View style={styles.grid}>
              {articles.map((a) => (
                <View key={a.id} style={styles.gridItem}>
                  <ArticleCard article={a} />
                </View>
              ))}
            </View>
            {data && (
              <LoadMoreButton
                meta={data.meta}
                loading={isFetching}
                onLoadMore={() => setPage((p) => p + 1)}
              />
            )}
          </>
        )}
      </Container>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  head: { paddingTop: spacing['2xl'], paddingBottom: spacing.lg },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
  },
  input: {
    flex: 1,
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    color: colors.black,
    paddingVertical: spacing.base,
    outlineStyle: 'none' as never,
  },
  count: {},
  countText: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    color: colors.textSecondary,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  gridItem: { flexBasis: '30%', flexGrow: 1, minWidth: 280 },
});
