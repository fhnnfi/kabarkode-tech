import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/common/States';
import { LoadMoreButton } from '@/components/common/Pagination';
import { Label } from '@/components/common/Label';
import { useArticlePage } from '@/services/queries';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { friendlyErrorMessage } from '@/services/api/client';

/** Halaman tag (§32): /tag/[slug] — backend mendukung filter ?tag=slug. */
export default function TagPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useArticlePage({
    tag: slug,
    page,
    limit: 12,
  });

  usePageHead({
    title: `#${slug} — KabarKode`,
    canonical: canonicalUrl(`/tag/${slug}`),
    og: {
      'og:title': `#${slug} — KabarKode`,
      'og:type': 'website',
      'og:url': canonicalUrl(`/tag/${slug}`),
    },
  });

  const articles = data?.articles ?? [];

  return (
    <SiteShell>
      <Container style={styles.head}>
        <Label>TAG //</Label>
        <Text style={styles.title}>#{slug}</Text>
      </Container>
      <Container>
        {isError ? (
          <ErrorState message={friendlyErrorMessage(error)} onRetry={() => refetch()} />
        ) : isLoading ? (
          <View style={styles.grid}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.gridItem}>
                <ArticleCardSkeleton />
              </View>
            ))}
          </View>
        ) : articles.length === 0 ? (
          <EmptyState title="Belum ada artikel dengan tag ini." />
        ) : (
          <>
            <SectionHeader title={`Artikel #${slug}`} index={String(data?.meta.total ?? 0).padStart(2, '0')} />
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
  head: { paddingTop: spacing['2xl'], paddingBottom: spacing.xl, gap: spacing.sm },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size['3xl'],
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.black,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  gridItem: { flexBasis: '30%', flexGrow: 1, minWidth: 280 },
});
