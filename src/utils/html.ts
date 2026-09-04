/**
 * Parser HTML minimal untuk konten artikel yang sudah disanitasi backend.
 * Allowlist backend (src/utils/sanitize.ts): p, br, hr, h1-h6, strong, b, em, i, u, s,
 * strike, mark, code, pre, blockquote, ul, ol, li, a, img, table, thead, tbody, tr, th, td.
 *
 * Kami TIDAK menyuntikkan HTML mentah ke DOM — struktur diubah menjadi node RN,
 * sehingga aman dan tetap jalan di native nanti.
 */

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: InlineNode[] }
  | { type: 'italic'; children: InlineNode[] }
  | { type: 'underline'; children: InlineNode[] }
  | { type: 'strike'; children: InlineNode[] }
  | { type: 'mark'; children: InlineNode[] }
  | { type: 'inlineCode'; text: string }
  | { type: 'link'; href: string; children: InlineNode[] };

export type BlockNode =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'code'; language: string | null; text: string }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'divider' }
  | { type: 'table'; rows: string[][][]; header: string[][] | null };

const VOID_TAGS = new Set(['br', 'hr', 'img']);

interface RawTag {
  kind: 'open' | 'close' | 'void';
  name: string;
  attrs: Record<string, string>;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

/** Tokenisasi tag; teks di antara tag keluar sebagai { text }. */
function tokenize(html: string): Array<RawTag | { text: string }> {
  const out: Array<RawTag | { text: string }> = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[4] !== undefined) {
      const text = decodeEntities(m[4]);
      if (text) out.push({ text });
      continue;
    }
    const full = m[0];
    const name = m[1].toLowerCase();
    const attrStr = m[2] ?? '';
    const selfClosed = m[3] === '/';
    const kind: RawTag['kind'] = full.startsWith('</')
      ? 'close'
      : VOID_TAGS.has(name) || selfClosed
        ? 'void'
        : 'open';
    const attrs: Record<string, string> = {};
    const ar = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let am: RegExpExecArray | null;
    while ((am = ar.exec(attrStr))) {
      attrs[am[1].toLowerCase()] = decodeEntities(am[2] ?? am[3] ?? am[4] ?? '');
    }
    out.push({ kind, name, attrs });
  }
  return out;
}

interface Ctx {
  inline: InlineNode[];
  blocks: BlockNode[];
}

const INLINE_WRAPPERS: Record<string, InlineNode['type']> = {
  strong: 'bold',
  b: 'bold',
  em: 'italic',
  i: 'italic',
  u: 'underline',
  s: 'strike',
  strike: 'strike',
  mark: 'mark',
};

/** Render recursive sederhana: kumpulkan inline, lalu blok. */
export function parseArticleHtml(html: string): BlockNode[] {
  const tokens = tokenize(html);
  const blocks: BlockNode[] = [];
  let inlineStack: InlineNode[][] = [[]];
  const hrefStack: string[] = [];
  let currentList: { type: 'list'; ordered: boolean; items: InlineNode[][] } | null = null;
  let inPre = false;
  let preText = '';
  let preLang: string | null = null;
  let inQuote = false;
  let quoteInline: InlineNode[] = [];
  let headingLevel: number | null = null;
  let tableRows: string[][][] | null = null;
  let tableHeader: string[][] | null = null;
  let row: string[][] | null = null;

  const top = () => inlineStack[inlineStack.length - 1];
  const pushText = (t: string) => {
    if (t) top().push({ type: 'text', text: t });
  };

  const flushInlineBlock = () => {
    const nodes = top();
    if (!nodes.length) return;
    if (headingLevel) {
      blocks.push({ type: 'heading', level: headingLevel as 1, children: nodes });
      headingLevel = null;
    } else if (inQuote) {
      blocks.push({ type: 'quote', children: nodes });
    } else {
      blocks.push({ type: 'paragraph', children: nodes });
    }
    inlineStack = [[]];
  };

  for (const tok of tokens) {
    if ('text' in tok) {
      if (inPre) {
        preText += tok.text;
      } else if (tableRows && row) {
        // sel tabel: kumpulkan teks
        const cell = row[row.length - 1];
        if (cell) cell.push(tok.text);
        else row.push([tok.text]);
      } else {
        pushText(tok.text);
      }
      continue;
    }

    const { kind, name, attrs } = tok;

    if (kind === 'open') {
      switch (name) {
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
          flushInlineBlock();
          headingLevel = Number(name[1]);
          break;
        case 'p':
          flushInlineBlock();
          break;
        case 'blockquote':
          flushInlineBlock();
          inQuote = true;
          break;
        case 'pre':
          flushInlineBlock();
          inPre = true;
          preText = '';
          preLang = null;
          break;
        case 'code': {
          const cls = attrs.class ?? '';
          const langMatch = cls.match(/language-([\w+#-]+)/);
          if (inPre && langMatch) preLang = langMatch[1];
          if (!inPre) inlineStack.push([]);
          break;
        }
        case 'ul': case 'ol':
          flushInlineBlock();
          if (currentList) {
            blocks.push(currentList);
            currentList = null;
          }
          currentList = { type: 'list', ordered: name === 'ol', items: [] };
          break;
        case 'li':
          flushInlineBlock();
          if (currentList) currentList.items.push([]);
          inlineStack.push([]);
          break;
        case 'a':
          hrefStack.push(attrs.href ?? '');
          inlineStack.push([]);
          break;
        case 'img':
          flushInlineBlock();
          if (attrs.src) blocks.push({ type: 'image', src: attrs.src, alt: attrs.alt ?? '' });
          break;
        case 'hr':
          flushInlineBlock();
          blocks.push({ type: 'divider' });
          break;
        case 'table':
          flushInlineBlock();
          tableRows = [];
          tableHeader = null;
          break;
        case 'thead': case 'tbody':
          break;
        case 'tr':
          row = [];
          break;
        case 'td': case 'th':
          if (row) row.push([]);
          break;
        default:
          if (INLINE_WRAPPERS[name]) inlineStack.push([]);
      }
      continue;
    }

    if (kind === 'close') {
      switch (name) {
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
          flushInlineBlock();
          break;
        case 'p':
          flushInlineBlock();
          break;
        case 'blockquote':
          flushInlineBlock();
          inQuote = false;
          break;
        case 'pre':
          blocks.push({ type: 'code', language: preLang, text: preText.replace(/\n$/, '') });
          inPre = false;
          preText = '';
          break;
        case 'code': {
          if (!inPre) {
            const inner = inlineStack.pop() ?? [];
            const text = inlineToText(inner);
            top().push({ type: 'inlineCode', text });
          }
          break;
        }
        case 'ul': case 'ol':
          if (currentList) {
            blocks.push(currentList);
            currentList = null;
          }
          break;
        case 'li': {
          const nodes = inlineStack.pop() ?? [];
          if (currentList && currentList.items.length) {
            currentList.items[currentList.items.length - 1] = nodes;
          }
          break;
        }
        case 'a': {
          const nodes = inlineStack.pop() ?? [];
          const href = hrefStack.pop() ?? '';
          top().push({ type: 'link', href, children: nodes });
          break;
        }
        case 'tr':
          if (row && tableRows) {
            tableRows.push(row.map((cell) => cell));
          }
          row = null;
          break;
        case 'td': case 'th':
          break;
        case 'table':
          if (tableRows) {
            blocks.push({ type: 'table', rows: tableRows, header: tableHeader });
            tableRows = null;
            tableHeader = null;
          }
          break;
        default:
          if (INLINE_WRAPPERS[name]) {
            const inner = inlineStack.pop() ?? [];
            top().push({ type: INLINE_WRAPPERS[name], children: inner } as InlineNode);
          }
      }
      continue;
    }

    // void
    if (kind === 'void') {
      if (name === 'br') pushText('\n');
      if (name === 'hr') { flushInlineBlock(); blocks.push({ type: 'divider' }); }
      if (name === 'img' && attrs.src) { flushInlineBlock(); blocks.push({ type: 'image', src: attrs.src, alt: attrs.alt ?? '' }); }
    }
  }
  flushInlineBlock();
  if (currentList) blocks.push(currentList);
  return blocks;
}

// href link ditangani via hrefStack di dalam parse.

export function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text' || n.type === 'inlineCode') return n.text;
      if (n.type === 'link') return inlineToText(n.children);
      return inlineToText((n as { children: InlineNode[] }).children);
    })
    .join('');
}
