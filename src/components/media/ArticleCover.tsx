import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii, typography } from '@/theme';
import { Logo } from '@/components/common/Logo';
import { useMedia } from '@/services/queries';

/**
 * Area cover artikel. Bila ada `mediaId`, URL di-resolve via
 * GET /media/:id (kini publik di backend) dan digambar dengan expo-image
 * (lazy + fade). Tanpa cover / gagal muat: fallback brand K</> (§61).
 */
export function ArticleCover({
  mediaId,
  ratio = 16 / 9,
  compact = false,
  title,
}: {
  mediaId?: string | null;
  ratio?: number;
  compact?: boolean;
  title?: string;
}) {
  const { data: media } = useMedia(mediaId);
  const [failed, setFailed] = React.useState(false);
  const uri = media?.public_url && !failed ? media.public_url : null;

  if (uri) {
    return (
      <View style={[styles.wrap, { aspectRatio: ratio }]} accessibilityLabel={`Sampul: ${title ?? ''}`}>
        <Image
          source={{ uri }}
          style={styles.img}
          contentFit="cover"
          transition={250}
          recyclingKey={uri}
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.wrap, { aspectRatio: ratio }]}
      accessibilityLabel={title ? `Sampul artikel: ${title}` : 'Sampul KabarKode'}
    >
      <Logo size={compact ? 28 : 44} />
      {!compact && <Text style={styles.word}>KABARKODE</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  word: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 4,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
