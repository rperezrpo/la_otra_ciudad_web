// Converts between Markdown (what editors type in the project form) and the
// Portable Text blocks stored in Sanity and rendered on the public site.
//
// Only the subset of formatting allowed by the project schema is supported:
//   styles:     normal, h2, h3
//   decorators: strong (bold), em (italic)
//   annotations: link
//   lists:      bullet
import { marked } from 'marked';

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type MarkDef = { _key: string; _type: 'link'; href: string };
type Block = {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: MarkDef[];
  children: Span[];
  listItem?: 'bullet';
  level?: number;
};

const uuid = () => crypto.randomUUID();
const span = (text: string, marks: string[]): Span => ({
  _type: 'span',
  _key: uuid(),
  text,
  marks: [...marks],
});

// ─── Markdown → Portable Text ────────────────────────────────────────────────

function walkInline(tokens: any[], marks: string[], markDefs: MarkDef[], out: Span[]) {
  for (const t of tokens) {
    switch (t.type) {
      case 'text':
      case 'escape':
        if (t.tokens) walkInline(t.tokens, marks, markDefs, out);
        else out.push(span(t.text ?? '', marks));
        break;
      case 'strong':
        walkInline(t.tokens, [...marks, 'strong'], markDefs, out);
        break;
      case 'em':
        walkInline(t.tokens, [...marks, 'em'], markDefs, out);
        break;
      case 'codespan':
        out.push(span(t.text ?? '', marks)); // no code decorator in schema
        break;
      case 'br':
        out.push(span('\n', marks));
        break;
      case 'link': {
        const markKey = uuid();
        markDefs.push({ _key: markKey, _type: 'link', href: t.href });
        walkInline(t.tokens, [...marks, markKey], markDefs, out);
        break;
      }
      default:
        if (t.tokens) walkInline(t.tokens, marks, markDefs, out);
        else if (t.text != null) out.push(span(t.text, marks));
    }
  }
}

function makeBlock(style: string, tokens: any[], listItem = false): Block {
  const markDefs: MarkDef[] = [];
  const children: Span[] = [];
  walkInline(tokens ?? [], [], markDefs, children);
  const block: Block = {
    _type: 'block',
    _key: uuid(),
    style,
    markDefs,
    children: children.length ? children : [span('', [])],
  };
  if (listItem) {
    block.listItem = 'bullet';
    block.level = 1;
  }
  return block;
}

function listItemInline(item: any): any[] {
  const out: any[] = [];
  for (const child of item.tokens ?? []) {
    if (child.type === 'text' || child.type === 'paragraph') {
      if (child.tokens) out.push(...child.tokens);
      else if (child.text != null) out.push({ type: 'text', text: child.text });
    }
  }
  if (!out.length && item.text != null) out.push({ type: 'text', text: item.text });
  return out;
}

export function markdownToPortableText(md: string): Block[] {
  if (!md || !md.trim()) return [];
  const tokens = marked.lexer(md);
  const blocks: Block[] = [];
  for (const tok of tokens as any[]) {
    switch (tok.type) {
      case 'heading':
        blocks.push(makeBlock(tok.depth === 3 ? 'h3' : 'h2', tok.tokens));
        break;
      case 'paragraph':
        blocks.push(makeBlock('normal', tok.tokens));
        break;
      case 'list':
        for (const item of tok.items ?? []) blocks.push(makeBlock('normal', listItemInline(item), true));
        break;
      case 'blockquote':
        for (const p of tok.tokens ?? []) if (p.tokens) blocks.push(makeBlock('normal', p.tokens));
        break;
      case 'code':
        blocks.push(makeBlock('normal', [{ type: 'text', text: tok.text }]));
        break;
      case 'space':
        break;
      default:
        if (tok.tokens) blocks.push(makeBlock('normal', tok.tokens));
    }
  }
  return blocks;
}

// ─── Portable Text → Markdown ────────────────────────────────────────────────

function spansToMarkdown(children: Span[], markDefs: MarkDef[]): string {
  const hrefByKey = Object.fromEntries(
    (markDefs ?? []).filter((m) => m._type === 'link').map((m) => [m._key, m.href])
  );
  let out = '';
  for (const s of children ?? []) {
    if (s._type !== 'span') continue;
    let text = s.text ?? '';
    const marks = s.marks ?? [];
    if (marks.includes('strong')) text = `**${text}**`;
    if (marks.includes('em')) text = `*${text}*`;
    for (const m of marks) if (hrefByKey[m]) text = `[${text}](${hrefByKey[m]})`;
    out += text;
  }
  return out;
}

export function portableTextToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  const textBlocks = blocks.filter((b) => b?._type === 'block');
  const lines = textBlocks.map((b) => {
    const text = spansToMarkdown(b.children ?? [], b.markDefs ?? []);
    if (b.listItem === 'bullet') return `- ${text}`;
    if (b.style === 'h2') return `## ${text}`;
    if (b.style === 'h3') return `### ${text}`;
    return text;
  });
  let result = '';
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      const bothBullets =
        textBlocks[i - 1].listItem === 'bullet' && textBlocks[i].listItem === 'bullet';
      result += bothBullets ? '\n' : '\n\n';
    }
    result += lines[i];
  }
  return result;
}
