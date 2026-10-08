import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tex } from '../lib/Tex';
import type { Palette } from '../lib/hooks';
import { catLabel, cats, generate, templates, type Cat, type Problem } from '../drill/gen';
import { hard } from '../data/hard';
import { Answer, PlayIcon, PracticeCard, StepList, ease, rise } from './Parts';

type Tab = 'gen' | 'circle' | 'hard';

export function DrillSection({ p, done, toggle, onTeach }: { p: Palette; done: Record<string, boolean>; toggle: (id: string) => void; onTeach: () => void }) {
  const [tab, setTab] = useState<Tab>('gen');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'gen', label: 'ดิฟให้คล่อง' },
    { id: 'circle', label: 'วงกลมหนึ่งหน่วย' },
    { id: 'hard', label: `โจทย์ยากแบบข้อสอบ (${hard.length})` },
  ];
  return (
    <section className="topic" id="drill">
      <motion.header className="topic-head" {...rise}>
        <span className="topic-num drill">✎</span>
        <div className="topic-title">
          <span className="eyebrow">ลงมือทำ ไม่ใช่แค่อ่าน</span>
          <h2>ฝึกพื้นฐานให้คล่อง</h2>
        </div>
        <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.95 }} onClick={onTeach}><PlayIcon /> โจทย์ยากเป็นสไลด์</motion.button>
      </motion.header>
      <motion.div className="note warn-note" {...rise}>
        <b>ทำไมต้องฝึกส่วนนี้:</b> ข้อสอบจริงไม่ได้ยากที่แนวคิดแคล 3 แต่ยากที่การดิฟผลคูณ ผลหาร ln, e, sin, cos และการแทนค่า π ที่ซ้อนกันอยู่ในข้อเดียว ถ้าส่วนนี้ช้าหรือพลาด ทั้งข้อก็ผิด ฝึกจนตอบได้โดยไม่ต้องเปิดสูตร
      </motion.div>
      <div className="tabs big" role="tablist">
        {tabs.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={'tab' + (tab === x.id ? ' on' : '')} onClick={() => setTab(x.id)}>
            {tab === x.id && <motion.span layoutId="drill-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="tab-t">{x.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease }}>
          {tab === 'gen' && <DiffDrill />}
          {tab === 'circle' && <UnitCircleGame p={p} />}
          {tab === 'hard' && (
            <div className="practice">
              {hard.map((h, i) => <PracticeCard key={h.id} p={h} label={`H${i + 1}`} done={!!done[h.id]} onToggle={() => toggle(h.id)} />)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ================= สุ่มโจทย์ดิฟ ================= */
const STATS = 'cal3-drill-stats-v1';
type Stats = { tried: number; first: number; best: number };
function loadStats(): Stats {
  try { return { tried: 0, first: 0, best: 0, ...JSON.parse(localStorage.getItem(STATS) || '{}') }; } catch { return { tried: 0, first: 0, best: 0 }; }
}

type Choice = { tex: string; ok: boolean; why?: string };
function choicesOf(pr: Problem): Choice[] {
  const all: Choice[] = [{ tex: pr.correct, ok: true }, ...pr.wrongs.map((w) => ({ tex: w.tex, ok: false, why: w.why }))];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all;
}

function DiffDrill() {
  const [allowed, setAllowed] = useState<Cat[]>([]);
  const [mode, setMode] = useState<'free' | 'test'>('free');
  const [test, setTest] = useState<{ list: Problem[]; i: number; results: boolean[] } | null>(null);
  const [pr, setPr] = useState<Problem>(() => generate([]));
  const [choices, setChoices] = useState<Choice[]>(() => choicesOf(pr));
  const [picked, setPicked] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [showSteps, setShowSteps] = useState(false);
  const shake = useAnimationControls();

  useEffect(() => { try { localStorage.setItem(STATS, JSON.stringify(stats)); } catch { /* storage blocked */ } }, [stats]);

  const lock = useRef({ solved: false, picked: [] as number[] });
  const load = useCallback((p: Problem) => { lock.current = { solved: false, picked: [] }; setPr(p); setChoices(choicesOf(p)); setPicked([]); setSolved(false); setShowSteps(false); }, []);
  const next = () => {
    if (mode === 'test' && test) {
      if (test.i + 1 < test.list.length) { setTest({ ...test, i: test.i + 1 }); load(test.list[test.i + 1]); }
      else setTest({ ...test, i: test.list.length });
      return;
    }
    load(generate(allowed));
  };
  const startTest = () => {
    const list = cats.map((c) => templates[c][Math.floor(Math.random() * templates[c].length)]());
    setMode('test'); setTest({ list, i: 0, results: [] }); load(list[0]);
  };
  const toggleCat = (c: Cat) => setAllowed((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));
  const practiceCat = (c: Cat) => { setMode('free'); setTest(null); setAllowed([c]); load(generate([c])); };

  const choose = (i: number) => {
    const L = lock.current;
    if (L.solved || L.picked.includes(i)) return;
    const firstTry = L.picked.length === 0;
    const ok = choices[i].ok;
    L.picked = [...L.picked, i];
    if (ok) L.solved = true;
    setPicked(L.picked);
    if (firstTry) setStats((s) => ({ ...s, tried: s.tried + 1, first: s.first + (ok ? 1 : 0) }));
    if (mode === 'test' && test && firstTry) setTest({ ...test, results: [...test.results, ok] });
    if (ok) {
      setSolved(true);
      if (firstTry) setStreak((k) => { const n = k + 1; setStats((s) => ({ ...s, best: Math.max(s.best, n) })); return n; });
    } else {
      setStreak(0);
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
    }
  };

  const testDone = mode === 'test' && test && test.i >= test.list.length;
  const lastWrong = picked.length && !choices[picked[picked.length - 1]].ok ? choices[picked[picked.length - 1]] : null;

  return (
    <div className="drill-wrap">
      <div className="drill-bar">
        <div className="drill-stat"><span className="k">ทำแล้ว</span><b>{stats.tried}</b></div>
        <div className="drill-stat"><span className="k">ถูกครั้งแรก</span><b>{stats.tried ? Math.round((stats.first / stats.tried) * 100) : 0}%</b></div>
        <div className="drill-stat streak"><span className="k">ถูกติดกัน</span>
          <AnimatePresence mode="popLayout"><motion.b key={streak} initial={{ y: -12, opacity: 0, scale: 1.4 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 12, opacity: 0 }}>{streak}</motion.b></AnimatePresence>
        </div>
        <div className="drill-stat"><span className="k">สถิติสูงสุด</span><b>{stats.best}</b></div>
        {mode === 'free'
          ? <button type="button" className="btn sm" onClick={startTest}>เช็กพื้นฐาน 6 ข้อ</button>
          : <button type="button" className="btn ghost sm" onClick={() => { setMode('free'); setTest(null); load(generate(allowed)); }}>ออกจากแบบทดสอบ</button>}
      </div>

      {mode === 'free' && (
        <div className="cat-chips">
          <span className="small muted">เลือกหมวด:</span>
          <button type="button" className={'chip' + (allowed.length === 0 ? ' on' : '')} onClick={() => setAllowed([])}>ทั้งหมด</button>
          {cats.map((c) => (
            <button key={c} type="button" className={'chip' + (allowed.includes(c) ? ' on' : '')} onClick={() => toggleCat(c)}>{catLabel[c]}</button>
          ))}
        </div>
      )}

      {testDone && test ? (
        <TestResult list={test.list} results={test.results} onRetry={startTest} onPractice={practiceCat} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={pr.q + (test?.i ?? '')} className="card drill-card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease }}>
            <div className="card-head">
              <span className="eyebrow blue">{mode === 'test' && test ? `เช็กพื้นฐาน ข้อ ${test.i + 1}/${test.list.length}` : 'โจทย์สุ่ม'} · {catLabel[pr.cat]}</span>
              {mode === 'test' && test && <span className="test-dots">{test.list.map((_, k) => <span key={k} className={k < test.results.length ? (test.results[k] ? 'ok' : 'no') : k === test.i ? 'cur' : ''} />)}</span>}
            </div>
            <Tex className="drill-q" src={`$$${pr.q} = \\ ?$$`} />
            <motion.div className="choices" animate={shake}>
              {choices.map((c, i) => {
                const st = picked.includes(i) ? (c.ok ? 'right' : 'wrong') : solved && c.ok ? 'right' : '';
                return (
                  <motion.button key={c.tex} type="button" className={'choice ' + st} onClick={() => choose(i)} disabled={solved && !c.ok}
                    whileHover={!solved ? { y: -2 } : undefined} whileTap={!solved ? { scale: 0.97 } : undefined}>
                    <Tex as="span" src={`$\\displaystyle ${c.tex}$`} />
                    {st === 'right' && <motion.span className="choice-mark" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>}
                    {st === 'wrong' && <span className="choice-mark">✕</span>}
                  </motion.button>
                );
              })}
            </motion.div>
            <AnimatePresence mode="wait">
              {solved ? (
                <motion.div key="ok" className="feedback ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <b>{picked.length === 1 ? 'ถูกต้อง' : 'ถูกแล้ว'}</b>{picked.length === 1 && streak >= 3 ? ` ถูกติดกัน ${streak} ข้อแล้ว` : ''}
                </motion.div>
              ) : lastWrong ? (
                <motion.div key={'no' + picked.length} className="feedback no" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <span><b>ยังไม่ใช่</b> <Tex as="span" src={lastWrong.why ?? ''} /> ลองเลือกใหม่</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
            {(solved || showSteps) && (
              <div className="drill-sol">
                <StepList steps={pr.steps} shown={pr.steps.length} />
                <Answer src={`$${pr.correct}$`} />
              </div>
            )}
            <div className="step-ctl">
              {!solved && !showSteps && picked.length > 0 && <button type="button" className="btn ghost sm" onClick={() => setShowSteps(true)}>ดูวิธีทำ</button>}
              <motion.button type="button" className={'btn sm' + (solved ? '' : ' ghost')} whileTap={{ scale: 0.95 }} onClick={next}>
                {mode === 'test' ? (test && test.i + 1 >= test.list.length ? 'ดูผล' : 'ข้อต่อไป →') : solved ? 'โจทย์ใหม่ →' : 'ข้าม'}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function TestResult({ list, results, onRetry, onPractice }: { list: Problem[]; results: boolean[]; onRetry: () => void; onPractice: (c: Cat) => void }) {
  const score = results.filter(Boolean).length;
  const weak = list.filter((_, i) => !results[i]).map((p) => p.cat);
  return (
    <motion.div className="card test-result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
      <span className="eyebrow blue">ผลเช็กพื้นฐาน</span>
      <div className="score"><motion.b initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>{score}</motion.b><span>/ {list.length}</span></div>
      <div className="result-rows">
        {list.map((p, i) => (
          <div key={i} className={'result-row ' + (results[i] ? 'ok' : 'no')}>
            <span className="mark">{results[i] ? '✓' : '✕'}</span>
            <span className="rr-cat">{catLabel[p.cat]}</span>
            {!results[i] && <button type="button" className="chip" onClick={() => onPractice(p.cat)}>ฝึกหมวดนี้</button>}
          </div>
        ))}
      </div>
      <p className="muted">
        {weak.length === 0 ? 'พื้นฐานแน่นแล้ว ไปทำโจทย์ยากแบบข้อสอบต่อได้เลย' : `ควรฝึกเพิ่ม: ${[...new Set(weak)].map((c) => catLabel[c]).join(', ')} กดปุ่ม "ฝึกหมวดนี้" เพื่อสุ่มเฉพาะหมวดนั้น`}
      </p>
      <button type="button" className="btn ghost sm" onClick={onRetry}>ทดสอบใหม่</button>
    </motion.div>
  );
}

/* ================= วงกลมหนึ่งหน่วย ================= */
type Ang = { n: number; d: number }; // มุม = nπ/d
const ANGLES: Ang[] = [
  { n: 0, d: 1 }, { n: 1, d: 6 }, { n: 1, d: 4 }, { n: 1, d: 3 }, { n: 1, d: 2 }, { n: 2, d: 3 }, { n: 3, d: 4 }, { n: 5, d: 6 },
  { n: 1, d: 1 }, { n: 7, d: 6 }, { n: 5, d: 4 }, { n: 4, d: 3 }, { n: 3, d: 2 }, { n: 5, d: 3 }, { n: 7, d: 4 }, { n: 11, d: 6 },
];
const VALS: { v: number; tex: string }[] = [
  { v: 0, tex: '0' }, { v: 0.5, tex: '\\frac12' }, { v: Math.SQRT2 / 2, tex: '\\frac{\\sqrt2}{2}' }, { v: Math.sqrt(3) / 2, tex: '\\frac{\\sqrt3}{2}' }, { v: 1, tex: '1' },
];
const valTex = (x: number) => {
  const m = VALS.find((q) => Math.abs(q.v - Math.abs(x)) < 1e-9)!;
  return x < -1e-9 ? `-${m.tex}` : m.tex;
};
const angTex = (a: Ang) => (a.n === 0 ? '0' : a.d === 1 ? (a.n === 1 ? '\\pi' : `${a.n}\\pi`) : `\\frac{${a.n === 1 ? '' : a.n}\\pi}{${a.d}}`);
const rad = (a: Ang) => (a.n * Math.PI) / a.d;
const deg = (a: Ang) => Math.round((a.n * 180) / a.d);
const clean = (x: number) => (Math.abs(x) < 1e-9 ? 0 : x);

function UnitCircleGame({ p }: { p: Palette }) {
  const [q1Only, setQ1Only] = useState(false);
  const pool = useMemo(() => (q1Only ? ANGLES.filter((a) => a.n / a.d <= 0.5) : ANGLES), [q1Only]);
  const make = useCallback(() => {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const fn: 'sin' | 'cos' = Math.random() < 0.5 ? 'sin' : 'cos';
    const val = clean(fn === 'sin' ? Math.sin(rad(a)) : Math.cos(rad(a)));
    const other = clean(fn === 'sin' ? Math.cos(rad(a)) : Math.sin(rad(a)));
    const set = new Set<string>([valTex(val)]);
    const cands = [valTex(-val), valTex(other), valTex(-other)];
    for (const c of cands) if (set.size < 4) set.add(c);
    const pool2 = [0, 0.5, Math.SQRT2 / 2, Math.sqrt(3) / 2, 1, -0.5, -Math.SQRT2 / 2, -Math.sqrt(3) / 2, -1];
    while (set.size < 4) set.add(valTex(pool2[Math.floor(Math.random() * pool2.length)]));
    const opts = [...set].sort(() => Math.random() - 0.5);
    return { a, fn, val, ans: valTex(val), opts };
  }, [pool]);
  const [q, setQ] = useState(make);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState({ ok: 0, n: 0 });
  const lockC = useRef<string | null>(null);
  const nextQ = useCallback(() => { lockC.current = null; setQ(make()); setPicked(null); }, [make]);
  useEffect(() => { nextQ(); }, [nextQ]);
  const shake = useAnimationControls();

  const choose = (o: string) => {
    if (lockC.current === q.ans) return;
    const first = lockC.current === null;
    lockC.current = o;
    setPicked(o);
    if (first) setScore((s) => ({ ok: s.ok + (o === q.ans ? 1 : 0), n: s.n + 1 }));
    if (o === q.ans) { if (first) setStreak((k) => k + 1); }
    else { setStreak(0); shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } }); }
  };
  const solved = picked === q.ans;
  const th = rad(q.a);
  const R = 120, cx = 160, cy = 160;
  const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);

  return (
    <div className="circle-wrap">
      <div className="card circle-card">
        <svg viewBox="0 0 320 320" className="ucircle" role="img" aria-label="วงกลมหนึ่งหน่วย">
          <rect width="320" height="320" rx="18" fill={p.paper2} />
          <line x1="20" y1={cy} x2="300" y2={cy} stroke={p.muted} strokeWidth="1.2" />
          <line x1={cx} y1="20" x2={cx} y2="300" stroke={p.muted} strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={p.ink} strokeWidth="1.6" />
          {ANGLES.map((a) => (
            <circle key={`${a.n}/${a.d}`} cx={cx + R * Math.cos(rad(a))} cy={cy - R * Math.sin(rad(a))} r="3" fill={p.muted} />
          ))}
          <text x="304" y={cy - 6} fill={p.muted} className="svg-lab" textAnchor="end">x (cos)</text>
          <text x={cx + 6} y="30" fill={p.muted} className="svg-lab">y (sin)</text>
          <text x={cx + R + 4} y={cy + 16} fill={p.muted} className="svg-lab">1</text>
          <text x={cx - R - 14} y={cy + 16} fill={p.muted} className="svg-lab">−1</text>
          {/* มุมที่ถาม */}
          <motion.path initial={false} animate={{ d: arcPath(cx, cy, 26, th) }} fill="none" stroke={p.violet} strokeWidth="2.5" transition={{ duration: 0.5, ease }} />
          <motion.line x1={cx} y1={cy} initial={false} animate={{ x2: px, y2: py }} stroke={p.violet} strokeWidth="2.5" transition={{ duration: 0.5, ease }} />
          {solved && (
            <>
              <motion.line x1={px} y1={py} x2={px} y2={cy} stroke={p.red} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
              <motion.line x1={cx} y1={cy} x2={px} y2={cy} stroke={p.blue} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={(cx + px) / 2} y={cy + (py < cy ? 18 : -8)} fill={p.blue} className="svg-lab b" textAnchor="middle">cos</motion.text>
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={px + (px >= cx ? 8 : -8)} y={(py + cy) / 2} fill={p.red} className="svg-lab b" textAnchor={px >= cx ? 'start' : 'end'}>sin</motion.text>
            </>
          )}
          <motion.circle initial={false} animate={{ cx: px, cy: py }} r="7" fill={p.violet} stroke={p.paper} strokeWidth="2.5" transition={{ duration: 0.5, ease }} />
        </svg>
      </div>
      <div className="card circle-q">
        <div className="card-head">
          <span className="eyebrow violet">ทายค่า · ถูกติดกัน {streak} · ได้ {score.ok}/{score.n}</span>
          <label className="small muted q1"><input type="checkbox" id="q1only" checked={q1Only} onChange={(e) => setQ1Only(e.target.checked)} /> เฉพาะ 0 ถึง π/2</label>
        </div>
        <Tex className="drill-q" src={`$$\\${q.fn}\\left(${angTex(q.a)}\\right) = \\ ?$$`} />
        <p className="small muted center">มุมนี้คือ {deg(q.a)}°</p>
        <motion.div className="choices four" animate={shake}>
          {q.opts.map((o) => {
            const st = picked === o ? (o === q.ans ? 'right' : 'wrong') : solved && o === q.ans ? 'right' : '';
            return (
              <motion.button key={o} type="button" className={'choice ' + st} onClick={() => choose(o)} disabled={solved && o !== q.ans} whileTap={!solved ? { scale: 0.95 } : undefined}>
                <Tex as="span" src={`$\\displaystyle ${o}$`} />
              </motion.button>
            );
          })}
        </motion.div>
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div key="ok" className="feedback ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <b>ถูกต้อง</b> <Tex as="span" src={`จุดบนวงกลมอยู่ที่ $\\left(${valTex(clean(Math.cos(th)))},\\ ${valTex(clean(Math.sin(th)))}\\right)$ โดย $\\cos$ คือพิกัด x (เส้นสีน้ำเงิน) และ $\\sin$ คือพิกัด y (เส้นสีแดง)`} />
            </motion.div>
          ) : picked ? (
            <motion.div key={'no' + picked} className="feedback no" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              ยังไม่ใช่ ดูว่าจุดอยู่ควอดรันต์ไหน แล้วเช็กเครื่องหมายอีกครั้ง
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.button type="button" className={'btn sm' + (solved ? '' : ' ghost')} whileTap={{ scale: 0.95 }} onClick={nextQ}>
          {solved ? 'ข้อต่อไป →' : 'ข้าม'}
        </motion.button>
        <div className="tips">
          <Tex src={'**วิธีจำ:** มุม $\\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}$ ค่า sin คือ $\\frac{\\sqrt1}{2}, \\frac{\\sqrt2}{2}, \\frac{\\sqrt3}{2}$ (ไล่ 1, 2, 3 ใต้ราก) ส่วน cos ไล่กลับด้าน'} />
          <Tex src={'**เครื่องหมาย:** ควอดรันต์ 1 บวกทั้งคู่, ควอดรันต์ 2 sin บวก, ควอดรันต์ 3 ลบทั้งคู่, ควอดรันต์ 4 cos บวก'} />
        </div>
      </div>
    </div>
  );
}

function arcPath(cx: number, cy: number, r: number, th: number) {
  if (th < 1e-6) return `M ${cx + r} ${cy} L ${cx + r} ${cy}`;
  const x = cx + r * Math.cos(th), y = cy - r * Math.sin(th);
  return `M ${cx + r} ${cy} A ${r} ${r} 0 ${th > Math.PI ? 1 : 0} 0 ${x} ${y}`;
}
