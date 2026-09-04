import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { colors, radii, spacing, typography, layout } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { CategoryBadge } from '@/components/category/CategoryBadge';
import { ArticleMeta } from '@/components/article/ArticleMeta';
import { ArticleCover } from '@/components/media/ArticleCover';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleCard } from '@/components/article/ArticleCard';
import { TagChip } from '@/components/common/TagChip';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ErrorState } from '@/components/common/States';
import { SkeletonBlock } from '@/components/common/LoadingSkeleton';
import { useArticle, useRelatedArticles } from '@/services/queries';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { formatDateId } from '@/utils/date';
import { estimateReadingMinutes, htmlToPlainText } from '@/utils/reading';
import { friendlyErrorMessage } from '@/services/api/client';
import { openExternal } from '@/platform/web/seo';

export default function ArticlePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: article, isLoading, isError, error, refetch } = useArticle(slug ?? '');
  const related = useRelatedArticles(article);

  usePageHead({
    title: article ? `${article.title} — KabarKode` : 'Artikel — KabarKode',
    description: article
      ? htmlToPlainText(article.excerpt ?? article.content)
      : undefined,
    canonical: canonicalUrl(`/article/${slug}`),
    og: article
      ? {
          'og:title': article.title,
          'og:description': htmlToPlainText(article.excerpt ?? article.content),
          'og:type': 'article',
          'og:url': canonicalUrl(`/article/${slug}`),
          ...(article.published_at ? { 'article:published_time': article.published_at } : {}),
          ...(article.author?.name ? { 'article:author': article.author.name } : {}),
        }
      : undefined,
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: htmlToPlainText(article.excerpt ?? article.content),
          datePublished: article.published_at,
          author: article.author?.name
            ? { '@type': 'Person', name: article.author.name }
            : undefined,
          publisher: { '@type': 'Organization', name: 'KabarKode' },
          mainEntityOfPage: canonicalUrl(`/article/${slug}`),
        }
      : undefined,
  });

  // Progress baca tipis di atas konten (§34).
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [contentH, setContentH] = React.useState(0);
  const progress = scrollY.interpolate({
    inputRange: [0, Math.max(contentH - layout.headerHeight, 1)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const widthAnim = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  if (isLoading) {
    return (
      <SiteShell>
        <Container narrow style={styles.loading}>
          <SkeletonBlock width={120} height={20} />
          <SkeletonBlock height={40} />
          <SkeletonBlock width="70%" height={40} />
          <SkeletonBlock height={200} radius={radii.md} />
          <SkeletonBlock height={16} />
          <SkeletonBlock width="90%" height={16} />
          <SkeletonBlock width="80%" height={16} />
        </Container>
      </SiteShell>
    );
  }

  if (isError || !article) {
    return (
      <SiteShell>
        <Container style={styles.errorWrap}>
          <ErrorState
            message={
              error && friendlyErrorMessage(error).includes('ditemukan')
                ? 'Artikel tidak ditemukan.'
                : friendlyErrorMessage(error)
            }
            onRetry={() => refetch()}
          />
        </Container>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: widthAnim }]} />
      </View>
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onContentSizeChange={(_w, h) => setContentH(h)}
      >
        <Container narrow style={styles.article}>
          {/* Breadcrumb */}
          <View style={styles.crumbs}>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.crumb}>Beranda</Text>
            </Pressable>
            <Text style={styles.crumbSep}>/</Text>
            {!!article.category && (
              <>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: '/category/[slug]', params: { slug: article.category!.slug } })
                  }
                >
                  <Text style={styles.crumb}>{article.category.name}</Text>
                </Pressable>
                <Text style={styles.crumbSep}>/</Text>
              </>
            )}
            <Text style={styles.crumbCurrent} numberOfLines={1}>{article.title}</Text>
          </View>

          <CategoryBadge name={article.category?.name} />
          <Text style={styles.title}>{article.title}</Text>
          {!!article.excerpt && <Text style={styles.excerpt}>{article.excerpt}</Text>}

          <View style={styles.byline}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(article.author?.name ?? 'R').slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{article.author?.name ?? 'Redaksi KabarKode'}</Text>
              <ArticleMeta
                publishedAt={article.published_at}
                readingMinutes={estimateReadingMinutes(article.content)}
              />
            </View>
            <Text style={styles.type}>
              {article.article_type.toUpperCase()} // {formatDateId(article.published_at).split(' ')[1]?.toUpperCase() ?? ''}
            </Text>
          </View>

          <ArticleCover ratio={16 / 9} title={article.title} />

          <ArticleContent html={article.content} />

          {/* Sumber eksternal bila ada (§63) */}
          {article.source_name && (
            <Pressable
              style={styles.source}
              onPress={() => article.source_url && openExternal(article.source_url)}
              accessibilityRole="link"
            >
              <Text style={styles.sourceLabel}>SOURCE</Text>
              <Text style={styles.sourceName}>
                {article.source_name}
                {article.source_url ? ' ↗' : ''}
              </Text>
            </Pressable>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <View style={styles.tags}>
              {article.tags.map((t) => (
                <TagChip key={t.id} name={t.name} slug={t.slug} />
              ))}
            </View>
          )}
        </Container>

        {/* Related (§33) */}
        {!!related.data?.length && (
          <Container style={styles.related}>
            <SectionHeader title="Artikel Terkait" index="→" />
            <View style={styles.relatedGrid}>
              {related.data.map((a) => (
                <View key={a.id} style={styles.relatedItem}>
                  <ArticleCard article={a} />
                </View>
              ))}
            </View>
          </Container>
        )}
      </ScrollView>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    position: 'absolute',
    top: layout.headerHeight,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'transparent',
    zIndex: 60,
  },
  progressBar: {
    height: 2,
    backgroundColor: colors.accent,
  },
  article: { paddingTop: spacing.xl, gap: spacing.base },
  loading: { paddingTop: spacing['2xl'], gap: spacing.md },
  errorWrap: { paddingTop: spacing['3xl'] },
  crumbs: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  crumb: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
  crumbSep: { fontFamily: typography.families.mono, fontSize: 12, color: colors.border },
  crumbCurrent: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.black,
    flexShrink: 1,
  },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size['4xl'],
    fontWeight: '800',
    color: colors.black,
    lineHeight: 54,
    letterSpacing: -1.5,
  },
  excerpt: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    color: colors.textSecondary,
    lineHeight: 32,
  },
  byline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.families.sans,
    fontWeight: '800',
    color: colors.white,
    fontSize: 16,
  },
  authorName: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    fontWeight: '700',
    color: colors.black,
  },
  type: {
    marginLeft: 'auto',
    fontFamily: typography.families.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    padding: spacing.base,
    marginTop: spacing.base,
  },
  sourceLabel: {
    fontFamily: typography.families.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  sourceName: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.black,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  related: { marginTop: spacing['3xl'] },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  relatedItem: { flexBasis: '30%', flexGrow: 1, minWidth: 260 },
});
