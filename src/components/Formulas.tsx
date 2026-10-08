import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Tex } from '../lib/Tex';
import { flashcards, ruleGroups, values } from '../data/formulas';
import { PlayIcon, ease, rise } from './Parts';

export const flashIds = flashcards.map((_, i) => `fc${i}`);

export function FormulaSection({ done, toggle, onTeach }: { done: Record<string, boolean>; toggle: (id: string) => void; onTeach: () => void }) {
  const [tab, setTab] = useState(ruleGroups[0].id);
  const g = ruleGroups.find((x) => x.id === tab)!;

  return (
    <section className="topic" id="rules">
      <motion.header className="topic-head" {...rise}>
        <span className="topic-num fx">ƒ′</span>
        <div className="topic-title">
          <span className="eyebrow">พื้นฐานของทุกข้อ</span>
          <h2>สูตรการดิฟ</h2>
        </div>
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.95 }} onClick={onTeach}><PlayIcon /> สอนหัวข้อนี้</motion.button>
      </motion.header>
      <motion.div {...rise}>
        <Tex className="muted" src={"ทุกข้อในข้อสอบต้อง diff ให้ถูกก่อน ในตาราง $u$ คือฟังก์ชันข้างใน และ $u'$ คืออนุพันธ์ของ $u$ แต่ละสูตรมีตัวอย่างการใช้กับอนุพันธ์ย่อยให้ดูคู่กัน"} />
      </motion.div>

      <motion.div className="card rules" {...rise}>
        <div className="tabs" role="tablist">
          {ruleGroups.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={'tab' + (tab === x.id ? ' on' : '')} onClick={() => setTab(x.id)}>
              {tab === x.id && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="tab-t">{x.title}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease }}>
            <p className="rules-note">{g.note}</p>
            <div className="rule-grid">
              {g.rules.map((r, i) => (
                <motion.div key={r.name} className="rule" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35, ease }}>
                  <span className="rule-name">{r.name}</span>
                  <Tex className="rule-f" src={`$$${r.rule}$$`} />
                  <div className="rule-ex">
                    <span className="rule-ex-lbl">ใช้กับอนุพันธ์ย่อย</span>
                    <Tex src={`$${r.partial}$`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="side-by-side">
        <motion.div className="card" {...rise}>
          <span className="eyebrow blue">ค่าที่ใช้แทนบ่อย</span>
          <div className="values">
            {values.map((v) => (
              <div key={v.k} className="value"><Tex as="span" src={`$${v.k}$`} /><span className="eq">=</span><Tex as="span" src={`$${v.v}$`} /></div>
            ))}
          </div>
        </motion.div>
        <motion.div {...rise}>
          <Flashcards done={done} toggle={toggle} />
        </motion.div>
      </div>
    </section>
  );
}

function Flashcards({ done, toggle }: { done: Record<string, boolean>; toggle: (id: string) => void }) {
  const [order, setOrder] = useState(() => flashcards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);
  const [dir, setDir] = useState(1);
  const i = order[pos];
  const c = flashcards[i];
  const known = useMemo(() => flashIds.filter((id) => done[id]).length, [done]);
  const go = (d: number) => { setDir(d); setFlip(false); setPos((p) => (p + d + order.length) % order.length); };
  const shuffle = () => {
    const a = [...order];
    for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
    setOrder(a); setPos(0); setFlip(false);
  };
  const id = `fc${i}`;

  return (
    <div className="card flash">
      <div className="card-head">
        <span className="eyebrow violet">การ์ดฝึกจำ · แตะการ์ดเพื่อพลิก</span>
        <span className="small muted">จำได้ {known}/{flashcards.length}</span>
      </div>
      <div className="flash-stage">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.button
            key={pos}
            type="button"
            className="flash-card"
            onClick={() => setFlip((f) => !f)}
            custom={dir}
            variants={{ in: (d: number) => ({ opacity: 0, x: d * 40 }), c: { opacity: 1, x: 0 }, out: (d: number) => ({ opacity: 0, x: d * -40 }) }}
            initial="in" animate="c" exit="out" transition={{ duration: 0.25, ease }}
            aria-label={flip ? 'ด้านคำตอบ แตะเพื่อพลิกกลับ' : 'ด้านโจทย์ แตะเพื่อดูคำตอบ'}
          >
            <motion.div className="flash-inner" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.5, ease }}>
              <div className="flash-face front">
                <span className="flash-tag">โจทย์</span>
                <Tex src={`$$${c.front}$$`} />
              </div>
              <div className="flash-face back">
                <span className="flash-tag">คำตอบ</span>
                <Tex src={`$$${c.back}$$`} />
              </div>
            </motion.div>
          </motion.button>
        </AnimatePresence>
      </div>
      <div className="flash-ctl">
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.92 }} onClick={() => go(-1)} aria-label="ใบก่อนหน้า">←</motion.button>
        <span className="small muted">{pos + 1} / {order.length}</span>
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.92 }} onClick={() => go(1)} aria-label="ใบถัดไป">→</motion.button>
        <button type="button" className="btn ghost sm" onClick={shuffle}>สุ่ม</button>
        <motion.button type="button" className={'btn sm' + (done[id] ? ' ok' : '')} whileTap={{ scale: 0.94 }} onClick={() => toggle(id)}>
          {done[id] ? 'จำได้แล้ว ✓' : 'จำได้'}
        </motion.button>
      </div>
    </div>
  );
}
