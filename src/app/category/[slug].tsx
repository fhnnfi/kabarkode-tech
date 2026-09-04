import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FeaturedArticle } from '@/components/article/FeaturedArticle';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState, ErrorState } from '@/components/common/States';
import { LoadMoreButton } from '@/components/common/Pagination';
import { Label } from '@/components/common/Label';
import { useArticlePage, useCategories } from '@/services/queries';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { friendlyErrorMessage } from '@/services/api/client';

/** Halaman kategori (§22): header kategori → featured → grid → load more. */
export default function CategoryPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.slug === slug);

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useArticlePage({
    category: slug,
    page,
    limit: 12,
  });

  usePageHead({
    title: category ? `${category.name} — KabarKode` : 'Kategori — KabarKode',
    description: category?.description ?? undefined,
    canonical: canonicalUrl(`/category/${slug}`),
    og: {
      'og:title': category ? `${category.name} — KabarKode` : 'KabarKode',
      'og:description': category?.description ?? '',
      'og:type': 'website',
      'og:url': canonicalUrl(`/category/${slug}`),
    },
  });

  const articles = data?.articles ?? [];
  const featured = page === 1 ? articles[0] : undefined;
  const rest = page === 1 ? articles.slice(1) : articles;

  return (
    <SiteShell>
      <Container style={styles.head}>
        <Label>KATEGORI //</Label>
        <Text style={styles.title}>{(category?.name ?? slug ?? '').toUpperCase()}</Text>
        {!!category?.description && <Text style={styles.desc}>{category.description}</Text>}
      </Container>

      <Container>
        {isError ? (
          <ErrorState message={friendlyErrorMessage(error)} onRetry={() => refetch()} />
        ) : isLoading && page === 1 ? (
          <View style={styles.grid}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridItem}>
                <ArticleCardSkeleton />
              </View>
            ))}
          </View>
        ) : articles.length === 0 ? (
          <EmptyState title="Belum ada artikel dalam kategori ini." />
        ) : (
          <>
            {featured && (
              <View style={styles.featured}>
                <FeaturedArticle article={featured} />
              </View>
            )}
            <SectionHeader title="Semua Artikel" index={String(data?.meta.total ?? 0).padStart(2, '0')} />
            <View style={styles.grid}>
              {rest.map((a) => (
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
    fontSize: typography.size['4xl'],
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.black,
  },
  desc: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    maxWidth: 560,
    lineHeight: 27,
  },
  featured: { maxWidth: 720, marginBottom: spacing['2xl'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  gridItem: { flexBasis: '30%', flexGrow: 1, minWidth: 280 },
});
