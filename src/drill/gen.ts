// ตัวสุ่มโจทย์ดิฟ: แต่ละแม่แบบสร้างโจทย์ คำตอบ ตัวเลือกผิด (พร้อมเหตุผลที่ผิด) และวิธีทำ
// ฟังก์ชันใน check ใช้ตรวจความถูกต้องด้วยตัวเลข (ดู scripts/check-gen.ts)

export type Cat = 'chain' | 'explog' | 'trig' | 'product' | 'quotient' | 'partial';

export const catLabel: Record<Cat, string> = {
  chain: 'ลูกโซ่ + ยกกำลัง',
  explog: 'e และ ln',
  trig: 'sin cos',
  product: 'ผลคูณ',
  quotient: 'ผลหาร',
  partial: 'อนุพันธ์ย่อย',
};

type Fn = (x: number, y: number) => number;
export type Wrong = { tex: string; why: string; fn: Fn };
export type Problem = {
  cat: Cat;
  q: string; // โจทย์เต็ม เช่น \frac{d}{dx}\left(...\right)
  correct: string;
  wrongs: Wrong[];
  steps: string[]; // "หัวข้อ::รายละเอียด"
  f: Fn;
  d: Fn;
  wrt: 'x' | 'y';
};

const R = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

/** ค่าสัมประสิทธิ์หน้าพจน์: 1 → ไม่เขียน, -1 → "-" */
const co = (k: number, s: string) => (s === '' ? `${k}` : k === 1 ? s : k === -1 ? `-${s}` : `${k}${s}`);
const pw = (v: string, n: number) => (n === 1 ? v : n === 0 ? '' : `${v}^{${n}}`);
/** (ฐาน)^n โดยละวงเล็บเมื่อ n = 1 */
const pp = (base: string, n: number) => (n === 1 ? base : `\\left(${base}\\right)^{${n}}`);
const sgn = (k: number) => (k < 0 ? `- ${-k}` : `+ ${k}`);

type Tpl = () => Problem;

/* ---------------- ลูกโซ่ + ยกกำลัง ---------------- */
const chainPow: Tpl = () => {
  const v = pick(['x', 't']), b = R(1, 6), n = R(3, 5);
  let a = R(2, 5);
  while (a === n) a = R(2, 5);
  const inner = `${a}${v} + ${b}`;
  const F: Fn = (x) => (a * x + b) ** n;
  return {
    cat: 'chain', wrt: 'x',
    q: `\\frac{d}{d${v}}${pp(inner, n)}`,
    correct: `${n * a}${pp(inner, n - 1)}`,
    wrongs: [
      { tex: `${n}${pp(inner, n - 1)}`, why: `ลืมคูณอนุพันธ์ของข้างใน ($\\frac{d}{d${v}}(${inner}) = ${a}$)`, fn: (x) => n * (a * x + b) ** (n - 1) },
      { tex: `${n * a}${pp(inner, n)}`, why: 'ดึงเลขชี้กำลังลงมาแล้ว แต่ลืมลดกำลังลง 1', fn: (x) => n * a * (a * x + b) ** n },
      { tex: `${a}${pp(inner, n - 1)}`, why: `ลืมดึงเลขชี้กำลัง ${n} ลงมาคูณ`, fn: (x) => a * (a * x + b) ** (n - 1) },
    ],
    steps: [
      `มองเป็นฟังก์ชันซ้อน::ข้างนอกคือ $(\\square)^{${n}}$ ข้างในคือ $${inner}$`,
      `diff ข้างนอก (คงข้างในไว้)::ดึง ${n} ลงมา ลดกำลังเป็น ${n - 1}: $${n}${pp(inner, n - 1)}$`,
      `คูณ diff ข้างใน::$\\frac{d}{d${v}}(${inner}) = ${a}$ ได้ $${n}\\cdot ${a}${pp(inner, n - 1)} = ${n * a}${pp(inner, n - 1)}$`,
    ],
    f: F, d: (x) => n * a * (a * x + b) ** (n - 1),
  };
};

const chainRoot: Tpl = () => {
  const v = pick(['x', 't']), a = R(2, 5), b = R(1, 9);
  const inner = `${co(a, pw(v, 2))} + ${b}`;
  return {
    cat: 'chain', wrt: 'x',
    q: `\\frac{d}{d${v}}\\sqrt{${inner}}`,
    correct: `\\frac{${co(a, v)}}{\\sqrt{${inner}}}`,
    wrongs: [
      { tex: `\\frac{1}{2\\sqrt{${inner}}}`, why: `ลืมคูณอนุพันธ์ของข้างใน ($${co(2 * a, v)}$)`, fn: (x) => 1 / (2 * Math.sqrt(a * x * x + b)) },
      { tex: `\\frac{${co(2 * a, v)}}{\\sqrt{${inner}}}`, why: 'ลืมคูณ ½ ที่ได้จากการดึงเลขชี้กำลัง ½ ลงมา', fn: (x) => (2 * a * x) / Math.sqrt(a * x * x + b) },
      { tex: `${co(a, v)}\\sqrt{${inner}}`, why: 'กำลัง ½ ลดลง 1 ต้องได้ −½ ซึ่งคือการหารด้วยราก ไม่ใช่คูณ', fn: (x) => a * x * Math.sqrt(a * x * x + b) },
    ],
    steps: [
      `เขียนรากเป็นเลขยกกำลัง::$\\sqrt{${inner}} = \\left(${inner}\\right)^{1/2}$`,
      `diff ข้างนอก::ดึง ½ ลงมา ลดกำลังเป็น −½: $\\frac12\\left(${inner}\\right)^{-1/2} = \\frac{1}{2\\sqrt{${inner}}}$`,
      `คูณ diff ข้างใน แล้วตัดทอน::$\\frac{d}{d${v}}(${inner}) = ${co(2 * a, v)}$ ได้ $\\frac{${co(2 * a, v)}}{2\\sqrt{${inner}}} = \\frac{${co(a, v)}}{\\sqrt{${inner}}}$`,
    ],
    f: (x) => Math.sqrt(a * x * x + b), d: (x) => (a * x) / Math.sqrt(a * x * x + b),
  };
};

/* ---------------- e และ ln ---------------- */
const expChain: Tpl = () => {
  const v = pick(['x', 't']), a = pick([2, 3, -2, 4, 5]);
  const ex = co(a, pw(v, 2));
  return {
    cat: 'explog', wrt: 'x',
    q: `\\frac{d}{d${v}}\\,e^{${ex}}`,
    correct: `${co(2 * a, v)}\\,e^{${ex}}`,
    wrongs: [
      { tex: `e^{${ex}}`, why: `$e^u$ diff แล้วได้ตัวเดิมก็จริง แต่ต้องคูณ $u' = ${co(2 * a, v)}$ ด้วย`, fn: (x) => Math.exp(a * x * x) },
      { tex: `${co(a, pw(v, 2))}\\,e^{${ex} - 1}`, why: 'ใช้กฎยกกำลังกับ e ไม่ได้ เพราะตัวแปรอยู่ที่เลขชี้กำลัง ไม่ใช่ที่ฐาน', fn: (x) => a * x * x * Math.exp(a * x * x - 1) },
      { tex: `${2 * a}\\,e^{${ex}}`, why: `diff ข้างในผิด: $\\frac{d}{d${v}}(${ex}) = ${co(2 * a, v)}$ ยังต้องมี $${v}$`, fn: (x) => 2 * a * Math.exp(a * x * x) },
    ],
    steps: [
      `สูตร::$\\frac{d}{d${v}}e^{u} = e^{u}\\cdot u'$ โดย $u = ${ex}$`,
      `หา u'::$u' = ${co(2 * a, v)}$`,
      `ประกอบคำตอบ::$${co(2 * a, v)}\\,e^{${ex}}$`,
    ],
    f: (x) => Math.exp(a * x * x), d: (x) => 2 * a * x * Math.exp(a * x * x),
  };
};

const lnChain: Tpl = () => {
  const v = pick(['x', 't']), a = R(2, 5), b = R(1, 7);
  const inner = `${co(a, pw(v, 2))} + ${b}`;
  return {
    cat: 'explog', wrt: 'x',
    q: `\\frac{d}{d${v}}\\ln\\left(${inner}\\right)`,
    correct: `\\frac{${co(2 * a, v)}}{${inner}}`,
    wrongs: [
      { tex: `\\frac{1}{${inner}}`, why: `ลืมคูณอนุพันธ์ของข้างใน: $\\frac{d}{d${v}}\\ln u = \\frac{u'}{u}$`, fn: (x) => 1 / (a * x * x + b) },
      { tex: `\\frac{1}{${co(2 * a, v)}}`, why: 'เอาอนุพันธ์ของข้างในไปไว้ตัวส่วน ต้องเป็น u′ อยู่บน และ u อยู่ล่าง', fn: (x) => 1 / (2 * a * x) },
      { tex: `${co(2 * a, v)}\\ln\\left(${inner}\\right)`, why: 'ln diff แล้วต้องกลายเป็นเศษส่วน ไม่ได้คง ln ไว้', fn: (x) => 2 * a * x * Math.log(a * x * x + b) },
    ],
    steps: [
      `สูตร::$\\frac{d}{d${v}}\\ln u = \\frac{u'}{u}$ โดย $u = ${inner}$`,
      `หา u'::$u' = ${co(2 * a, v)}$`,
      `ประกอบคำตอบ::$\\frac{${co(2 * a, v)}}{${inner}}$`,
    ],
    f: (x) => Math.log(a * x * x + b), d: (x) => (2 * a * x) / (a * x * x + b),
  };
};

/* ---------------- sin cos ---------------- */
const cosChain: Tpl = () => {
  const v = pick(['x', 't']), a = R(2, 5);
  const inner = co(a, pw(v, 2));
  return {
    cat: 'trig', wrt: 'x',
    q: `\\frac{d}{d${v}}\\cos\\left(${inner}\\right)`,
    correct: `-${co(2 * a, v)}\\sin\\left(${inner}\\right)`,
    wrongs: [
      { tex: `${co(2 * a, v)}\\sin\\left(${inner}\\right)`, why: 'cos diff แล้วได้ −sin ต้องมีเครื่องหมายลบ', fn: (x) => 2 * a * x * Math.sin(a * x * x) },
      { tex: `-\\sin\\left(${inner}\\right)`, why: `ลืมคูณอนุพันธ์ของข้างใน ($${co(2 * a, v)}$)`, fn: (x) => -Math.sin(a * x * x) },
      { tex: `-${co(2 * a, v)}\\cos\\left(${inner}\\right)`, why: 'cos diff แล้วต้องกลายเป็น sin ไม่ใช่ cos', fn: (x) => -2 * a * x * Math.cos(a * x * x) },
    ],
    steps: [
      `diff ข้างนอก::$\\cos(\\square) \\to -\\sin(\\square)$ ได้ $-\\sin\\left(${inner}\\right)$`,
      `คูณ diff ข้างใน::$\\frac{d}{d${v}}(${inner}) = ${co(2 * a, v)}$`,
      `ประกอบคำตอบ::$-${co(2 * a, v)}\\sin\\left(${inner}\\right)$`,
    ],
    f: (x) => Math.cos(a * x * x), d: (x) => -2 * a * x * Math.sin(a * x * x),
  };
};

const sinPow: Tpl = () => {
  const v = pick(['x', 't']), n = R(2, 4);
  const inner = pw(v, n);
  const din = co(n, pw(v, n - 1));
  return {
    cat: 'trig', wrt: 'x',
    q: `\\frac{d}{d${v}}\\sin\\left(${inner}\\right)`,
    correct: `${din}\\cos\\left(${inner}\\right)`,
    wrongs: [
      { tex: `\\cos\\left(${inner}\\right)`, why: `ลืมคูณอนุพันธ์ของข้างใน ($${din}$)`, fn: (x) => Math.cos(x ** n) },
      { tex: `-${din}\\cos\\left(${inner}\\right)`, why: 'sin diff ได้ +cos เครื่องหมายลบมีแค่ตอน diff cos', fn: (x) => -n * x ** (n - 1) * Math.cos(x ** n) },
      { tex: `${din}\\sin\\left(${inner}\\right)`, why: 'sin diff แล้วต้องกลายเป็น cos', fn: (x) => n * x ** (n - 1) * Math.sin(x ** n) },
    ],
    steps: [
      `diff ข้างนอก::$\\sin(\\square) \\to \\cos(\\square)$ ได้ $\\cos\\left(${inner}\\right)$`,
      `คูณ diff ข้างใน::$\\frac{d}{d${v}}${inner} = ${din}$`,
      `ประกอบคำตอบ::$${din}\\cos\\left(${inner}\\right)$`,
    ],
    f: (x) => Math.sin(x ** n), d: (x) => n * x ** (n - 1) * Math.cos(x ** n),
  };
};

/* ---------------- ผลคูณ ---------------- */
const productExp: Tpl = () => {
  const v = pick(['x', 't']), n = R(2, 4), a = R(2, 5);
  const P = pw(v, n), dP = co(n, pw(v, n - 1));
  return {
    cat: 'product', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(${P}\\,e^{${a}${v}}\\right)`,
    correct: `${dP}\\,e^{${a}${v}} + ${a}${P}\\,e^{${a}${v}}`,
    wrongs: [
      { tex: `${co(n * a, pw(v, n - 1))}\\,e^{${a}${v}}`, why: 'ผลคูณห้าม diff แยกแล้วเอามาคูณกัน ต้องใช้ (uv)′ = u′v + uv′', fn: (x) => n * a * x ** (n - 1) * Math.exp(a * x) },
      { tex: `${dP}\\,e^{${a}${v}}`, why: 'ใช้ product rule ไม่ครบ ขาดเทอม uv′', fn: (x) => n * x ** (n - 1) * Math.exp(a * x) },
      { tex: `${dP}\\,e^{${a}${v}} + ${P}\\,e^{${a}${v}}`, why: `ลืมคูณ ${a} ตอน diff $e^{${a}${v}}$ (ลูกโซ่)`, fn: (x) => n * x ** (n - 1) * Math.exp(a * x) + x ** n * Math.exp(a * x) },
    ],
    steps: [
      `แยกเป็น u กับ v::$u = ${P}$ และ $v = e^{${a}${v}}$`,
      `diff แต่ละตัว::$u' = ${dP}$ และ $v' = ${a}e^{${a}${v}}$ (ลูกโซ่: คูณ ${a})`,
      `ใช้ (uv)′ = u′v + uv′::$${dP}\\,e^{${a}${v}} + ${a}${P}\\,e^{${a}${v}}$`,
    ],
    f: (x) => x ** n * Math.exp(a * x), d: (x) => n * x ** (n - 1) * Math.exp(a * x) + a * x ** n * Math.exp(a * x),
  };
};

const productTrig: Tpl = () => {
  const v = pick(['x', 't']), n = R(2, 3), a = R(2, 4);
  const P = pw(v, n), dP = co(n, pw(v, n - 1));
  return {
    cat: 'product', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(${P}\\sin ${a}${v}\\right)`,
    correct: `${dP}\\sin ${a}${v} + ${a}${P}\\cos ${a}${v}`,
    wrongs: [
      { tex: `${co(n * a, pw(v, n - 1))}\\cos ${a}${v}`, why: 'diff แยกแล้วเอามาคูณกันไม่ได้ ต้องใช้ u′v + uv′', fn: (x) => n * a * x ** (n - 1) * Math.cos(a * x) },
      { tex: `${dP}\\sin ${a}${v} - ${a}${P}\\cos ${a}${v}`, why: 'sin diff ได้ +cos เครื่องหมายต้องเป็นบวก', fn: (x) => n * x ** (n - 1) * Math.sin(a * x) - a * x ** n * Math.cos(a * x) },
      { tex: `${dP}\\sin ${a}${v} + ${P}\\cos ${a}${v}`, why: `ลืมคูณ ${a} ตอน diff $\\sin ${a}${v}$ (ลูกโซ่)`, fn: (x) => n * x ** (n - 1) * Math.sin(a * x) + x ** n * Math.cos(a * x) },
    ],
    steps: [
      `แยกเป็น u กับ v::$u = ${P}$ และ $v = \\sin ${a}${v}$`,
      `diff แต่ละตัว::$u' = ${dP}$ และ $v' = ${a}\\cos ${a}${v}$`,
      `ใช้ (uv)′ = u′v + uv′::$${dP}\\sin ${a}${v} + ${a}${P}\\cos ${a}${v}$`,
    ],
    f: (x) => x ** n * Math.sin(a * x), d: (x) => n * x ** (n - 1) * Math.sin(a * x) + a * x ** n * Math.cos(a * x),
  };
};

const productLn: Tpl = () => {
  const v = pick(['x', 't']), n = R(2, 4);
  const P = pw(v, n), dP = co(n, pw(v, n - 1));
  return {
    cat: 'product', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(${P}\\ln ${v}\\right)`,
    correct: `${dP}\\ln ${v} + ${pw(v, n - 1)}`,
    wrongs: [
      { tex: `${co(n, pw(v, n - 2))}`, why: 'diff แยกแล้วเอามาคูณกันไม่ได้ ต้องใช้ u′v + uv′', fn: (x) => n * x ** (n - 2) },
      { tex: `${dP}\\ln ${v}`, why: 'ใช้ product rule ไม่ครบ ขาดเทอม uv′', fn: (x) => n * x ** (n - 1) * Math.log(x) },
      { tex: `${dP}\\ln ${v} + ${P}`, why: `$\\frac{d}{d${v}}\\ln ${v} = \\frac{1}{${v}}$ ไม่ใช่ 1`, fn: (x) => n * x ** (n - 1) * Math.log(x) + x ** n },
    ],
    steps: [
      `แยกเป็น u กับ v::$u = ${P}$ และ $v = \\ln ${v}$`,
      `diff แต่ละตัว::$u' = ${dP}$ และ $v' = \\frac{1}{${v}}$`,
      `ใช้ (uv)′ = u′v + uv′ แล้วตัดทอน::$${dP}\\ln ${v} + ${P}\\cdot\\frac{1}{${v}} = ${dP}\\ln ${v} + ${pw(v, n - 1)}$`,
    ],
    f: (x) => x ** n * Math.log(x), d: (x) => n * x ** (n - 1) * Math.log(x) + x ** (n - 1),
  };
};

/* ---------------- ผลหาร ---------------- */
const quotLinear: Tpl = () => {
  const v = pick(['x', 't']);
  let a = 0, b = 0, c = 0, d = 0;
  do { a = R(1, 5); b = R(-5, 5); c = R(1, 4); d = R(1, 6); } while (a * d - b * c === 0 || b === 0);
  const num = `${co(a, v)} ${sgn(b)}`, den = `${co(c, v)} + ${d}`, k = a * d - b * c;
  return {
    cat: 'quotient', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(\\frac{${num}}{${den}}\\right)`,
    correct: `\\frac{${k}}{\\left(${den}\\right)^2}`,
    wrongs: [
      { tex: `\\frac{${-k}}{\\left(${den}\\right)^2}`, why: 'สลับลำดับตัวเศษ ต้องเป็น "ล่าง diff บน ลบ บน diff ล่าง"', fn: (x) => -k / (c * x + d) ** 2 },
      { tex: `\\frac{${a}}{${c}}`, why: 'ผลหารห้าม diff บนหารด้วย diff ล่าง ต้องใช้สูตร quotient', fn: () => a / c },
      { tex: `\\frac{${k}}{${den}}`, why: 'ลืมยกกำลังสองตัวส่วน', fn: (x) => k / (c * x + d) },
    ],
    steps: [
      `ตั้งบนกับล่าง::บน $= ${num}$ (diff ได้ ${a}) และ ล่าง $= ${den}$ (diff ได้ ${c})`,
      `แทนสูตร ล่าง·diff บน − บน·diff ล่าง::$$\\frac{(${den})(${a}) - (${num})(${c})}{\\left(${den}\\right)^2}$$`,
      `กระจายตัวเศษ::พจน์ที่มี $${v}$ หักล้างกัน เหลือ $${a}\\cdot${d} - (${b})\\cdot${c} = ${k}$ จึงได้ $\\frac{${k}}{\\left(${den}\\right)^2}$`,
    ],
    f: (x) => (a * x + b) / (c * x + d), d: (x) => k / (c * x + d) ** 2,
  };
};

const quotTrig: Tpl = () => {
  const v = pick(['x', 't']);
  const useSin = Math.random() < 0.5;
  const T = useSin ? `\\sin ${v}` : `\\cos ${v}`;
  const dT = useSin ? `\\cos ${v}` : `-\\sin ${v}`;
  const correct = useSin ? `\\frac{${v}\\cos ${v} - \\sin ${v}}{${v}^2}` : `\\frac{-${v}\\sin ${v} - \\cos ${v}}{${v}^2}`;
  const sw = useSin ? `\\frac{\\sin ${v} - ${v}\\cos ${v}}{${v}^2}` : `\\frac{\\cos ${v} + ${v}\\sin ${v}}{${v}^2}`;
  const tg = (x: number) => (useSin ? Math.sin(x) : Math.cos(x));
  const dtg = (x: number) => (useSin ? Math.cos(x) : -Math.sin(x));
  return {
    cat: 'quotient', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(\\frac{${T}}{${v}}\\right)`,
    correct,
    wrongs: [
      { tex: sw, why: 'สลับลำดับตัวเศษ ต้องเป็น "ล่าง diff บน ลบ บน diff ล่าง"', fn: (x) => -(x * dtg(x) - tg(x)) / x ** 2 },
      { tex: dT, why: 'ผลหารห้าม diff บนหารด้วย diff ล่าง', fn: dtg },
      { tex: useSin ? `\\frac{${v}\\cos ${v} + \\sin ${v}}{${v}^2}` : `\\frac{${v}\\sin ${v} - \\cos ${v}}{${v}^2}`, why: useSin ? 'ตรงกลางต้องเป็นเครื่องหมายลบ' : 'cos diff ได้ −sin ระวังเครื่องหมาย', fn: (x) => (useSin ? (x * Math.cos(x) + Math.sin(x)) / x ** 2 : (x * Math.sin(x) - Math.cos(x)) / x ** 2) },
    ],
    steps: [
      `ตั้งบนกับล่าง::บน $= ${T}$ (diff ได้ $${dT}$) และ ล่าง $= ${v}$ (diff ได้ 1)`,
      `แทนสูตร::$$\\frac{${v}\\cdot(${dT}) - ${T}\\cdot 1}{${v}^2}$$`,
      `จัดรูป::$${correct}$`,
    ],
    f: (x) => tg(x) / x, d: (x) => (x * dtg(x) - tg(x)) / x ** 2,
  };
};

const quotExp: Tpl = () => {
  const v = pick(['x', 't']), a = R(2, 4);
  return {
    cat: 'quotient', wrt: 'x',
    q: `\\frac{d}{d${v}}\\left(\\frac{e^{${a}${v}}}{${v}}\\right)`,
    correct: `\\frac{${a}${v}\\,e^{${a}${v}} - e^{${a}${v}}}{${v}^2}`,
    wrongs: [
      { tex: `\\frac{e^{${a}${v}} - ${a}${v}\\,e^{${a}${v}}}{${v}^2}`, why: 'สลับลำดับตัวเศษ ต้องเป็น "ล่าง diff บน ลบ บน diff ล่าง"', fn: (x) => (Math.exp(a * x) - a * x * Math.exp(a * x)) / x ** 2 },
      { tex: `${a}e^{${a}${v}}`, why: 'ผลหารห้าม diff บนหารด้วย diff ล่าง', fn: (x) => a * Math.exp(a * x) },
      { tex: `\\frac{${v}\\,e^{${a}${v}} - e^{${a}${v}}}{${v}^2}`, why: `ลืมคูณ ${a} ตอน diff $e^{${a}${v}}$`, fn: (x) => (x * Math.exp(a * x) - Math.exp(a * x)) / x ** 2 },
    ],
    steps: [
      `ตั้งบนกับล่าง::บน $= e^{${a}${v}}$ (diff ได้ $${a}e^{${a}${v}}$) และ ล่าง $= ${v}$ (diff ได้ 1)`,
      `แทนสูตร::$$\\frac{${v}\\cdot ${a}e^{${a}${v}} - e^{${a}${v}}\\cdot 1}{${v}^2}$$`,
      `จัดรูป::$\\frac{${a}${v}\\,e^{${a}${v}} - e^{${a}${v}}}{${v}^2}$`,
    ],
    f: (x) => Math.exp(a * x) / x, d: (x) => (a * x * Math.exp(a * x) - Math.exp(a * x)) / x ** 2,
  };
};

/* ---------------- อนุพันธ์ย่อย (หลายกฎซ้อน) ---------------- */
const partialExp: Tpl = () => {
  const a = R(2, 4), wrt = pick(['x', 'y'] as const);
  const ex = `${a}xy^2`;
  const E = (x: number, y: number) => Math.exp(a * x * y * y);
  const isX = wrt === 'x';
  return {
    cat: 'partial', wrt,
    q: `\\frac{\\partial}{\\partial ${wrt}}\\,e^{${ex}}`,
    correct: isX ? `${a}y^2e^{${ex}}` : `${2 * a}xy\\,e^{${ex}}`,
    wrongs: [
      { tex: `e^{${ex}}`, why: 'ลืมคูณอนุพันธ์ของเลขชี้กำลัง', fn: E },
      { tex: isX ? `${2 * a}xy\\,e^{${ex}}` : `${a}y^2e^{${ex}}`, why: `นี่คืออนุพันธ์เทียบ ${isX ? 'y' : 'x'} โจทย์ถามเทียบ ${wrt}`, fn: (x, y) => (isX ? 2 * a * x * y : a * y * y) * E(x, y) },
      { tex: `${ex}\\,e^{${ex} - 1}`, why: 'ใช้กฎยกกำลังกับ e ไม่ได้', fn: (x, y) => a * x * y * y * Math.exp(a * x * y * y - 1) },
    ],
    steps: [
      `มอง${isX ? ' y ' : ' x '}เป็นค่าคงที่::$e^{u}$ diff ได้ $e^{u}\\cdot\\frac{\\partial u}{\\partial ${wrt}}$ โดย $u = ${ex}$`,
      `diff เลขชี้กำลัง::$\\frac{\\partial}{\\partial ${wrt}}(${ex}) = ${isX ? `${a}y^2` : `${2 * a}xy`}$`,
      `ประกอบคำตอบ::$${isX ? `${a}y^2e^{${ex}}` : `${2 * a}xy\\,e^{${ex}}`}$`,
    ],
    f: E, d: (x, y) => (isX ? a * y * y : 2 * a * x * y) * E(x, y),
  };
};

const partialLn: Tpl = () => {
  const a = R(2, 5), wrt = pick(['x', 'y'] as const);
  const inner = `x^2 + ${a}y^2`;
  const isX = wrt === 'x';
  const den = (x: number, y: number) => x * x + a * y * y;
  return {
    cat: 'partial', wrt,
    q: `\\frac{\\partial}{\\partial ${wrt}}\\ln\\left(${inner}\\right)`,
    correct: isX ? `\\frac{2x}{${inner}}` : `\\frac{${2 * a}y}{${inner}}`,
    wrongs: [
      { tex: `\\frac{1}{${inner}}`, why: 'ลืมคูณอนุพันธ์ของข้างใน', fn: (x, y) => 1 / den(x, y) },
      { tex: isX ? `\\frac{${2 * a}y}{${inner}}` : `\\frac{2x}{${inner}}`, why: `diff ข้างในเทียบตัวแปรผิดตัว โจทย์ถามเทียบ ${wrt}`, fn: (x, y) => (isX ? 2 * a * y : 2 * x) / den(x, y) },
      { tex: `\\frac{2x + ${2 * a}y}{${inner}}`, why: `อนุพันธ์ย่อยต้อง diff เฉพาะ ${wrt} ตัวแปรอีกตัวเป็นค่าคงที่ diff ได้ 0`, fn: (x, y) => (2 * x + 2 * a * y) / den(x, y) },
    ],
    steps: [
      `สูตร::$\\frac{\\partial}{\\partial ${wrt}}\\ln u = \\frac{1}{u}\\cdot\\frac{\\partial u}{\\partial ${wrt}}$ โดย $u = ${inner}$`,
      `diff ข้างในเทียบ ${wrt}::${isX ? `$x^2 \\to 2x$ และ $${a}y^2 \\to 0$` : `$x^2 \\to 0$ และ $${a}y^2 \\to ${2 * a}y$`}`,
      `ประกอบคำตอบ::$${isX ? `\\frac{2x}{${inner}}` : `\\frac{${2 * a}y}{${inner}}`}$`,
    ],
    f: (x, y) => Math.log(den(x, y)), d: (x, y) => (isX ? 2 * x : 2 * a * y) / den(x, y),
  };
};

const partialProductTrig: Tpl = () => {
  const a = R(2, 4);
  const S = (x: number, y: number) => Math.sin(a * x * y), C = (x: number, y: number) => Math.cos(a * x * y);
  return {
    cat: 'partial', wrt: 'y',
    q: `\\frac{\\partial}{\\partial y}\\left(y\\sin ${a}xy\\right)`,
    correct: `\\sin ${a}xy + ${a}xy\\cos ${a}xy`,
    wrongs: [
      { tex: `${a}xy\\cos ${a}xy`, why: 'y อยู่สองที่ ต้องใช้ product rule ขาดเทอม u′v', fn: (x, y) => a * x * y * C(x, y) },
      { tex: `\\sin ${a}xy + y\\cos ${a}xy`, why: `ลืมคูณอนุพันธ์ของข้างใน $\\frac{\\partial}{\\partial y}(${a}xy) = ${a}x$`, fn: (x, y) => S(x, y) + y * C(x, y) },
      { tex: `\\sin ${a}xy - ${a}xy\\cos ${a}xy`, why: 'sin diff ได้ +cos', fn: (x, y) => S(x, y) - a * x * y * C(x, y) },
    ],
    steps: [
      `y อยู่สองที่::ใช้ product rule โดย $u = y$ และ $v = \\sin ${a}xy$ (x คงที่)`,
      `diff แต่ละตัว::$u_y = 1$ และ $v_y = \\cos ${a}xy\\cdot ${a}x$`,
      `ประกอบคำตอบ::$(1)\\sin ${a}xy + y\\cdot ${a}x\\cos ${a}xy = \\sin ${a}xy + ${a}xy\\cos ${a}xy$`,
    ],
    f: (x, y) => y * S(x, y), d: (x, y) => S(x, y) + a * x * y * C(x, y),
  };
};

const partialQuot: Tpl = () => {
  const a = R(2, 5), wrt = pick(['x', 'y'] as const);
  const den = `x + ${a}y`;
  const D = (x: number, y: number) => (x + a * y) ** 2;
  const isX = wrt === 'x';
  return {
    cat: 'partial', wrt,
    q: `\\frac{\\partial}{\\partial ${wrt}}\\left(\\frac{x}{${den}}\\right)`,
    correct: isX ? `\\frac{${a}y}{\\left(${den}\\right)^2}` : `\\frac{-${a}x}{\\left(${den}\\right)^2}`,
    wrongs: [
      { tex: isX ? `\\frac{-${a}y}{\\left(${den}\\right)^2}` : `\\frac{${a}x}{\\left(${den}\\right)^2}`, why: 'สลับลำดับตัวเศษ ต้องเป็น "ล่าง diff บน ลบ บน diff ล่าง"', fn: (x, y) => (isX ? -a * y : a * x) / D(x, y) },
      { tex: isX ? `\\frac{1}{${den}}` : `0`, why: isX ? 'ตัวส่วนก็มี x ด้วย ต้องใช้สูตรผลหาร ไม่ใช่ diff แค่ตัวเศษ' : 'ตัวเศษไม่มี y ก็จริง แต่ตัวส่วนมี y จึงไม่ได้ 0', fn: (x, y) => (isX ? 1 / (x + a * y) : 0) },
      { tex: isX ? `\\frac{${a}y}{${den}}` : `\\frac{-${a}x}{${den}}`, why: 'ลืมยกกำลังสองตัวส่วน', fn: (x, y) => (isX ? a * y : -a * x) / (x + a * y) },
    ],
    steps: [
      `ตั้งบนกับล่าง::บน $= x$ และ ล่าง $= ${den}$ ${isX ? '(diff เทียบ x: บน → 1, ล่าง → 1)' : `(diff เทียบ y: บน → 0, ล่าง → ${a})`}`,
      `แทนสูตร::$$\\frac{(${den})(${isX ? 1 : 0}) - x(${isX ? 1 : a})}{\\left(${den}\\right)^2}$$`,
      `จัดรูป::$${isX ? `\\frac{${a}y}{\\left(${den}\\right)^2}` : `\\frac{-${a}x}{\\left(${den}\\right)^2}`}$`,
    ],
    f: (x, y) => x / (x + a * y), d: (x, y) => (isX ? a * y : -a * x) / D(x, y),
  };
};

export const templates: Record<Cat, Tpl[]> = {
  chain: [chainPow, chainRoot],
  explog: [expChain, lnChain],
  trig: [cosChain, sinPow],
  product: [productExp, productTrig, productLn],
  quotient: [quotLinear, quotTrig, quotExp],
  partial: [partialExp, partialLn, partialProductTrig, partialQuot],
};

export const cats = Object.keys(templates) as Cat[];

export function generate(allowed: Cat[]): Problem {
  const cat = pick(allowed.length ? allowed : cats);
  return pick(templates[cat])();
}
