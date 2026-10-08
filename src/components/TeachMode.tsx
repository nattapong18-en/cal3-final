import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tex } from '../lib/Tex';
import type { Palette } from '../lib/hooks';
import { mock, topics, type Practice, type Topic } from '../data/topics';
import { Answer, Figure, StepItem, ease } from './Parts';
import { ruleGroups, type RuleGroup } from '../data/formulas';

type Slide =
  | { kind: 'cover' }
  | { kind: 'topic'; topic: Topic }
  | { kind: 'rules'; g: RuleGroup }
  | { kind: 'concept'; topic: Topic }
  | { kind: 'recipe'; topic: Topic }
  | { kind: 'example'; topic: Topic; i: number }
  | { kind: 'traps'; topic: Topic }
  | { kind: 'practice'; topic?: Topic; p: Practice; label: string }
  | { kind: 'end' };

export function buildDeck(): { slides: Slide[]; starts: Record<string, number> } {
  const slides: Slide[] = [{ kind: 'cover' }];
  const starts: Record<string, number> = {};
  starts.rules = slides.length;
  ruleGroups.forEach((g) => slides.push({ kind: 'rules', g }));
  topics.forEach((topic) => {
    starts[topic.id] = slides.length;
    slides.push({ kind: 'topic', topic }, { kind: 'concept', topic }, { kind: 'recipe', topic });
    topic.examples.forEach((_, i) => slides.push({ kind: 'example', topic, i }));
    slides.push({ kind: 'traps', topic });
    topic.practice.forEach((p, i) => slides.push({ kind: 'practice', topic, p, label: `แบบฝึก ${topic.num}.${i + 1}` }));
  });
  starts.mock = slides.length;
  mock.forEach((p) => slides.push({ kind: 'practice', p, label: `ข้อสอบจำลอง ${p.src}` }));
  slides.push({ kind: 'end' });
  return { slides, starts };
}

function fragCount(s: Slide) {
  switch (s.kind) {
    case 'rules': return s.g.rules.length - 1;
    case 'concept': return s.topic.concept.points.length;
    case 'recipe': return s.topic.recipe.length - 1;
    case 'example': return s.topic.examples[s.i].steps.length;
    case 'traps': return s.topic.traps.length - 1;
    case 'practice': return (s.p.hint ? 1 : 0) + s.p.sol.length;
    default: return 0;
  }
}

function labelOf(s: Slide) {
  switch (s.kind) {
    case 'cover': return 'หน้าแรก';
    case 'end': return 'จบ';
    case 'practice': return s.label;
    case 'topic': return `ข้อ ${s.topic.num} · ${s.topic.title}`;
    case 'rules': return `สูตรการดิฟ · ${s.g.title}`;
    case 'recipe': return `ข้อ ${s.topic.num} · วิธีทำ`;
    case 'concept': return `ข้อ ${s.topic.num} · ${s.topic.concept.eyebrow}`;
    case 'example': return `ข้อ ${s.topic.num} · ${s.topic.examples[s.i].src}`;
    case 'traps': return `ข้อ ${s.topic.num} · จุดที่มักพลาด`;
  }
}

const frag = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease } };

function SlideBody({ s, f, p }: { s: Slide; f: number; p: Palette }) {
  switch (s.kind) {
    case 'cover':
      return (
        <div className="d-cover">
          <motion.span className="eyebrow" {...frag}>31100222 Math 3 · ปลายภาค 2568</motion.span>
          <motion.h1 {...frag} transition={{ ...frag.transition, delay: 0.08 }}>ติวแคล 3 <span className="u">ปลายภาค</span></motion.h1>
          <div className="d-map">
            {topics.map((t, i) => (
              <motion.div key={t.id} className="d-map-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease }}>
                <span className="topic-num sm">{t.num}</span>{t.title}
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'end':
      return (
        <div className="d-cover">
          <motion.h1 {...frag}>พร้อมสอบแล้ว</motion.h1>
          <motion.p className="lead" {...frag} transition={{ ...frag.transition, delay: 0.1 }}>ทบทวนข้อที่ยังไม่มั่นใจอีกรอบ แล้วนอนให้พอ</motion.p>
        </div>
      );
    case 'topic':
      return (
        <div className="d-topic">
          <div className="d-topic-text">
            <motion.span className="d-bignum" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>{s.topic.num}</motion.span>
            <motion.h2 {...frag} transition={{ ...frag.transition, delay: 0.1 }}>{s.topic.title}</motion.h2>
            <motion.p className="muted" {...frag} transition={{ ...frag.transition, delay: 0.18 }}>{s.topic.figureHint}</motion.p>
          </div>
          <motion.div className="d-figure" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.55, ease }}>
            <Figure kind={s.topic.figure} p={p} />
          </motion.div>
        </div>
      );
    case 'rules':
      return (
        <div className="d-col">
          <span className="eyebrow blue">สูตรการดิฟ · {s.g.title}</span>
          <p className="d-note muted">{s.g.note}</p>
          <div className="d-rules">
            {s.g.rules.slice(0, f + 1).map((r) => (
              <motion.div key={r.name} className="rule" {...frag}>
                <span className="rule-name">{r.name}</span>
                <Tex className="rule-f" src={`$$${r.rule}$$`} />
                <div className="rule-ex"><span className="rule-ex-lbl">ใช้กับอนุพันธ์ย่อย</span><Tex src={`$${r.partial}$`} /></div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'recipe':
      return (
        <div className="d-col">
          <span className="eyebrow green">ข้อ {s.topic.num} · วิธีทำ {s.topic.recipe.length} ขั้น</span>
          <h2 className="d-h">{s.topic.title}</h2>
          <ol className="recipe-list">
            {s.topic.recipe.slice(0, f + 1).map((r, i) => (
              <motion.li key={i} {...frag}><span className="recipe-n">{i + 1}</span><Tex src={r} /></motion.li>
            ))}
          </ol>
        </div>
      );
    case 'concept':
      return (
        <div className="d-col">
          <span className="eyebrow blue">ข้อ {s.topic.num} · {s.topic.concept.eyebrow}</span>
          <Tex className="lead" src={s.topic.concept.lead} />
          {s.topic.concept.formulas.map((x, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.12, duration: 0.45, ease }}>
              <Tex className="formula" src={x} />
            </motion.div>
          ))}
          <ul className="points">
            {s.topic.concept.points.slice(0, f).map((x, i) => <motion.li key={i} {...frag}><Tex as="span" src={x} /></motion.li>)}
          </ul>
        </div>
      );
    case 'example': {
      const ex = s.topic.examples[s.i];
      return (
        <div className="d-col">
          <div className="card-head"><span className="eyebrow red">ข้อ {s.topic.num} · ตัวอย่าง</span><span className="src">{ex.src}</span></div>
          <Tex className="question" src={ex.q} />
          <ol className="steps">
            {ex.steps.slice(0, f).map((x, i) => (
              <motion.li key={i} {...frag}><StepItem s={x} n={i + 1} /></motion.li>
            ))}
          </ol>
          {f >= ex.steps.length && <Answer src={ex.answer} />}
        </div>
      );
    }
    case 'traps':
      return (
        <div className="d-col">
          <span className="eyebrow amber">ข้อ {s.topic.num} · จุดที่มักพลาด</span>
          <ul className="d-traps">
            {s.topic.traps.slice(0, f + 1).map((x, i) => <motion.li key={i} {...frag}><Tex as="span" src={x} /></motion.li>)}
          </ul>
        </div>
      );
    case 'practice': {
      const h = s.p.hint ? 1 : 0;
      const showHint = h === 1 && f >= 1;
      const steps = Math.max(0, f - h);
      return (
        <div className="d-col">
          <div className="card-head"><span className="eyebrow blue">{s.label}</span>{s.p.src && s.topic && <span className="src">{s.p.src}</span>}</div>
          <Tex className="question" src={s.p.q} />
          {showHint && <motion.div className="reveal-inner hint" {...frag}><Tex src={s.p.hint!} /></motion.div>}
          {steps > 0 && (
            <ol className="steps">
              {s.p.sol.slice(0, steps).map((x, i) => <motion.li key={i} {...frag}><StepItem s={x} n={i + 1} /></motion.li>)}
            </ol>
          )}
          {steps >= s.p.sol.length && <Answer src={s.p.answer} />}
          {steps === 0 && <p className="d-tip muted">กด → เพื่อเปิด{h && !showHint ? 'คำใบ้' : 'เฉลยขั้นแรก'}</p>}
        </div>
      );
    }
  }
}

export function TeachMode({ start, p, onClose }: { start: number; p: Palette; onClose: () => void }) {
  const { slides } = useMemo(buildDeck, []);
  const [[i, dir], setI] = useState<[number, number]>([start, 1]);
  const [f, setF] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const s = slides[i];
  const total = fragCount(s);

  const go = useCallback((n: number, showAll = false) => {
    if (n < 0 || n >= slides.length) return;
    setI(([cur]) => [n, n >= cur ? 1 : -1]);
    setF(showAll ? fragCount(slides[n]) : 0);
  }, [slides]);
  const next = useCallback(() => { if (f < total) setF(f + 1); else go(i + 1); }, [f, total, i, go]);
  const prev = useCallback(() => { if (f > 0) setF(f - 1); else go(i - 1, true); }, [f, i, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const el = document.documentElement;
    el.requestFullscreen?.().catch(() => {});
    const onFs = () => { if (!document.fullscreenElement) { /* ผู้ใช้กด Esc ออกจากเต็มจอ: ยังอยู่ในโหมดสอนได้ */ } };
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('fullscreenchange', onFs);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  // ปัดซ้าย/ขวา และแตะครึ่งจอ
  const down = useRef<{ x: number; y: number } | null>(null);
  const interactive = (el: EventTarget | null) => !!(el as Element | null)?.closest?.('button, a, input, canvas, svg.plot, .diagram, .deck-bar');
  const onPointerDown = (e: React.PointerEvent) => { down.current = interactive(e.target) ? null : { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current; down.current = null;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); return; }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) { if (e.clientX > window.innerWidth / 2) next(); else prev(); }
  };

  return createPortal(
    <motion.div ref={root} className="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onPointerDown={onPointerDown} onPointerUp={onPointerUp} role="dialog" aria-label="โหมดสอน">
      <motion.div className="deck-progress" animate={{ width: `${((i + (total ? f / (total + 1) : 0) + 1) / slides.length) * 100}%` }} transition={{ duration: 0.4, ease }} />
      <div className="deck-stage">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div key={i} className="deck-slide" custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60, filter: 'blur(6px)' }),
              center: { opacity: 1, x: 0, filter: 'blur(0px)' },
              exit: (d: number) => ({ opacity: 0, x: d * -60, filter: 'blur(6px)' }),
            }}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease }}>
            <SlideBody s={s} f={f} p={p} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="deck-bar">
        <button type="button" className="btn ghost sm" onClick={onClose}>ออก</button>
        <span className="dlab">{labelOf(s)}</span>
        {total > 0 && (
          <span className="frag-dots" aria-hidden>
            {Array.from({ length: total }, (_, k) => <motion.span key={k} animate={{ scale: k < f ? 1 : 0.7, opacity: k < f ? 1 : 0.35 }} />)}
          </span>
        )}
        <span className="dcnt">{i + 1} / {slides.length}</span>
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.9 }} onClick={prev} aria-label="ย้อนกลับ">←</motion.button>
        <motion.button type="button" className="btn sm" whileTap={{ scale: 0.9 }} onClick={next} aria-label="ถัดไป">→</motion.button>
      </div>
    </motion.div>,
    document.body,
  );
}
