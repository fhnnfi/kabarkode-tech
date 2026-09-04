import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '@/theme';
import type { Article } from '@/types/api';
import { CategoryBadge } from '@/components/category/CategoryBadge';
import { ArticleMeta } from '@/components/article/ArticleMeta';
import { ArticleCover } from '@/components/media/ArticleCover';
import { estimateReadingMinutes } from '@/utils/reading';

/**
 * Kartu artikel reusable (§18). Hirarki: image > headline > category > metadata.
 * Varian: 'grid' (kartu vertikal), 'row' (list horizontal utk Latest), 'compact'.
 */
export function ArticleCard({
  article,
  variant = 'grid',
}: {
  article: Article;
  variant?: 'grid' | 'row' | 'compact';
}) {
  const open = () => router.push({ pathname: '/article/[slug]', params: { slug: article.slug } });
  const minutes = estimateReadingMinutes(article.content);

  if (variant === 'compact') {
    return (
      <Pressable
        onPress={open}
        style={({ hovered }) => [styles.compact, hovered && { backgroundColor: colors.white }]}
        accessibilityRole="link"
        accessibilityLabel={article.title}
      >
        <Text style={styles.compactIndex}>
          {String(article.article_type === 'news' ? 'N' : article.article_type[0]?.toUpperCase() ?? 'A')}
        </Text>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.compactTitle} numberOfLines={2}>{article.title}</Text>
          <ArticleMeta
            authorName={article.author?.name}
            publishedAt={article.published_at}
          />
        </View>
      </Pressable>
    );
  }

  if (variant === 'row') {
    return (
      <Pressable
        onPress={open}
        style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
        accessibilityRole="link"
        accessibilityLabel={article.title}
      >
        <View style={styles.rowCover}>
          <ArticleCover mediaId={article.cover_media_id} ratio={4 / 3} compact title={article.title} />
        </View>
        <View style={styles.rowBody}>
          <CategoryBadge name={article.category?.name} />
          <Text style={styles.rowTitle} numberOfLines={3}>{article.title}</Text>
          {!!article.excerpt && (
            <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
          )}
          <ArticleMeta
            authorName={article.author?.name}
            publishedAt={article.published_at}
            readingMinutes={minutes}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={open}
      style={({ hovered }) => [styles.card, hovered && styles.rowHover]}
      accessibilityRole="link"
      accessibilityLabel={article.title}
    >
      <ArticleCover mediaId={article.cover_media_id} ratio={16 / 9} compact title={article.title} />
      <View style={styles.cardBody}>
        <CategoryBadge name={article.category?.name} />
        <Text style={styles.cardTitle} numberOfLines={3}>{article.title}</Text>
        {!!article.excerpt && (
          <Text style={styles.excerpt} numberOfLines={3}>{article.excerpt}</Text>
        )}
        <ArticleMeta
          authorName={article.author?.name}
          publishedAt={article.published_at}
          readingMinutes={minutes}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  cardBody: { padding: spacing.base, gap: spacing.sm },
  cardTitle: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  rowHover: { borderColor: colors.black },
  rowCover: { width: 140, flexShrink: 0 },
  rowBody: { flex: 1, gap: 6 },
  rowTitle: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.base,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  excerpt: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  compact: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  compactIndex: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
    width: 20,
    paddingTop: 3,
  },
  compactTitle: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.black,
    lineHeight: 20,
  },
});
