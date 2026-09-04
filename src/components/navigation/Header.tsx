import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { colors, radii, spacing, typography, layout } from '@/theme';
import { Logo } from '@/components/common/Logo';
import { Container } from '@/components/layout/Container';
import { useBreakpoint, isDesktopBp } from '@/hooks/useBreakpoint';
import { useCategories } from '@/services/queries';

/**
 * Header sticky dengan border tipis (§13–14).
 * Desktop: logo + nav kategori utama + search. Mobile: logo + ☰ + 🔍.
 */
export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { bp } = useBreakpoint();
  const desktop = isDesktopBp(bp);
  const pathname = usePathname();
  const { data: categories = [] } = useCategories();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  React.useEffect(() => setDrawerOpen(false), [pathname]);

  // Nav utama: 5 kategori teratas (berdasarkan urutan backend), sisanya di halaman kategori.
  const primary = categories.slice(0, 5);

  return (
    <View style={styles.wrap}>
      <Container>
        <View style={styles.bar}>
          <Pressable
            onPress={() => router.push('/')}
            accessibilityRole="link"
            accessibilityLabel="KabarKode — Beranda"
          >
            <Logo size={34} showWordmark={desktop} />
          </Pressable>

          {desktop && (
            <View style={styles.nav}>
              <NavLink label="Beranda" href="/" active={pathname === '/'} />
              {primary.map((c) => (
                <NavLink
                  key={c.id}
                  label={c.name}
                  href={`/category/${c.slug}`}
                  active={pathname === `/category/${c.slug}`}
                />
              ))}
              <NavLink label="Semua" href="/categories" active={pathname === '/categories'} />
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onOpenSearch}
              style={[styles.searchBtn, !desktop && styles.searchBtnMobile]}
              accessibilityRole="button"
              accessibilityLabel="Cari berita"
            >
              {desktop ? (
                <>
                  <Ionicons name="search" size={15} color={colors.textSecondary} />
                  <Text style={styles.searchHint}>Cari berita…</Text>
                  <Text style={styles.kbd}>Ctrl K</Text>
                </>
              ) : (
                <Ionicons name="search" size={22} color={colors.black} />
              )}
            </Pressable>
            {!desktop && (
              <Pressable
                onPress={() => setDrawerOpen(true)}
                style={styles.menuBtn}
                accessibilityRole="button"
                accessibilityLabel="Buka menu navigasi"
              >
                <Ionicons name="menu" size={24} color={colors.black} />
              </Pressable>
            )}
          </View>
        </View>
      </Container>

      {/* Drawer mobile (§14) */}
      <Modal visible={drawerOpen} animationType="slide" onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.drawer}>
          <View style={styles.drawerHead}>
            <Logo size={30} showWordmark />
            <Pressable onPress={() => setDrawerOpen(false)} accessibilityLabel="Tutup menu">
              <Ionicons name="close" size={26} color={colors.white} />
            </Pressable>
          </View>
          <DrawerLink label="Beranda" onPress={() => router.push('/')} />
          {categories.map((c) => (
            <DrawerLink
              key={c.id}
              label={c.name}
              onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: c.slug } })}
            />
          ))}
          <DrawerLink label="Tentang" onPress={() => router.push('/about')} />
        </View>
      </Modal>
    </View>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Pressable
      onPress={() => router.push(href as never)}
      style={({ hovered }) => [styles.navItem, (active || hovered) && styles.navItemActive]}
      accessibilityRole="link"
    >
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
      {active && <View style={styles.activeBar} />}
    </Pressable>
  );
}

function DrawerLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.drawerLink}>
      <Text style={styles.drawerText}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    // 'sticky' didukung runtime react-native-web; tipe RN inti belum mengeksposenya.
    position: 'sticky' as unknown as 'relative',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(247,247,245,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bar: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  nav: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  navItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  navItemActive: {},
  navText: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  navTextActive: { color: colors.black },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: spacing.md,
    height: 2,
    backgroundColor: colors.accent,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    minWidth: 200,
  },
  searchHint: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  searchBtnMobile: { minWidth: 0, paddingHorizontal: spacing.sm },
  kbd: {
    fontFamily: typography.families.mono,
    fontSize: 10,
    color: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  menuBtn: { padding: spacing.sm },
  drawer: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  drawerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  drawerLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  drawerText: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.xl,
    fontWeight: '600',
    color: colors.white,
  },
});
