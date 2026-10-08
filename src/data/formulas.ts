// สูตรการดิฟ: u คือฟังก์ชันข้างใน, u' คืออนุพันธ์ของ u
// ช่อง partial = ตัวอย่างการใช้สูตรนั้นกับอนุพันธ์ย่อย
const t = String.raw;

export type Rule = { name: string; rule: string; partial: string };
export type RuleGroup = { id: string; title: string; note: string; rules: Rule[] };

export const ruleGroups: RuleGroup[] = [
  {
    id: 'basic',
    title: 'กฎพื้นฐาน',
    note: 'ใช้ทุกข้อ ค่าคงที่ในอนุพันธ์ย่อยรวมถึงตัวแปรที่ไม่ได้ diff ด้วย',
    rules: [
      { name: 'ค่าคงที่', rule: t`\frac{d}{dx}(c) = 0`, partial: t`\frac{\partial}{\partial x}(y^3) = 0` },
      { name: 'ยกกำลัง', rule: t`\frac{d}{dx}(x^n) = n\,x^{n-1}`, partial: t`\frac{\partial}{\partial x}(x^4) = 4x^3` },
      { name: 'ค่าคงที่คูณ', rule: t`\frac{d}{dx}\big(c\,f\big) = c\,f'`, partial: t`\frac{\partial}{\partial x}(5x^2y^3) = 10xy^3` },
      { name: 'ผลบวก / ผลต่าง', rule: t`(f \pm g)' = f' \pm g'`, partial: t`\frac{\partial}{\partial y}(x^2 + y^2) = 2y` },
    ],
  },
  {
    id: 'combo',
    title: 'ผลคูณ ผลหาร และลูกโซ่',
    note: 'สามกฎนี้คือจุดที่คนพลาดบ่อยที่สุดในข้อ 1 และข้อ 2',
    rules: [
      { name: 'ผลคูณ (product)', rule: t`(uv)' = u'v + uv'`, partial: t`\frac{\partial}{\partial x}(x\,e^{xy}) = e^{xy} + xy\,e^{xy}` },
      { name: 'ผลหาร (quotient)', rule: t`\left(\frac{u}{v}\right)' = \frac{v\,u' - u\,v'}{v^2}`, partial: t`\frac{\partial}{\partial x}\left(\frac{x}{y + x}\right) = \frac{(y+x) - x}{(y+x)^2} = \frac{y}{(y+x)^2}` },
      { name: 'ลูกโซ่ (chain)', rule: t`\frac{d}{dx}f(u) = f'(u)\cdot u'`, partial: t`\frac{\partial}{\partial x}(x^2 + y)^3 = 3(x^2 + y)^2\cdot 2x` },
      { name: 'ส่วนกลับ', rule: t`\frac{d}{dx}\left(\frac{1}{u}\right) = -\frac{u'}{u^2}`, partial: t`\frac{\partial}{\partial y}\left(\frac{1}{xy}\right) = -\frac{x}{(xy)^2} = -\frac{1}{xy^2}` },
      { name: 'รากที่สอง', rule: t`\frac{d}{dx}\sqrt{u} = \frac{u'}{2\sqrt{u}}`, partial: t`\frac{\partial}{\partial x}\sqrt{x^2 + y^2} = \frac{x}{\sqrt{x^2 + y^2}}` },
    ],
  },
  {
    id: 'explog',
    title: 'เอกซ์โพเนนเชียลและลอการิทึม',
    note: 'อย่าลืมคูณ u\' ทุกครั้ง',
    rules: [
      { name: 'e ยกกำลัง', rule: t`\frac{d}{dx}e^{u} = e^{u}\cdot u'`, partial: t`\frac{\partial}{\partial y}e^{xy} = x\,e^{xy}` },
      { name: 'a ยกกำลัง', rule: t`\frac{d}{dx}a^{u} = a^{u}\ln a\cdot u'`, partial: t`\frac{\partial}{\partial x}2^{xy} = 2^{xy}\ln 2\cdot y` },
      { name: 'ln', rule: t`\frac{d}{dx}\ln u = \frac{u'}{u}`, partial: t`\frac{\partial}{\partial x}\ln(x^2 + y^2) = \frac{2x}{x^2 + y^2}` },
      { name: 'log ฐาน a', rule: t`\frac{d}{dx}\log_a u = \frac{u'}{u\ln a}`, partial: t`\frac{\partial}{\partial x}\log_{10}(xy) = \frac{y}{xy\ln 10} = \frac{1}{x\ln 10}` },
    ],
  },
  {
    id: 'trig',
    title: 'ตรีโกณมิติ',
    note: 'ตัวที่ขึ้นต้นด้วย co (cos, cot, csc) จะได้เครื่องหมายลบ',
    rules: [
      { name: 'sin', rule: t`\frac{d}{dx}\sin u = \cos u\cdot u'`, partial: t`\frac{\partial}{\partial x}\sin(xy) = y\cos(xy)` },
      { name: 'cos', rule: t`\frac{d}{dx}\cos u = -\sin u\cdot u'`, partial: t`\frac{\partial}{\partial y}\cos(xy) = -x\sin(xy)` },
      { name: 'tan', rule: t`\frac{d}{dx}\tan u = \sec^2 u\cdot u'`, partial: t`\frac{\partial}{\partial x}\tan(2x + y) = 2\sec^2(2x + y)` },
      { name: 'cot', rule: t`\frac{d}{dx}\cot u = -\csc^2 u\cdot u'`, partial: t`\frac{\partial}{\partial y}\cot(xy) = -x\csc^2(xy)` },
      { name: 'sec', rule: t`\frac{d}{dx}\sec u = \sec u\tan u\cdot u'`, partial: t`\frac{\partial}{\partial x}\sec(x^2) = 2x\sec(x^2)\tan(x^2)` },
      { name: 'csc', rule: t`\frac{d}{dx}\csc u = -\csc u\cot u\cdot u'`, partial: t`\frac{\partial}{\partial y}\csc(3y) = -3\csc(3y)\cot(3y)` },
    ],
  },
  {
    id: 'inv',
    title: 'อินเวอร์สตรีโกณ',
    note: 'เจอน้อยกว่าหมวดอื่น แต่ควรจำไว้',
    rules: [
      { name: 'arcsin', rule: t`\frac{d}{dx}\sin^{-1}u = \frac{u'}{\sqrt{1 - u^2}}`, partial: t`\frac{\partial}{\partial x}\sin^{-1}(xy) = \frac{y}{\sqrt{1 - x^2y^2}}` },
      { name: 'arccos', rule: t`\frac{d}{dx}\cos^{-1}u = -\frac{u'}{\sqrt{1 - u^2}}`, partial: t`\frac{\partial}{\partial y}\cos^{-1}(2y) = -\frac{2}{\sqrt{1 - 4y^2}}` },
      { name: 'arctan', rule: t`\frac{d}{dx}\tan^{-1}u = \frac{u'}{1 + u^2}`, partial: t`\frac{\partial}{\partial x}\tan^{-1}\!\left(\frac{y}{x}\right) = \frac{-y/x^2}{1 + y^2/x^2} = -\frac{y}{x^2 + y^2}` },
    ],
  },
];

export const values: { k: string; v: string }[] = [
  { k: t`\sin 0`, v: '0' },
  { k: t`\cos 0`, v: '1' },
  { k: t`\sin\frac{\pi}{6}`, v: t`\frac12` },
  { k: t`\cos\frac{\pi}{6}`, v: t`\frac{\sqrt3}{2}` },
  { k: t`\sin\frac{\pi}{4} = \cos\frac{\pi}{4}`, v: t`\frac{\sqrt2}{2}` },
  { k: t`\sin\frac{\pi}{3}`, v: t`\frac{\sqrt3}{2}` },
  { k: t`\cos\frac{\pi}{3}`, v: t`\frac12` },
  { k: t`\sin\frac{\pi}{2}`, v: '1' },
  { k: t`\cos\frac{\pi}{2}`, v: '0' },
  { k: t`e^0`, v: '1' },
  { k: t`\ln 1`, v: '0' },
  { k: t`\sin^2\theta + \cos^2\theta`, v: '1' },
];

// การ์ดฝึกจำ: หน้า = โจทย์, หลัง = คำตอบ
export const flashcards: { front: string; back: string }[] = [
  ...ruleGroups.flatMap((g) => g.rules.map((r) => {
    const [front, back] = r.rule.split(/\s=\s(.*)/s);
    return { front, back: back ?? r.rule };
  })),
  { front: t`\frac{\partial}{\partial x}(3x^2y)`, back: t`6xy` },
  { front: t`\frac{\partial}{\partial y}(3x^2y)`, back: t`3x^2` },
  { front: t`\frac{\partial}{\partial x}e^{2xy}`, back: t`2y\,e^{2xy}` },
  { front: t`\frac{\partial}{\partial y}\sin(x^2y)`, back: t`x^2\cos(x^2y)` },
  { front: t`\frac{\partial}{\partial x}\ln(xy)`, back: t`\frac{1}{x}` },
  { front: t`\frac{\partial}{\partial y}\big(y\cos x\big)`, back: t`\cos x` },
];
