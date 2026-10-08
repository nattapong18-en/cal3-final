import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Tex } from '../lib/Tex';
import type { Palette } from '../lib/hooks';

const t = String.raw;
const ease = [0.2, 0.8, 0.2, 1] as const;

type Pt = { x: number; y: number };

function Edge({ a, b, color, active, dim, delay = 0, width = 2 }: { a: Pt; b: Pt; color: string; active: boolean; dim: boolean; delay?: number; width?: number }) {
  return (
    <motion.path
      d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
      stroke={color}
      strokeLinecap="round"
      fill="none"
      vectorEffect="non-scaling-stroke"
      initial={{ opacity: 0 }}
      animate={{ opacity: dim ? 0.2 : 1, strokeWidth: active ? width + 2.5 : width }}
      transition={{ duration: 0.45, delay: delay * 0.5, ease }}
    />
  );
}

/* ---------------- ข้อ 2: ต้นไม้อนุพันธ์อันดับสอง ---------------- */
type Leaf = { id: string; pos: Pt; tex: string; parent: 'fx' | 'fy'; last: 'x' | 'y'; name: string; how: string };
const leaves: Leaf[] = [
  { id: 'xx', pos: { x: 11, y: 84 }, tex: t`f_{xx}`, parent: 'fx', last: 'x', name: t`\frac{\partial^2 f}{\partial x^2}`, how: 'diff เทียบ x สองครั้ง' },
  { id: 'xy', pos: { x: 37, y: 84 }, tex: t`f_{xy}`, parent: 'fx', last: 'y', name: t`\frac{\partial^2 f}{\partial y\,\partial x}`, how: 'diff เทียบ x ก่อน แล้วจึงเทียบ y' },
  { id: 'yx', pos: { x: 63, y: 84 }, tex: t`f_{yx}`, parent: 'fy', last: 'x', name: t`\frac{\partial^2 f}{\partial x\,\partial y}`, how: 'diff เทียบ y ก่อน แล้วจึงเทียบ x' },
  { id: 'yy', pos: { x: 89, y: 84 }, tex: t`f_{yy}`, parent: 'fy', last: 'y', name: t`\frac{\partial^2 f}{\partial y^2}`, how: 'diff เทียบ y สองครั้ง' },
];
const mids = { fx: { x: 26, y: 48 }, fy: { x: 74, y: 48 } };
const root = { x: 50, y: 12 };

export function DerivTree({ p }: { p: Palette }) {
  const [sel, setSel] = useState('xy');
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (!auto || !inView) return;
    const id = setInterval(() => setSel((s) => leaves[(leaves.findIndex((l) => l.id === s) + 1) % 4].id), 2600);
    return () => clearInterval(id);
  }, [auto, inView]);
  const leaf = leaves.find((l) => l.id === sel)!;
  const col = (v: 'x' | 'y') => (v === 'x' ? p.blue : p.red);
  const pick = (id: string) => { setAuto(false); setSel(id); };

  return (
    <div className="diagram" ref={ref}>
      <div className="dg-stage" style={{ height: 270 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="dg-svg" aria-hidden>
          <Edge a={root} b={mids.fx} color={p.blue} active={leaf.parent === 'fx'} dim={leaf.parent !== 'fx'} />
          <Edge a={root} b={mids.fy} color={p.red} active={leaf.parent === 'fy'} dim={leaf.parent !== 'fy'} />
          {leaves.map((l, i) => (
            <Edge key={l.id} a={mids[l.parent]} b={l.pos} color={col(l.last)} active={l.id === sel} dim={l.id !== sel} delay={0.3 + i * 0.08} />
          ))}
        </svg>
        <Node pos={root} tex="f" big />
        <Node pos={mids.fx} tex="f_x" color={p.blue} dim={leaf.parent !== 'fx'} />
        <Node pos={mids.fy} tex="f_y" color={p.red} dim={leaf.parent !== 'fy'} />
        <EdgeLabel a={root} b={mids.fx} tex={t`\partial_x`} color={p.blue} />
        <EdgeLabel a={root} b={mids.fy} tex={t`\partial_y`} color={p.red} />
        {leaves.map((l) => (
          <Node key={l.id} pos={l.pos} tex={l.tex} color={col(l.last)} active={l.id === sel} dim={l.id !== sel} onClick={() => pick(l.id)} />
        ))}
        <motion.div className="dg-eq" style={{ left: '50%', top: '84%' }}
          animate={{ scale: sel === 'xy' || sel === 'yx' ? [1, 1.35, 1] : 1, color: sel === 'xy' || sel === 'yx' ? p.green : p.muted }}
          transition={{ duration: 0.6 }}>=</motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} className="dg-caption" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <Tex as="span" src={`$${leaf.tex} = ${leaf.name}$`} />
          <span className="muted"> · {leaf.how}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Node({ pos, tex, color, big, active, dim, onClick }: { pos: Pt; tex: string; color?: string; big?: boolean; active?: boolean; dim?: boolean; onClick?: () => void }) {
  const El = onClick ? motion.button : motion.div;
  return (
    <El
      type={onClick ? 'button' : undefined}
      className={'dg-node' + (big ? ' big' : '') + (onClick ? ' clickable' : '')}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, borderColor: color, color }}
      onClick={onClick}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ opacity: dim ? 0.45 : 1, scale: active ? 1.12 : 1 }}
      whileHover={onClick ? { scale: 1.15 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
    >
      <Tex as="span" src={`$${tex}$`} />
    </El>
  );
}

function EdgeLabel({ a, b, tex, color, active, dim }: { a: Pt; b: Pt; tex: string; color: string; active?: boolean; dim?: boolean }) {
  return (
    <motion.div className="dg-elabel" style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%`, color }}
      animate={{ opacity: dim ? 0.3 : 1, scale: active ? 1.08 : 1 }}>
      <Tex as="span" src={`$${tex}$`} />
    </motion.div>
  );
}

/* ---------------- ข้อ 3–4: แผนภาพเพชรของกฎลูกโซ่ ---------------- */
export function ChainDiagram({ p, vars }: { p: Palette; vars: ('x' | 'y' | 'z')[] }) {
  const n = vars.length;
  const colors = [p.blue, p.red, p.green];
  const top = { x: 50, y: 11 }, bot = { x: 50, y: 89 };
  const mid = vars.map((_, i) => ({ x: n === 2 ? [20, 80][i] : [14, 50, 86][i], y: 50 }));
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 2200);
    return () => clearInterval(id);
  }, [playing, inView, n]);
  const pick = (i: number) => { setPlaying(false); setActive(i); };

  return (
    <div className="diagram" ref={ref}>
      <div className="dg-stage" style={{ height: 300 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="dg-svg" aria-hidden>
          {mid.map((m, i) => (
            <g key={i} onClick={() => pick(i)}>
              <Edge a={top} b={m} color={colors[i]} active={i === active} dim={i !== active} delay={i * 0.12} />
              <Edge a={m} b={bot} color={colors[i]} active={i === active} dim={i !== active} delay={0.35 + i * 0.12} />
            </g>
          ))}
        </svg>
        <Node pos={top} tex="w" big />
        <Node pos={bot} tex="t" big />
        {vars.map((v, i) => (
          <Node key={v} pos={mid[i]} tex={v} color={colors[i]} active={i === active} dim={i !== active} onClick={() => pick(i)} />
        ))}
        {vars.map((v, i) => (
          <EdgeLabel key={'u' + v} a={top} b={mid[i]} tex={t`\frac{\partial w}{\partial ${v}}`} color={colors[i]} active={i === active} dim={i !== active} />
        ))}
        {vars.map((v, i) => (
          <EdgeLabel key={'d' + v} a={mid[i]} b={bot} tex={t`\frac{d${v}}{dt}`} color={colors[i]} active={i === active} dim={i !== active} />
        ))}
        <motion.span
          key={active}
          className="dg-dot"
          style={{ background: colors[active] }}
          initial={{ left: `${top.x}%`, top: `${top.y}%`, opacity: 0 }}
          animate={{ left: [`${top.x}%`, `${mid[active].x}%`, `${bot.x}%`], top: [`${top.y}%`, `${mid[active].y}%`, `${bot.y}%`], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, ease: 'easeInOut', times: [0, 0.5, 1] }}
        />
      </div>
      <div className="chain-formula">
        <Tex as="span" src={t`$\dfrac{dw}{dt} =$`} />
        {vars.map((v, i) => (
          <span key={v} className="chain-term-wrap">
            {i > 0 && <span className="plus">+</span>}
            <motion.button type="button" className={'chain-term' + (i === active ? ' on' : '')} onClick={() => pick(i)}
              style={{ ['--c' as string]: colors[i] }}
              animate={{ scale: i === active ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <Tex as="span" src={t`$\dfrac{\partial w}{\partial ${v}}\dfrac{d${v}}{dt}$`} />
            </motion.button>
          </span>
        ))}
      </div>
      <div className="dg-controls">
        <button type="button" className="btn ghost sm" onClick={() => setPlaying((x) => !x)}>{playing ? 'หยุด' : 'เล่นต่อ'}</button>
        <span className="small muted">เส้นทางที่ {active + 1} จาก {n}: คูณตามกิ่ง {vars[active]}</span>
      </div>
    </div>
  );
}

/* ---------------- เครื่องมือวาด 2 มิติ ---------------- */
function useSvgDrag(svgRef: React.RefObject<SVGSVGElement>, toMath: (px: number, py: number) => Pt, onMove: (q: Pt) => void) {
  const dragging = useRef(false);
  const get = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    const vb = svgRef.current!.viewBox.baseVal;
    return toMath(((e.clientX - r.left) / r.width) * vb.width, ((e.clientY - r.top) / r.height) * vb.height);
  };
  return {
    onPointerDown: (e: React.PointerEvent) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); onMove(get(e)); },
    onPointerMove: (e: React.PointerEvent) => { if (dragging.current) onMove(get(e)); },
    onPointerUp: () => { dragging.current = false; },
    onPointerCancel: () => { dragging.current = false; },
  };
}

function Arrow({ x1, y1, x2, y2, color, width = 3, id }: { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; id: string }) {
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <motion.line x1={x1} y1={y1} animate={{ x2, y2 }} initial={false} transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        stroke={color} strokeWidth={width} strokeLinecap="round" markerEnd={`url(#${id})`} />
    </g>
  );
}

function Grid({ W, H, sc, ox, oy, p }: { W: number; H: number; sc: number; ox: number; oy: number; p: Palette }) {
  const xs: number[] = [], ys: number[] = [];
  for (let x = Math.ceil(-ox / sc); x <= (W - ox) / sc; x++) xs.push(x);
  for (let y = Math.ceil(-(H - oy) / sc); y <= oy / sc; y++) ys.push(y);
  return (
    <g>
      {xs.map((x) => <line key={'x' + x} x1={ox + x * sc} y1={0} x2={ox + x * sc} y2={H} stroke={p.line} strokeWidth={1} />)}
      {ys.map((y) => <line key={'y' + y} x1={0} y1={oy - y * sc} x2={W} y2={oy - y * sc} stroke={p.line} strokeWidth={1} />)}
      <line x1={0} y1={oy} x2={W} y2={oy} stroke={p.muted} strokeWidth={1.4} />
      <line x1={ox} y1={0} x2={ox} y2={H} stroke={p.muted} strokeWidth={1.4} />
      <text x={W - 14} y={oy - 8} fill={p.muted} className="svg-lab">x</text>
      <text x={ox + 8} y={16} fill={p.muted} className="svg-lab">y</text>
    </g>
  );
}

const fmt = (v: number, d = 2) => { const r = Number(v.toFixed(d)); return (Object.is(r, -0) ? 0 : r).toFixed(d); };
const signed = (v: number, d = 2) => (v < 0 ? ` - ${fmt(-v, d)}` : ` + ${fmt(v, d)}`);

/* ---------------- ข้อ 5: อนุพันธ์ระบุทิศทาง ---------------- */
export function DirectionalFigure({ p }: { p: Palette }) {
  const W = 600, H = 400, sc = 60, ox = 330, oy = 230;
  const X = (x: number) => ox + x * sc, Y = (y: number) => oy - y * sc;
  const P = { x: -1, y: 1 };
  const g = { x: 4 * P.x, y: 2 * P.y }; // ∇f = 4x i + 2y j
  const gl = Math.hypot(g.x, g.y);
  const [ang, setAng] = useState(Math.atan2(-0.8, 0.6)); // เริ่มที่ Quiz: 3i − 4j
  const u = { x: Math.cos(ang), y: Math.sin(ang) };
  const D = g.x * u.x + g.y * u.y;
  const k = 0.42; // ย่อ ∇f ตอนวาด
  const L = 1.9; // ความยาวที่ใช้วาด u
  const proj = D * k;
  const svg = useRef<SVGSVGElement>(null);
  const drag = useSvgDrag(svg, (px, py) => ({ x: (px - ox) / sc, y: (oy - py) / sc }), (q) => {
    if (Math.hypot(q.x - P.x, q.y - P.y) > 0.15) setAng(Math.atan2(q.y - P.y, q.x - P.x));
  });
  const levels = [0.5, 1, 2, 3, 4.5, 6.5, 9];
  const thetaDeg = (Math.acos(Math.max(-1, Math.min(1, D / gl))) * 180) / Math.PI;
  const presets = [
    { lab: 'ทิศ ∇f', a: Math.atan2(g.y, g.x) },
    { lab: 'ตั้งฉาก', a: Math.atan2(g.y, g.x) + Math.PI / 2 },
    { lab: 'ตรงข้าม', a: Math.atan2(g.y, g.x) + Math.PI },
    { lab: 'Quiz: 3i − 4j', a: Math.atan2(-4, 3) },
  ];
  const pct = (D / gl + 1) / 2;

  return (
    <div className="diagram">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="plot" {...drag} role="img" aria-label="กราฟอนุพันธ์ระบุทิศทาง ลากเพื่อหมุนเวกเตอร์ u">
        <rect width={W} height={H} fill={p.paper2} />
        <Grid W={W} H={H} sc={sc} ox={ox} oy={oy} p={p} />
        {levels.map((c) => (
          <ellipse key={c} cx={X(0)} cy={Y(0)} rx={Math.sqrt(c / 2) * sc} ry={Math.sqrt(c) * sc} fill="none" stroke={p.muted} strokeOpacity={0.45} strokeWidth={1.3} />
        ))}
        <ellipse cx={X(0)} cy={Y(0)} rx={Math.sqrt(3 / 2) * sc} ry={Math.sqrt(3) * sc} fill="none" stroke={p.ink} strokeWidth={1.8} />
        {/* projection of ∇f onto u */}
        <motion.line x1={X(P.x + g.x * k)} y1={Y(P.y + g.y * k)} animate={{ x2: X(P.x + u.x * proj), y2: Y(P.y + u.y * proj) }} initial={false}
          stroke={p.violet} strokeDasharray="5 5" strokeWidth={1.5} transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
        <motion.line x1={X(P.x)} y1={Y(P.y)} animate={{ x2: X(P.x + u.x * proj), y2: Y(P.y + u.y * proj) }} initial={false}
          stroke={p.violet} strokeWidth={7} strokeOpacity={0.35} strokeLinecap="round" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
        <circle cx={X(P.x)} cy={Y(P.y)} r={L * sc} fill="none" stroke={p.red} strokeOpacity={0.18} strokeDasharray="3 6" />
        <Arrow id="ar-g" x1={X(P.x)} y1={Y(P.y)} x2={X(P.x + g.x * k)} y2={Y(P.y + g.y * k)} color={p.blue} width={3.2} />
        <Arrow id="ar-u" x1={X(P.x)} y1={Y(P.y)} x2={X(P.x + u.x * L)} y2={Y(P.y + u.y * L)} color={p.red} width={3.2} />
        <motion.circle animate={{ cx: X(P.x + u.x * L), cy: Y(P.y + u.y * L) }} initial={false} r={13} fill={p.red} fillOpacity={0.15} stroke={p.red} strokeWidth={1.5}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }} style={{ cursor: 'grab' }} />
        <circle cx={X(P.x)} cy={Y(P.y)} r={6} fill={p.ink} stroke={p.paper} strokeWidth={2.5} />
        <text x={X(P.x) + 10} y={Y(P.y) + 22} fill={p.ink} className="svg-lab b">P(−1, 1)</text>
        <text x={X(P.x + g.x * k) - 12} y={Y(P.y + g.y * k) - 12} fill={p.blue} className="svg-lab b">∇f</text>
        <motion.text animate={{ x: X(P.x + u.x * (L + 0.45)) - 6, y: Y(P.y + u.y * (L + 0.45)) + 5 }} initial={false} fill={p.red} className="svg-lab b">u</motion.text>
      </svg>
      <div className="readout-grid">
        <Tex src={t`$(\nabla f)_P = -4\vec i + 2\vec j,\quad |\nabla f| = \sqrt{20} \approx 4.47$`} />
        <Tex src={`$\\vec u = ${fmt(u.x)}\\,\\vec i ${signed(u.y)}\\,\\vec j,\\quad \\theta \\approx ${thetaDeg.toFixed(0)}^\\circ$`} />
        <div className="gauge">
          <div className="gauge-track">
            <motion.div className="gauge-fill" animate={{ width: `${pct * 100}%`, backgroundColor: D >= 0 ? p.green : p.red }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
            <span className="gauge-zero" />
          </div>
          <div className="gauge-labels"><span>−4.47</span><span>0</span><span>4.47</span></div>
        </div>
        <Tex className="big-readout" src={`$D_{\\vec u}f = \\nabla f\\cdot\\vec u = ${fmt(D)}$`} />
        <div className="chips">
          {presets.map((pr) => (
            <motion.button key={pr.lab} type="button" className="chip" whileTap={{ scale: 0.94 }} onClick={() => setAng(pr.a)}>{pr.lab}</motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ข้อ 6: เส้นสัมผัส level curve ---------------- */
export function LevelCurveFigure({ p }: { p: Palette }) {
  const W = 600, H = 380, sc = 52, ox = 300, oy = 190;
  const X = (x: number) => ox + x * sc, Y = (y: number) => oy - y * sc;
  const [P, setP] = useState({ x: -2, y: 1 });
  const svg = useRef<SVGSVGElement>(null);
  const lim = { x: (W / 2) / sc - 0.3, y: (H / 2) / sc - 0.3 };
  const drag = useSvgDrag(svg, (px, py) => ({ x: (px - ox) / sc, y: (oy - py) / sc }), (q) => {
    const s = (v: number, m: number) => Math.max(-m, Math.min(m, Math.round(v * 4) / 4));
    const n = { x: s(q.x, lim.x), y: s(q.y, lim.y) };
    if (n.x !== P.x || n.y !== P.y) setP(n);
  });
  const c = (P.x * P.x) / 4 + P.y * P.y;
  const fx = P.x / 2, fy = 2 * P.y, gl = Math.hypot(fx, fy);
  const tx = gl ? -fy / gl : 1, ty = gl ? fx / gl : 0;
  const k = Math.min(1, 1.9 / (gl || 1));
  const spring = { type: 'spring' as const, stiffness: 380, damping: 30 };
  const r = 13, ux = gl ? fx / gl : 0, uy = gl ? fy / gl : 0;

  return (
    <div className="diagram">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="plot" {...drag} role="img" aria-label="วงรี level curve ลากจุด P ได้">
        <rect width={W} height={H} fill={p.paper2} />
        <Grid W={W} H={H} sc={sc} ox={ox} oy={oy} p={p} />
        {[0.5, 1, 2, 3, 4.5, 6.5].map((cc) => (
          <ellipse key={cc} cx={X(0)} cy={Y(0)} rx={2 * Math.sqrt(cc) * sc} ry={Math.sqrt(cc) * sc} fill="none" stroke={p.muted} strokeOpacity={0.4} strokeWidth={1.2} />
        ))}
        {c > 0 && (
          <>
            <motion.ellipse cx={X(0)} cy={Y(0)} animate={{ rx: 2 * Math.sqrt(c) * sc, ry: Math.sqrt(c) * sc }} initial={false} transition={spring} fill="none" stroke={p.hl} strokeWidth={9} strokeOpacity={0.6} />
            <motion.ellipse cx={X(0)} cy={Y(0)} animate={{ rx: 2 * Math.sqrt(c) * sc, ry: Math.sqrt(c) * sc }} initial={false} transition={spring} fill="none" stroke={p.ink} strokeWidth={1.8} />
          </>
        )}
        {gl > 0 && (
          <>
            <motion.line animate={{ x1: X(P.x - tx * 20), y1: Y(P.y - ty * 20), x2: X(P.x + tx * 20), y2: Y(P.y + ty * 20) }} initial={false} transition={spring}
              stroke={p.red} strokeWidth={2.4} strokeDasharray="8 6" />
            <motion.path animate={{ d: `M ${X(P.x) + ux * r} ${Y(P.y) - uy * r} L ${X(P.x) + ux * r + tx * r} ${Y(P.y) - uy * r - ty * r} L ${X(P.x) + tx * r} ${Y(P.y) - ty * r}` }}
              initial={false} transition={spring} fill="none" stroke={p.ink} strokeWidth={1.4} />
            <Arrow id="ar-n" x1={X(P.x)} y1={Y(P.y)} x2={X(P.x + fx * k)} y2={Y(P.y + fy * k)} color={p.blue} width={3.2} />
            <motion.text animate={{ x: X(P.x + fx * k) + 8, y: Y(P.y + fy * k) - 8 }} initial={false} transition={spring} fill={p.blue} className="svg-lab b">∇f</motion.text>
          </>
        )}
        <motion.circle animate={{ cx: X(P.x), cy: Y(P.y) }} initial={false} transition={spring} r={16} fill={p.ink} fillOpacity={0.08} />
        <motion.circle animate={{ cx: X(P.x), cy: Y(P.y) }} initial={false} transition={spring} r={7} fill={p.ink} stroke={p.paper} strokeWidth={2.5} style={{ cursor: 'grab' }} />
        <motion.text animate={{ x: X(P.x) + 12, y: Y(P.y) + 24 }} initial={false} transition={spring} fill={p.ink} className="svg-lab b">P({fmt(P.x)}, {fmt(P.y)})</motion.text>
      </svg>
      <div className="readout-grid">
        <Tex src={`$\\text{level curve: } \\dfrac{x^2}{4} + y^2 = ${fmt(c)}$`} />
        <Tex src={`$\\vec N = (\\nabla f)_P = ${fmt(fx)}\\,\\vec i ${signed(fy)}\\,\\vec j$`} />
        {gl > 0
          ? <Tex className="big-readout" src={`$${fmt(fx)}(x ${signed(-P.x)}) ${signed(fy)}(y ${signed(-P.y)}) = 0$`} />
          : <p className="muted">ที่จุดกำเนิด ∇f = 0 จึงไม่มีเส้นสัมผัส</p>}
        <div className="chips">
          <motion.button type="button" className="chip" whileTap={{ scale: 0.94 }} onClick={() => setP({ x: -2, y: 1 })}>Example 2: (−2, 1)</motion.button>
          <motion.button type="button" className="chip" whileTap={{ scale: 0.94 }} onClick={() => setP({ x: 2, y: 0 })}>(2, 0)</motion.button>
          <motion.button type="button" className="chip" whileTap={{ scale: 0.94 }} onClick={() => setP({ x: 0, y: 1.5 })}>(0, 1.5)</motion.button>
        </div>
      </div>
    </div>
  );
}
