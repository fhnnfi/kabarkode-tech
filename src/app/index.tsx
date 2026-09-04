import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FeaturedArticle } from '@/components/article/FeaturedArticle';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { CategorySection } from '@/components/category/CategorySection';
import { EmptyState, ErrorState } from '@/components/common/States';
import { LoadMoreButton } from '@/components/common/Pagination';
import { useArticlePage, useCategories, useHomeFeed } from '@/services/queries';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { SITE_NAME, SITE_TAGLINE } from '@/constants/config';
import { friendlyErrorMessage } from '@/services/api/client';

export default function HomePage() {
  usePageHead({
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      'Berita teknologi Indonesia: pemrograman, framework, library, AI, keamanan siber, open source, dan rilis teknologi.',
    canonical: canonicalUrl('/'),
    og: {
      'og:title': SITE_NAME,
      'og:description': SITE_TAGLINE,
      'og:type': 'website',
      'og:url': canonicalUrl('/'),
    },
  });

  const { latest, isLoading, latestError } = useHomeFeed();
  const { data: categories = [] } = useCategories();
  const [page, setPage] = useState(2);
  const more = useArticlePage({ page, limit: 12 });

  const articles = latest?.articles ?? [];
  const featured = articles[0];
  const secondary = articles.slice(1, 3);
  const latestRest = articles.slice(3, 11);
  const homeCategories = categories.slice(0, 3);

  return (
    <SiteShell>
      {/* Hero / Featured (§15–16) */}
      <Container style={styles.hero}>
        {isLoading ? (
          <View style={styles.heroRow}>
            <View style={styles.heroMain}>
              <ArticleCardSkeleton />
            </View>
            <View style={styles.heroSide}>
              <ArticleCardSkeleton variant="row" />
              <ArticleCardSkeleton variant="row" />
            </View>
          </View>
        ) : latestError ? (
          <ErrorState message={friendlyErrorMessage(latestError)} />
        ) : !featured ? (
          <EmptyState />
        ) : (
          <View style={styles.heroRow}>
            <View style={styles.heroMain}>
              <FeaturedArticle article={featured} />
            </View>
            <View style={styles.heroSide}>
              {secondary.map((a) => (
                <ArticleCard key={a.id} article={a} variant="row" />
              ))}
            </View>
          </View>
        )}
      </Container>

      {/* Latest */}
      <Container style={styles.section}>
        <SectionHeader title="Terbaru" index="01" viewAllHref="/search" viewAllLabel="Semua berita →" />
        {isLoading ? (
          <View style={styles.grid}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.gridItem}>
                <ArticleCardSkeleton />
              </View>
            ))}
          </View>
        ) : latestRest.length > 0 ? (
          <View style={styles.grid}>
            {latestRest.map((a) => (
              <View key={a.id} style={styles.gridItem}>
                <ArticleCard article={a} />
              </View>
            ))}
          </View>
        ) : (
          !latestError && <EmptyState />
        )}
      </Container>

      {/* Category highlights — data-driven, tiap section terisolasi dari kegagalan (§77) */}
      {homeCategories.length > 0 && (
        <Container style={styles.section}>
          <SectionHeader title="Topik Pilihan" index="02" viewAllHref="/categories" />
          <View style={{ gap: spacing['2xl'] }}>
            {homeCategories.map((c) => (
              <CategorySection key={c.id} category={c} />
            ))}
          </View>
        </Container>
      )}

      {/* More articles (load more) */}
      {articles.length > 0 && (
        <Container style={styles.section}>
          <SectionHeader title="Berita Lainnya" index="03" />
          <View style={styles.grid}>
            {more.data?.articles.map((a) => (
              <View key={a.id} style={styles.gridItem}>
                <ArticleCard article={a} />
              </View>
            ))}
          </View>
          {more.data && (
            <LoadMoreButton
              meta={more.data.meta}
              loading={more.isFetching}
              onLoadMore={() => setPage((p) => p + 1)}
            />
          )}
        </Container>
      )}
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: spacing.xl },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  heroMain: { flex: 3, minWidth: 340 },
  heroSide: { flex: 2, minWidth: 320, gap: spacing.lg },
  section: { marginTop: spacing['3xl'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  gridItem: { flexBasis: '30%', flexGrow: 1, minWidth: 280 },
});
