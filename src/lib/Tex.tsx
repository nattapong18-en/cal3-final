import katex from 'katex';
import { memo, useMemo } from 'react';

type Part = { kind: 'text' | 'inline' | 'display' | 'mark'; value: string };

function parse(src: string): Part[] {
  const parts: Part[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$|\*\*([\s\S]+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push({ kind: 'text', value: src.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ kind: 'display', value: m[1] });
    else if (m[2] !== undefined) parts.push({ kind: 'inline', value: m[2] });
    else parts.push({ kind: 'mark', value: m[3] });
    last = re.lastIndex;
  }
  if (last < src.length) parts.push({ kind: 'text', value: src.slice(last) });
  return parts;
}

const cache = new Map<string, string>();
function render(tex: string, display: boolean) {
  const key = (display ? 'D' : 'I') + tex;
  let html = cache.get(key);
  if (!html) {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false });
    cache.set(key, html);
  }
  return html;
}

function Inner({ src }: { src: string }) {
  const parts = useMemo(() => parse(src), [src]);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'text') return <span key={i}>{p.value}</span>;
        if (p.kind === 'mark') return <mark key={i}><Inner src={p.value} /></mark>;
        if (p.kind === 'display')
          return <span key={i} className="tex-display" dangerouslySetInnerHTML={{ __html: render(p.value, true) }} />;
        return <span key={i} dangerouslySetInnerHTML={{ __html: render(p.value, false) }} />;
      })}
    </>
  );
}

export const Tex = memo(function Tex({ src, as: As = 'div', className }: { src: string; as?: 'div' | 'span' | 'p' | 'li'; className?: string }) {
  return (
    <As className={className}>
      <Inner src={src} />
    </As>
  );
});
