import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Label } from '@/components/common/Label';
import { useCategories, useTags } from '@/services/queries';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { TagChip } from '@/components/common/TagChip';

/** Index semua kategori + tag (menu "More" §13). */
export default function CategoriesPage() {
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const { data: tags = [] } = useTags();

  usePageHead({
    title: 'Kategori — KabarKode',
    description: 'Jelajahi semua topik teknologi di KabarKode.',
    canonical: canonicalUrl('/categories'),
  });

  return (
    <SiteShell>
      <Container style={styles.head}>
        <Label>INDEKS //</Label>
        <Text style={styles.title}>Semua Kategori</Text>
      </Container>

      <Container>
        {loadingCats ? (
          <Text style={styles.loading}>Memuat kategori…</Text>
        ) : (
          <View style={styles.grid}>
            {categories.map((c, i) => (
              <Pressable
                key={c.id}
                onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: c.slug } })}
                style={({ hovered }) => [styles.card, hovered && styles.cardHover]}
                accessibilityRole="link"
              >
                <Text style={styles.cardIndex}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={styles.cardName}>{c.name}</Text>
                {!!c.description && <Text style={styles.cardDesc}>{c.description}</Text>}
                <Text style={styles.cardGo}>JELAJAHI →</Text>
              </Pressable>
            ))}
          </View>
        )}

        {tags.length > 0 && (
          <View style={{ marginTop: spacing['3xl'] }}>
            <SectionHeader title="Tag Populer" index="#" />
            <View style={styles.tagWrap}>
              {tags.slice(0, 30).map((t) => (
                <TagChip key={t.id} name={t.name} slug={t.slug} />
              ))}
            </View>
          </View>
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
  loading: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  card: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 280,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHover: { borderColor: colors.black },
  cardIndex: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  cardName: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: -0.5,
  },
  cardDesc: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  cardGo: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.black,
    marginTop: spacing.sm,
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
