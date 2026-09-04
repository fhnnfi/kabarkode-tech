import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';

/** Empty state ramah (§43). */
export function EmptyState({
  title = 'Belum ada artikel.',
  subtitle = 'Kabar terbaru akan muncul di sini.',
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{'</>'}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

/** Error state — pesan mentah API tidak pernah ditampilkan (§44). */
export function ErrorState({
  message = 'KabarKode sedang mengalami masalah saat mengambil berita.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="cloud-offline-outline" size={36} color={colors.textSecondary} />
      <Text style={styles.title}>Terjadi kesalahan</Text>
      <Text style={styles.subtitle}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ hovered }) => [styles.retry, hovered && { backgroundColor: colors.black }]}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontFamily: typography.families.mono,
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 21,
  },
  retry: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  retryText: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.black,
  },
});
