import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Tex } from '../lib/Tex';
import type { Palette } from '../lib/hooks';
import type { FigureKind, Practice, Topic } from '../data/topics';
import { Lesson } from './Lesson';
import { lessons } from '../data/lessons';
import { ChainDiagram, DerivTree, DirectionalFigure, LevelCurveFigure } from '../figures/Diagrams';

const SliceSurface = lazy(() => import('../figures/Surfaces').then((m) => ({ default: m.SliceSurface })));

export const ease = [0.2, 0.8, 0.2, 1] as const;

export const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { duration: 0.6, ease },
};

/* ---------------- Checkbox ---------------- */
export function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} className={'check' + (checked ? ' on' : '')} onClick={onChange}>
      <motion.span className="box" animate={{ scale: checked ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            initial={false} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: 0.3, ease }} />
        </svg>
      </motion.span>
      {checked ? 'ทำได้แล้ว' : label}
    </button>
  );
}

/* ---------------- Collapsible panel ---------------- */
export function Reveal({ open, kind, children }: { open: boolean; kind: 'hint' | 'sol'; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div className="reveal-wrap" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.38, ease }}>
          <motion.div className={'reveal-inner ' + kind} initial={{ y: -8 }} animate={{ y: 0 }} exit={{ y: -8 }} transition={{ duration: 0.38, ease }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg viewBox="0 0 24 24" width="14" height="14" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease }} aria-hidden>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ---------------- Steps ("หัวข้อ::รายละเอียด") ---------------- */
export function splitStep(s: string) {
  const i = s.indexOf('::');
  return i < 0 ? { h: '', b: s } : { h: s.slice(0, i), b: s.slice(i + 2) };
}

export function StepItem({ s, n }: { s: string; n: number }) {
  const { h, b } = splitStep(s);
  return (
    <>
      <span className="step-n">{n}</span>
      <div className="step-body">
        {h && <Tex as="p" className="step-h" src={h} />}
        <Tex src={b} />
      </div>
    </>
  );
}

export function StepList({ steps, shown }: { steps: string[]; shown: number }) {
  return (
    <ol className="steps">
      <AnimatePresence initial={false}>
        {steps.slice(0, shown).map((s, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease }}>
            <StepItem s={s} n={i + 1} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}

export function Answer({ src }: { src: string }) {
  return (
    <motion.div className="answer" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
      <span className="answer-lbl">ตอบ</span>
      <Tex src={src} />
    </motion.div>
  );
}

function StepControls({ shown, total, setShown, onClose }: { shown: number; total: number; setShown: (n: number) => void; onClose?: () => void }) {
  const all = shown >= total;
  return (
    <div className="step-ctl">
      {!all && <motion.button type="button" className="btn sm" whileTap={{ scale: 0.95 }} onClick={() => setShown(shown + 1)}>ขั้นต่อไป ({shown}/{total})</motion.button>}
      {!all && <button type="button" className="btn ghost sm" onClick={() => setShown(total)}>แสดงทั้งหมด</button>}
      {all && total > 1 && <button type="button" className="btn ghost sm" onClick={() => setShown(1)}>เริ่มใหม่</button>}
      {onClose && <button type="button" className="btn ghost sm" onClick={onClose}>ซ่อนเฉลย</button>}
    </div>
  );
}

/* ---------------- Practice card ---------------- */
export function PracticeCard({ p, label, done, onToggle }: { p: Practice; label: string; done: boolean; onToggle: () => void }) {
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState(0);
  const open = shown > 0;
  return (
    <motion.article className={'prob' + (done ? ' done' : '')} {...rise} layout="position">
      <div className="prob-top">
        <span className="prob-lbl">{label}</span>
        <div className="prob-body">
          <Tex src={p.q} />
          {p.src && <span className="src">{p.src}</span>}
        </div>
      </div>
      <div className="prob-foot">
        {p.hint && (
          <motion.button type="button" className="pill hint" whileTap={{ scale: 0.95 }} onClick={() => setHint((x) => !x)} aria-expanded={hint}>
            {hint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้'} <Chevron open={hint} />
          </motion.button>
        )}
        {!open && (
          <motion.button type="button" className="pill sol" whileTap={{ scale: 0.95 }} onClick={() => setShown(1)}>
            ดูเฉลยทีละขั้น <Chevron open={false} />
          </motion.button>
        )}
        <Check checked={done} onChange={onToggle} label="ทำได้แล้ว" />
      </div>
      {p.hint && <Reveal open={hint} kind="hint"><Tex src={p.hint} /></Reveal>}
      <Reveal open={open} kind="sol">
        <StepList steps={p.sol} shown={shown} />
        {shown >= p.sol.length && <Answer src={p.answer} />}
        <StepControls shown={shown} total={p.sol.length} setShown={setShown} onClose={() => setShown(0)} />
      </Reveal>
    </motion.article>
  );
}

/* ---------------- Figure ---------------- */
function SliceFigure({ p }: { p: Palette }) {
  const [y0, setY0] = useState(1.2);
  return (
    <div className="diagram">
      <div className="canvas-box">
        <Suspense fallback={<div className="canvas-loading">กำลังโหลดรูป 3 มิติ…</div>}>
          <SliceSurface p={p} y0={y0} />
        </Suspense>
      </div>
      <div className="readout-grid">
        <label className="slider">
          <span className="small muted">ขยับจุดตามแนว y</span>
          <input type="range" min={-1.8} max={1.8} step={0.1} value={y0} onChange={(e) => setY0(Number(e.target.value))} id="slice-y" />
        </label>
        <Tex src={`$\\text{จุด } (1,\\ ${y0.toFixed(1)},\\ ${(1 + y0 * y0).toFixed(2)})$`} />
        <Tex className="big-readout" src={`$\\text{ความชัน} = \\left.\\dfrac{\\partial z}{\\partial y}\\right|_{y=${y0.toFixed(1)}} = 2y = ${(2 * y0).toFixed(1)}$`} />
        <p className="small muted">Example 7 ในสไลด์: ที่จุด (1, 2, 5) ความชัน = 2(2) = 4</p>
      </div>
    </div>
  );
}

export function Figure({ kind, p }: { kind: FigureKind; p: Palette }) {
  switch (kind) {
    case 'slice': return <SliceFigure p={p} />;
    case 'tree': return <DerivTree p={p} />;
    case 'chain2': return <ChainDiagram p={p} vars={['x', 'y']} />;
    case 'chain3': return <ChainDiagram p={p} vars={['x', 'y', 'z']} />;
    case 'direction': return <DirectionalFigure p={p} />;
    case 'level': return <LevelCurveFigure p={p} />;
  }
}

/* ---------------- Example with step reveal ---------------- */
function ExampleCard({ ex }: { ex: Topic['examples'][number] }) {
  const [shown, setShown] = useState(1);
  return (
    <motion.div className="card example" {...rise}>
      <div className="card-head">
        <span className="eyebrow red">ตัวอย่าง{ex.level ? ` · ระดับ${ex.level}` : ''} · {ex.title}</span>
        <span className="src">{ex.src}</span>
      </div>
      <Tex className="question" src={ex.q} />
      <StepList steps={ex.steps} shown={shown} />
      {shown >= ex.steps.length && <Answer src={ex.answer} />}
      <StepControls shown={shown} total={ex.steps.length} setShown={setShown} />
    </motion.div>
  );
}

/* ---------------- Topic section ---------------- */
export function TopicSection({ topic, p, done, toggle, onTeach }: { topic: Topic; p: Palette; done: Record<string, boolean>; toggle: (id: string) => void; onTeach: () => void }) {
  return (
    <section className="topic" id={topic.id}>
      <motion.header className="topic-head" {...rise}>
        <span className="topic-num">{topic.num}</span>
        <div className="topic-title">
          <span className="eyebrow">ข้อ {topic.num} ของข้อสอบ</span>
          <h2>{topic.title}</h2>
        </div>
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.95 }} onClick={onTeach}>
          <PlayIcon /> สอนหัวข้อนี้
        </motion.button>
      </motion.header>

      <Lesson id={topic.id} title={topic.title} blocks={lessons[topic.id]} done={!!done[`L-${topic.id}`]}
        onFinish={() => { if (!done[`L-${topic.id}`]) toggle(`L-${topic.id}`); }} />

      <div className="topic-grid">
        <motion.div className="card concept" {...rise}>
          <span className="eyebrow blue">{topic.concept.eyebrow}</span>
          <Tex className="lead" src={topic.concept.lead} />
          {topic.concept.formulas.map((f, i) => <Tex key={i} className="formula" src={f} />)}
          <ul className="points">
            {topic.concept.points.map((pt, i) => <Tex as="li" key={i} src={pt} />)}
          </ul>
        </motion.div>
        <motion.div className="card figure" {...rise}>
          <div className="card-head">
            <span className="eyebrow blue">รูปประกอบ</span>
            <span className="fig-title">{topic.figureTitle}</span>
          </div>
          <Figure kind={topic.figure} p={p} />
          <p className="fig-hint">{topic.figureHint}</p>
        </motion.div>
      </div>

      <motion.div className="card recipe" {...rise}>
        <span className="eyebrow green">วิธีทำ {topic.recipe.length} ขั้น · ใช้ได้กับทุกข้อในหัวข้อนี้</span>
        <ol className="recipe-list">
          {topic.recipe.map((r, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4, ease }}>
              <span className="recipe-n">{i + 1}</span><Tex src={r} />
            </motion.li>
          ))}
        </ol>
      </motion.div>

      <h3 className="sub-h">ตัวอย่าง {topic.examples.length} ข้อ <span className="muted small">เรียงจากง่ายไปยาก</span></h3>
      {topic.examples.map((ex, i) => <ExampleCard key={i} ex={ex} />)}

      <div className="side-by-side">
        <motion.div className="note trap" {...rise}>
          <span className="eyebrow">จุดที่มักพลาด</span>
          <ul>{topic.traps.map((x, i) => <Tex as="li" key={i} src={x} />)}</ul>
        </motion.div>
        <motion.div className="note tutor" {...rise}>
          <span className="eyebrow">ไว้สอนน้อง</span>
          <ul>{topic.tutor.map((x, i) => <Tex as="li" key={i} src={x} />)}</ul>
        </motion.div>
      </div>

      <div className="practice">
        <h3>แบบฝึก <span className="muted small">{topic.practice.filter((x) => done[x.id]).length}/{topic.practice.length}</span></h3>
        {topic.practice.map((pr, i) => (
          <PracticeCard key={pr.id} p={pr} label={`${topic.num}.${i + 1}`} done={!!done[pr.id]} onToggle={() => toggle(pr.id)} />
        ))}
      </div>
    </section>
  );
}

export function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>;
}

/* ---------------- Timer ---------------- */
export function Timer() {
  const total = 30 * 60;
  const [left, setLeft] = useState(total);
  const [run, setRun] = useState(false);
  const iv = useRef<number>();
  useEffect(() => {
    if (!run) return;
    iv.current = window.setInterval(() => setLeft((l) => (l <= 1 ? (setRun(false), 0) : l - 1)), 1000);
    return () => clearInterval(iv.current);
  }, [run]);
  const m = Math.floor(left / 60), s = left % 60;
  const frac = left / total;
  return (
    <div className="timer-card">
      <svg viewBox="0 0 120 120" className="timer-ring" aria-hidden>
        <circle cx="60" cy="60" r="52" className="tr-bg" />
        <motion.circle cx="60" cy="60" r="52" className={'tr-fg' + (left <= 60 && run ? ' low' : '')} style={{ rotate: -90, transformOrigin: '50% 50%' }}
          animate={{ pathLength: frac }} transition={{ duration: 0.9, ease: 'linear' }} />
      </svg>
      <div className="timer-text">
        <span className={'timer' + (run ? ' run' : '') + (left <= 60 && run ? ' low' : '')} aria-live="polite">
          {left === 0 ? 'หมดเวลา' : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}
        </span>
        <div className="timer-btns">
          <motion.button type="button" className="btn sm" whileTap={{ scale: 0.95 }} onClick={() => { if (left === 0) setLeft(total); setRun((r) => !r); }}>
            {run ? 'หยุดชั่วคราว' : left === total || left === 0 ? 'เริ่มจับเวลา' : 'เดินต่อ'}
          </motion.button>
          <button type="button" className="btn ghost sm" onClick={() => { setRun(false); setLeft(total); }}>รีเซ็ต</button>
        </div>
      </div>
    </div>
  );
}
