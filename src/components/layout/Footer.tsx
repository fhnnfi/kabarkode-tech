import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { Logo } from '@/components/common/Logo';
import { Container } from '@/components/layout/Container';
import { Label } from '@/components/common/Label';
import { useCategories } from '@/services/queries';
import { SITE_TAGLINE } from '@/constants/config';

/** Footer editorial minimal (§58). */
export function Footer() {
  const { data: categories = [] } = useCategories();
  const year = new Date().getFullYear();

  return (
    <View style={styles.wrap}>
      <Container>
        <View style={styles.grid}>
          <View style={styles.brand}>
            <Logo size={34} inverted showWordmark />
            <Text style={styles.tagline}>{SITE_TAGLINE}</Text>
          </View>

          <View style={styles.col}>
            <Label color={colors.white}>NAVIGASI</Label>
            <FooterLink label="Beranda" onPress={() => router.push('/')} />
            <FooterLink label="Kategori" onPress={() => router.push('/categories')} />
            <FooterLink label="Pencarian" onPress={() => router.push('/search')} />
            <FooterLink label="Tentang" onPress={() => router.push('/about')} />
          </View>

          <View style={styles.col}>
            <Label color={colors.white}>KATEGORI</Label>
            {categories.slice(0, 6).map((c) => (
              <FooterLink
                key={c.id}
                label={c.name}
                onPress={() =>
                  router.push({ pathname: '/category/[slug]', params: { slug: c.slug } })
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.copy}>© {year} KabarKode</Text>
          <Text style={styles.mono}>K{'</>'} TECH // ID</Text>
        </View>
      </Container>
    </View>
  );
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.link}
      accessibilityRole="link"
    >
      {({ hovered }) => (
        <Text style={[styles.linkText, hovered && { color: colors.accent }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.black,
    marginTop: spacing['3xl'],
    paddingTop: spacing['2xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2xl'],
    justifyContent: 'space-between',
  },
  brand: { maxWidth: 320, gap: spacing.md, flex: 1 },
  tagline: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  col: { gap: spacing.sm, minWidth: 140 },
  hover: {},
  link: {
    paddingVertical: 4,
  },
  linkText: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  linkHover: { color: colors.accent },
  bottom: {
    marginTop: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingVertical: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  mono: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.35)',
  },
});
