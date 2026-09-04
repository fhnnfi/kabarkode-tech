import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/theme';
import { parseArticleHtml, inlineToText, type BlockNode, type InlineNode } from '@/utils/html';
import { openExternal } from '@/platform/web/seo';

/**
 * Renderer konten artikel (§25–26). Backend mengirim HTML bersih hasil
 * sanitasi server (keluaran Tiptap) — TIDAK ada dangerouslySetInnerHTML;
 * HTML diparse ke struktur lalu dirender dengan primitif RN.
 */
export function ArticleContent({ html }: { html: string }) {
  const blocks = React.useMemo(() => parseArticleHtml(html), [html]);
  return <View style={styles.root}>{blocks.map(renderBlock)}</View>;
}

function renderBlock(block: BlockNode, i: number): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock key={i} level={block.level} nodes={block.children} />;
    case 'paragraph':
      return (
        <Text key={i} style={styles.p}>
          {renderInline(block.children)}
        </Text>
      );
    case 'code':
      return <CodeBlock key={i} language={block.language} text={block.text} />;
    case 'quote':
      return (
        <View key={i} style={styles.quote}>
          <View style={styles.quoteBar} />
          <Text style={styles.quoteText}>{renderInline(block.children)}</Text>
        </View>
      );
    case 'list':
      return (
        <View key={i} style={styles.list}>
          {block.items.map((item, j) => (
            <View key={j} style={styles.listItem}>
              <Text style={styles.listBullet}>
                {block.ordered ? `${j + 1}.` : '—'}
              </Text>
              <Text style={styles.p}>{renderInline(item)}</Text>
            </View>
          ))}
        </View>
      );
    case 'image':
      return (
        <View key={i} style={styles.imgWrap}>
          <Image
            source={{ uri: block.src }}
            style={styles.img}
            contentFit="cover"
            transition={200}
            accessibilityLabel={block.alt || undefined}
          />
          {!!block.alt && <Text style={styles.caption}>{block.alt}</Text>}
        </View>
      );
    case 'divider':
      return <View key={i} style={styles.hr} />;
    case 'table':
      return <TableBlock key={i} rows={block.rows} />;
  }
}

function HeadingBlock({ level, nodes }: { level: number; nodes: InlineNode[] }) {
  const size =
    level <= 2 ? typography.size['2xl'] : level === 3 ? typography.size.xl : typography.size.lg;
  return (
    <Text style={[styles.h, { fontSize: size, marginTop: level <= 2 ? spacing.xl : spacing.lg }]}>
      {renderInline(nodes)}
    </Text>
  );
}

function renderInline(nodes: InlineNode[]): React.ReactNode {
  return nodes.map((n, i) => {
    switch (n.type) {
      case 'text':
        return <React.Fragment key={i}>{n.text}</React.Fragment>;
      case 'bold':
        return <Text key={i} style={{ fontWeight: '700' }}>{renderInline(n.children)}</Text>;
      case 'italic':
        return <Text key={i} style={{ fontStyle: 'italic' }}>{renderInline(n.children)}</Text>;
      case 'underline':
        return <Text key={i} style={{ textDecorationLine: 'underline' }}>{renderInline(n.children)}</Text>;
      case 'strike':
        return <Text key={i} style={{ textDecorationLine: 'line-through' }}>{renderInline(n.children)}</Text>;
      case 'mark':
        return <Text key={i} style={{ backgroundColor: colors.accentSoft }}>{renderInline(n.children)}</Text>;
      case 'inlineCode':
        return <Text key={i} style={styles.inlineCode}>{n.text}</Text>;
      case 'link':
        return (
          <Text
            key={i}
            style={styles.link}
            onPress={() => n.href && openExternal(n.href)}
            suppressHighlighting
          >
            {renderInline(n.children)}
          </Text>
        );
    }
  });
}

/** Code block: label bahasa + tombol copy, horizontal scroll (§26). */
function CodeBlock({ language, text }: { language: string | null; text: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  }, [text]);

  return (
    <View style={styles.codeWrap}>
      <View style={styles.codeHead}>
        <Text style={styles.codeLang}>{(language ?? 'text').toUpperCase()}</Text>
        <Pressable onPress={copy} accessibilityRole="button" accessibilityLabel="Salin kode">
          <Text style={styles.codeCopy}>
            {copied ? 'TERSALIN ✓' : 'COPY'}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.codeText}>{text}</Text>
      </ScrollView>
    </View>
  );
}

function TableBlock({ rows }: { rows: string[][][] }) {
  if (!rows.length) return null;
  const [head, ...body] = rows;
  return (
    <View style={styles.table}>
      <View style={[styles.tr, styles.thead]}>
        {head.map((cell, j) => (
          <Text key={j} style={styles.th}>{cell.join(' ')}</Text>
        ))}
      </View>
      {body.map((r, i) => (
        <View key={i} style={styles.tr}>
          {r.map((cell, j) => (
            <Text key={j} style={styles.td}>{cell.join(' ')}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  p: {
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    lineHeight: 30,
    color: colors.black,
  },
  h: {
    fontFamily: typography.families.sans,
    fontWeight: '800',
    color: colors.black,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  inlineCode: {
    fontFamily: typography.families.mono,
    fontSize: 14,
    backgroundColor: colors.skeleton,
    color: colors.black,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  link: {
    color: colors.black,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  quote: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  quoteBar: { width: 3, backgroundColor: colors.accent, borderRadius: 2 },
  quoteText: {
    flex: 1,
    fontFamily: typography.families.sans,
    fontSize: typography.size.lg,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: 29,
  },
  list: { gap: spacing.sm, marginVertical: spacing.sm },
  listItem: { flexDirection: 'row', gap: spacing.sm },
  listBullet: {
    fontFamily: typography.families.mono,
    fontSize: 14,
    color: colors.textSecondary,
    width: 24,
    lineHeight: 30,
  },
  imgWrap: { marginVertical: spacing.base },
  img: { width: '100%', aspectRatio: 16 / 9, borderRadius: radii.md, backgroundColor: colors.skeleton },
  caption: {
    fontFamily: typography.families.mono,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  hr: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  codeWrap: {
    backgroundColor: colors.codeBg,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginVertical: spacing.base,
  },
  codeHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  codeLang: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.accent,
    fontWeight: '700',
  },
  codeCopy: {
    fontFamily: typography.families.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  codeText: {
    fontFamily: typography.families.mono,
    fontSize: 13.5,
    lineHeight: 22,
    color: colors.codeFg,
    padding: spacing.base,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginVertical: spacing.base,
  },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  thead: { backgroundColor: colors.bg },
  th: {
    flex: 1,
    fontFamily: typography.families.sans,
    fontWeight: '700',
    fontSize: 14,
    padding: spacing.md,
    color: colors.black,
  },
  td: {
    flex: 1,
    fontFamily: typography.families.sans,
    fontSize: 14,
    padding: spacing.md,
    color: colors.black,
  },
});
