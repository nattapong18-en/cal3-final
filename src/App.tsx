import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { mock, plan, topics } from './data/topics';
import { usePalette, useProgress, useTheme } from './lib/hooks';
import { PlayIcon, PracticeCard, Timer, TopicSection, ease, rise } from './components/Parts';
import { TeachMode, buildDeck } from './components/TeachMode';
import { FormulaSection, flashIds } from './components/Formulas';
import { DrillSection } from './components/Drill';
import { hard } from './data/hard';

const HeroSurface = lazy(() => import('./figures/Surfaces').then((m) => ({ default: m.HeroSurface })));

const sections = [{ id: 'rules', num: 'ƒ′', title: 'สูตรการดิฟ' }, { id: 'drill', num: '✎', title: 'ฝึกพื้นฐาน' }, ...topics.map((t) => ({ id: t.id, num: String(t.num), title: t.title })), { id: 'mock', num: '★', title: 'ข้อสอบจำลอง' }];

function Ring({ pct, num }: { pct: number; num: string }) {
  const full = pct >= 100;
  return (
    <span className={'ring' + (full ? ' full' : '')}>
      <svg viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r="15" className="ring-bg" />
        <motion.circle cx="18" cy="18" r="15" className="ring-fg" style={{ rotate: -90, transformOrigin: '50% 50%' }}
          initial={false} animate={{ pathLength: pct / 100, opacity: pct > 0 ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
      </svg>
      <motion.b key={full ? 'f' : 'n'} initial={{ scale: full ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
        {full ? '✓' : num}
      </motion.b>
    </span>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const p = usePalette(theme);
  const { done, toggle } = useProgress();
  const [teach, setTeach] = useState<number | null>(null);
  const [active, setActive] = useState('');
  const { starts } = useMemo(buildDeck, []);
  const { scrollYProgress } = useScroll();
  const scrollBar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const groups: Record<string, string[]> = useMemo(() => {
    const g: Record<string, string[]> = {};
    topics.forEach((t) => (g[t.id] = [`L-${t.id}`, ...t.practice.map((x) => x.id)]));
    g.mock = mock.map((x) => x.id);
    g.rules = ['L-rules', ...flashIds];
    g.drill = hard.map((h) => h.id);
    return g;
  }, []);
  const pctOf = (id: string) => Math.round((groups[id].filter((x) => done[x]).length / groups[id].length) * 100);
  const allIds = Object.values(groups).flat();
  const overall = Math.round((allIds.filter((x) => done[x]).length / allIds.length) * 100);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const m = /^#teach-?(\d+)?$/.exec(window.location.hash);
    if (m) setTeach(Math.max(0, Number(m[1] || 0)));
    else if (window.location.hash.length > 1) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 300);
    }
  }, []);
  useEffect(() => {
    if (window.innerWidth > 1000 || !active) return;
    document.querySelector(`.toc a[href="#${active}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const words = ['ติวแคล', '3'];

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="scroll-bar" style={{ scaleX: scrollBar }} />
      <header className="topbar">
        <a className="brand" href="#top"><span className="logo">∂</span><span className="txt">ติวแคล 3 ปลายภาค</span></a>
        <div className="overall" title="ความคืบหน้าทั้งหมด">
          <div className="bar"><motion.span animate={{ width: `${overall}%` }} transition={{ duration: 0.6, ease }} /></div>
          <span className="pct">{overall}%</span>
        </div>
        <motion.button className="icon-btn" type="button" onClick={toggleTheme} aria-label="สลับธีมสว่าง/มืด" whileTap={{ scale: 0.9 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.svg key={theme} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.25 }}>
              {theme === 'dark'
                ? <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
                : <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
            </motion.svg>
          </AnimatePresence>
        </motion.button>
        <motion.button className="btn sm" type="button" onClick={() => setTeach(0)} whileTap={{ scale: 0.95 }}><PlayIcon />สอน</motion.button>
      </header>

      <div className="layout" id="top">
        <nav className="toc" aria-label="สารบัญ">
          <span className="eyebrow">แนวข้อสอบ 6 ข้อ</span>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>
              {active === s.id && <motion.span layoutId="toc-pill" className="toc-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <Ring pct={pctOf(s.id)} num={s.num} />
              <span className="toc-t">{s.title}</span>
            </a>
          ))}
        </nav>

        <main className="content">
          <section className="hero">
            <div className="hero-text">
              <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>31100222 Math 3 · ปลายภาค 2568</motion.span>
              <h1>
                {words.map((w, i) => (
                  <motion.span key={w} className="word" initial={{ opacity: 0, y: 40, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease }}>{w}</motion.span>
                ))}
                <motion.span className="word u" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.7, ease }}>ปลายภาค</motion.span>
              </h1>
              <motion.p className="lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }}>
                6 ข้อ 6 แบบ ใช้สัญลักษณ์เดียวกับสไลด์ Unit 11 ในห้อง ทุกหัวข้อมีรูปประกอบที่ลากเล่นได้ ตัวอย่างจากในห้อง และแบบฝึกพร้อมเฉลย
              </motion.p>
              <motion.div className="actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6, ease }}>
                <motion.a className="btn" href="#rules" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>เริ่มทบทวน</motion.a>
                <motion.button type="button" className="btn ghost" onClick={() => setTeach(0)} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}><PlayIcon />โหมดสอนน้อง</motion.button>
              </motion.div>
            </div>
            <motion.div className="hero-fig" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease }}>
              <div className="hero-canvas">
                <Suspense fallback={<div className="canvas-loading">กำลังโหลดรูป 3 มิติ…</div>}>
                  {teach === null && <HeroSurface p={p} />}
                </Suspense>
              </div>
              <div className="hero-cap">
                <span className="dot hl" />ระนาบ z = c ตัดพื้นผิว
                <span className="dot red" />ได้ level curve
                <span className="muted small">ลากเพื่อหมุน</span>
              </div>
            </motion.div>
          </section>

          <section className="map">
            {topics.map((t, i) => (
              <motion.a key={t.id} href={`#${t.id}`} className="map-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease }} whileHover={{ y: -4 }}>
                <span className="topic-num">{t.num}</span>
                <span className="map-t">{t.title}</span>
                <span className="map-p">{groups[t.id].filter((x) => done[x]).length}/{groups[t.id].length}</span>
              </motion.a>
            ))}
          </section>

          <motion.section className="card plan" {...rise}>
            <span className="eyebrow">ลำดับทบทวนประมาณ 3 ชั่วโมง</span>
            <h2>ทบทวนเองก่อน แล้วค่อยติวน้อง</h2>
            <ol>
              {plan.map((x, i) => (
                <motion.li key={x.time} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.45, ease }}>
                  <time>{x.time}</time>
                  <div><b>{x.what}</b>{x.note && <small>{x.note}</small>}</div>
                </motion.li>
              ))}
            </ol>
          </motion.section>

          <FormulaSection done={done} toggle={toggle} onTeach={() => setTeach(starts.rules)} />

          <DrillSection p={p} done={done} toggle={toggle} onTeach={() => setTeach(starts.drill)} />

          {topics.map((t) => (
            <TopicSection key={t.id} topic={t} p={p} done={done} toggle={toggle} onTeach={() => setTeach(starts[t.id])} />
          ))}

          <section className="topic" id="mock">
            <motion.header className="topic-head" {...rise}>
              <span className="topic-num star">★</span>
              <div className="topic-title"><span className="eyebrow">ตามแนวข้อสอบจริง</span><h2>ข้อสอบจำลอง 6 ข้อ</h2></div>
              <motion.button type="button" className="btn ghost sm" whileTap={{ scale: 0.95 }} onClick={() => setTeach(starts.mock)}><PlayIcon /> เปิดเป็นสไลด์</motion.button>
            </motion.header>
            <motion.p className="muted" {...rise}>ข้อละหนึ่งหัวข้อ ตัวเลขชุดใหม่ที่ไม่ซ้ำกับแบบฝึก ตั้งเวลา 30 นาที ทำบนกระดาษให้ครบก่อนเปิดเฉลย</motion.p>
            <motion.div {...rise}><Timer /></motion.div>
            <div className="practice">
              {mock.map((m) => <PracticeCard key={m.id} p={m} label={m.src!} done={!!done[m.id]} onToggle={() => toggle(m.id)} />)}
            </div>
          </section>

          <footer>เนื้อหาเรียงตามสไลด์ Unit 11 วิชา 31100222 · ระนาบสัมผัส (tangent plane) ไม่ออกสอบตามที่อาจารย์แจ้ง</footer>
        </main>
      </div>

      <AnimatePresence>
        {teach !== null && <TeachMode key="deck" start={teach} p={p} onClose={() => setTeach(null)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
