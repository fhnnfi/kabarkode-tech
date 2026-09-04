import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { SiteShell } from '@/components/layout/SiteShell';
import { Container } from '@/components/layout/Container';
import { Label } from '@/components/common/Label';
import { usePageHead, canonicalUrl } from '@/hooks/usePageHead';
import { SITE_NAME, SITE_TAGLINE } from '@/constants/config';

/** Halaman tentang — konten statis brand, bukan data artikel (§62: tidak mengarang data). */
export default function AboutPage() {
  usePageHead({
    title: `Tentang — ${SITE_NAME}`,
    description: SITE_TAGLINE,
    canonical: canonicalUrl('/about'),
  });

  return (
    <SiteShell>
      <Container narrow style={styles.wrap}>
        <Label>TENTANG //</Label>
        <Text style={styles.title}>{SITE_NAME}</Text>
        <Text style={styles.lead}>{SITE_TAGLINE}</Text>

        <View style={styles.block}>
          <Text style={styles.h}>Untuk Siapa?</Text>
          <Text style={styles.p}>
            KabarKode ditulis untuk software engineer, web dan mobile developer, mahasiswa
            yang belajar pemrograman, praktisi IT, DevOps, security researcher, developer AI,
            dan pegiat open source di Indonesia.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.h}>Apa yang Kami Liput?</Text>
          <View style={styles.topics}>
            {['Software Engineering', 'Programming', 'Developer Tools', 'Framework & Library', 'AI', 'Cybersecurity', 'Open Source', 'Technology Releases'].map((t) => (
              <View key={t} style={styles.topic}>
                <Text style={styles.topicText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.h}>Identitas</Text>
          <Text style={styles.p}>
            Logo K{'</>'} adalah singkatan dari Kabar + Kode: kotak hitam melambangkan sistem
            dan platform tempat berita teknologi beredar.
          </Text>
        </View>
      </Container>
    </SiteShell>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing['2xl'], gap: spacing.md },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size['4xl'],
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.black,
  },
  lead: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    color: colors.textSecondary,
    lineHeight: 32,
  },
  block: { marginTop: spacing.xl, gap: spacing.md },
  h: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    fontWeight: '800',
    color: colors.black,
  },
  p: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.base,
    color: colors.black,
    lineHeight: 27,
  },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  topic: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  topicText: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.black,
  },
});
