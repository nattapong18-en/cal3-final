// ตรวจตัวสุ่มโจทย์: คำตอบถูกตรงกับอนุพันธ์เชิงตัวเลข, ตัวเลือกผิดต่างจากคำตอบจริง, และ LaTeX ทุกชิ้น render ได้
import katex from 'katex';
import { templates, cats } from '../src/drill/gen';

const texParts = (s: string) => [...s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => m[1] ?? m[2]);
const render = (tex: string) => katex.renderToString(tex, { throwOnError: true, strict: false });

let bad = 0, n = 0;
for (const cat of cats) for (const tpl of templates[cat]) for (let k = 0; k < 400; k++) {
  const p = tpl(); n++;
  const pts = [[0.7, 1.3], [1.4, 0.6], [1.9, 1.7], [0.55, 0.9]];
  const h = 1e-5;
  for (const [x, y] of pts) {
    const num = p.wrt === 'x' ? (p.f(x + h, y) - p.f(x - h, y)) / (2 * h) : (p.f(x, y + h) - p.f(x, y - h)) / (2 * h);
    const got = p.d(x, y);
    if (Math.abs(num - got) > 1e-4 * Math.max(1, Math.abs(num))) { bad++; console.log('WRONG d', cat, p.q, x, y, num, got); break; }
  }
  for (const w of p.wrongs) {
    const same = pts.every(([x, y]) => Math.abs(w.fn(x, y) - p.d(x, y)) < 1e-6 * Math.max(1, Math.abs(p.d(x, y))));
    if (same) { bad++; console.log('DISTRACTOR EQUALS ANSWER', cat, p.q, w.tex); }
  }
  const texs = [p.correct, ...p.wrongs.map((w) => w.tex)];
  if (new Set(texs).size !== texs.length) { bad++; console.log('DUP TEX', cat, texs); }
  try {
    [p.q, ...texs].forEach(render);
    p.steps.forEach((s) => texParts(s).forEach(render));
    p.wrongs.forEach((w) => texParts(w.why).forEach(render));
  } catch (e) { bad++; console.log('KATEX', cat, p.q, String(e).slice(0, 160)); }
}
console.log(`checked ${n} problems, problems found: ${bad}`);
process.exit(bad ? 1 : 0);
