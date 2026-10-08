import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tex } from '../lib/Tex';
import type { LessonBlock } from '../data/lessons';
import { ease, rise } from './Parts';

/** สลับลำดับตัวเลือกแบบคงที่ (seed จากข้อความคำถาม) คำตอบจะได้ไม่อยู่ตำแหน่งเดิมทุกข้อ */
export function shuffled(q: string, n: number) {
  let h = 0;
  for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) | 0;
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function CheckBlock({ b, onSolved, solved, big }: { b: Extract<LessonBlock, { kind: 'check' }>; onSolved: () => void; solved: boolean; big?: boolean }) {
  const order = useMemo(() => shuffled(b.q, b.choices.length), [b]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(solved ? b.answer : null);
  const shake = useAnimationControls();
  const pick = (i: number) => {
    if (picked === b.answer) return;
    setPicked(i);
    if (i === b.answer) onSolved();
    else {
      setWrong((w) => (w.includes(i) ? w : [...w, i]));
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
    }
  };
  const done = picked === b.answer || solved;
  return (
    <div className={'lesson-check' + (big ? ' big' : '')}>
      <span className="lesson-tag check">ลองตอบ</span>
      <Tex className="lesson-q" src={b.q} />
      <motion.div className="choices" animate={shake}>
        {order.map((i) => {
          const state = done && i === b.answer ? 'right' : wrong.includes(i) ? 'wrong' : '';
          return (
            <motion.button key={i} type="button" className={'choice ' + state} onClick={() => pick(i)} disabled={done && i !== b.answer}
              whileHover={!done ? { y: -2 } : undefined} whileTap={!done ? { scale: 0.97 } : undefined}>
              <Tex as="span" src={b.choices[i]} />
              {state === 'right' && <motion.span className="choice-mark" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>}
              {state === 'wrong' && <span className="choice-mark">✕</span>}
            </motion.button>
          );
        })}
      </motion.div>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="ok" className="feedback ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
            <b>ถูกต้อง</b> <Tex as="span" src={b.explain} />
          </motion.div>
        ) : wrong.length > 0 ? (
          <motion.div key="no" className="feedback no" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
            ยังไม่ใช่ ลองคิดอีกครั้ง
            {wrong.length >= 2 && <button type="button" className="link-btn" onClick={() => pick(b.answer)}>ดูเฉลย</button>}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SayBlock({ b, n }: { b: Extract<LessonBlock, { kind: 'say' }>; n: number }) {
  return (
    <div className="lesson-say">
      <span className="lesson-tag">ขั้นที่ {n}</span>
      <h4>{b.title}</h4>
      <Tex className="lesson-body" src={b.body} />
    </div>
  );
}

export function Lesson({ id, blocks, title, done, onFinish }: { id: string; blocks: LessonBlock[]; title: string; done: boolean; onFinish: () => void }) {
  const [shown, setShown] = useState(1);
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const last = blocks[shown - 1];
  const finished = shown >= blocks.length && (last.kind === 'say' || solved[shown - 1]);
  const blocked = last.kind === 'check' && !solved[shown - 1];
  const sayNums = useMemo(() => { let k = 0; return blocks.map((b) => (b.kind === 'say' ? ++k : 0)); }, [blocks]);

  useEffect(() => { if (finished && !done) onFinish(); }, [finished, done, onFinish]);
  useEffect(() => {
    if (shown <= 1) return;
    const el = listRef.current?.lastElementChild as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [shown]);

  const restart = () => { setShown(1); setSolved({}); };

  return (
    <motion.div className="card lesson" id={`lesson-${id}`} {...rise}>
      <div className="card-head">
        <span className="eyebrow violet">เรียนทีละขั้น · {title}</span>
        <span className="small muted">{Math.min(shown, blocks.length)}/{blocks.length}{done ? ' · เรียนจบแล้ว ✓' : ''}</span>
      </div>
      <div className="lesson-bar"><motion.span animate={{ width: `${(Math.min(shown, blocks.length) / blocks.length) * 100}%` }} transition={{ duration: 0.5, ease }} /></div>
      <div className="lesson-list" ref={listRef}>
        <AnimatePresence initial={false}>
          {blocks.slice(0, shown).map((b, i) => (
            <motion.div key={i} className="lesson-item" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
              {b.kind === 'say'
                ? <SayBlock b={b} n={sayNums[i]} />
                : <CheckBlock b={b} solved={!!solved[i]} onSolved={() => setSolved((s) => ({ ...s, [i]: true }))} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="lesson-ctl">
        {!finished && (
          <motion.button type="button" className="btn" disabled={blocked} whileTap={!blocked ? { scale: 0.96 } : undefined} onClick={() => setShown((n) => n + 1)}>
            {blocked ? 'ตอบคำถามก่อนไปต่อ' : shown === 1 ? 'เข้าใจแล้ว ไปต่อ →' : 'ไปต่อ →'}
          </motion.button>
        )}
        {finished && (
          <motion.div className="lesson-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <span className="big-check">✓</span>
            <div><b>เรียนจบบทนี้แล้ว</b><p className="small muted">ต่อไปดูวิธีทำกับตัวอย่างด้านล่าง แล้วลองทำแบบฝึกเอง</p></div>
          </motion.div>
        )}
        {shown > 1 && <button type="button" className="btn ghost sm" onClick={restart}>เริ่มบทเรียนใหม่</button>}
      </div>
    </motion.div>
  );
}
