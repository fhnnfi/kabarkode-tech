import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '@/theme';
import type { Article } from '@/types/api';
import { CategoryBadge } from '@/components/category/CategoryBadge';
import { ArticleMeta } from '@/components/article/ArticleMeta';
import { ArticleCover } from '@/components/media/ArticleCover';
import { estimateReadingMinutes } from '@/utils/reading';

/** Hero featured (§16): kartu besar dengan headline editorial. */
export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/article/[slug]', params: { slug: article.slug } })}
      style={({ hovered }) => [styles.wrap, hovered && { borderColor: colors.black }]}
      accessibilityRole="link"
      accessibilityLabel={`Artikel unggulan: ${article.title}`}
    >
      <ArticleCover ratio={16 / 9} title={article.title} />
      <View style={styles.body}>
        <View style={styles.kicker}>
          <View style={styles.accentLine} />
          <Text style={styles.kickerText}>FEATURED</Text>
        </View>
        <CategoryBadge name={article.category?.name} />
        <Text style={styles.title}>{article.title}</Text>
        {!!article.excerpt && (
          <Text style={styles.excerpt} numberOfLines={3}>{article.excerpt}</Text>
        )}
        <ArticleMeta
          authorName={article.author?.name}
          publishedAt={article.published_at}
          readingMinutes={estimateReadingMinutes(article.content)}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
    flex: 1,
  },
  body: { padding: spacing.xl, gap: spacing.md },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  accentLine: { width: 24, height: 2, backgroundColor: colors.accent },
  kickerText: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size['3xl'],
    fontWeight: '800',
    color: colors.black,
    lineHeight: 42,
    letterSpacing: -1,
  },
  excerpt: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    lineHeight: 28,
  },
});
