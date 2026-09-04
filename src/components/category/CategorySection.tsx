import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import type { Category } from '@/types/api';
import { useArticles } from '@/services/queries';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ArticleCard } from '@/components/article/ArticleCard';
import { ArticleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/States';

/**
 * Section kategori reusable di homepage (§21): 1 artikel utama + 3 pendukung.
 * Data-driven — tidak ada komponen terpisah per kategori.
 * Kegagalan satu section tidak merobohkan halaman (§77): tampilkan error kecil.
 */
export function CategorySection({ category }: { category: Category }) {
  const { data, isError, refetch } = useArticles({
    category: category.slug,
    page: 1,
    limit: 4,
  });

  return (
    <View>
      <SectionHeader
        title={category.name}
        viewAllHref={{ pathname: '/category/[slug]', params: { slug: category.slug } } as never}
      />
      {isError ? (
        <ErrorState
          message="Bagian ini gagal dimuat."
          onRetry={() => refetch()}
        />
      ) : !data ? (
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.gridItem}>
              <ArticleCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.grid}>
          {data.articles.map((a) => (
            <View key={a.id} style={styles.gridItem}>
              <ArticleCard article={a} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  // Pembatas lebar kartu: tanpa flexBasis/maxWidth, kartu membesar mengikuti
  // ukuran intrinsik gambar cover sehingga satu card bisa sebaris penuh.
  gridItem: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 260,
    maxWidth: 420,
  },
});
