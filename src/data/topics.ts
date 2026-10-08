// เนื้อหาทั้งหมดของเว็บ
// - $...$ สูตรในบรรทัด, $$...$$ สูตรแยกบรรทัด, **...** ไฮไลต์
// - แต่ละขั้นของวิธีทำเขียนเป็น "หัวข้อขั้น::คำอธิบายและสูตร"
const t = String.raw;

export type FigureKind = 'slice' | 'tree' | 'chain2' | 'chain3' | 'direction' | 'level';

export type Practice = { id: string; src?: string; q: string; hint?: string; sol: string[]; answer: string };
export type Example = { src: string; title: string; q: string; steps: string[]; answer: string };
export type Topic = {
  id: string;
  num: number;
  title: string;
  short: string;
  figure: FigureKind;
  figureTitle: string;
  figureHint: string;
  concept: { eyebrow: string; lead: string; formulas: string[]; points: string[] };
  recipe: string[];
  examples: Example[];
  traps: string[];
  tutor: string[];
  practice: Practice[];
};

export const topics: Topic[] = [
  /* ============================ ข้อ 1 ============================ */
  {
    id: 't1',
    num: 1,
    title: 'อนุพันธ์ย่อยอันดับหนึ่ง',
    short: 'อนุพันธ์ย่อย',
    figure: 'slice',
    figureTitle: 'ระนาบ x = 1 ตัดพาราโบลา z = x² + y²',
    figureHint: 'ลากเพื่อหมุนกราฟ เลื่อนแถบด้านล่างเพื่อขยับจุด แล้วดูว่าความชันเท่ากับ ∂z/∂y',
    concept: {
      eyebrow: 'หลักการ',
      lead: t`diff เทียบตัวแปรไหน ให้ตัวแปรที่เหลือ**เป็นค่าคงที่** คือมองมันเป็นตัวเลขธรรมดา แล้ว diff ด้วยสูตรตัวแปรเดียวตามปกติ`,
      formulas: [t`$$\frac{\partial f}{\partial x} = f_x \ \ (y \text{ คงที่}), \qquad \frac{\partial f}{\partial y} = f_y \ \ (x \text{ คงที่})$$`],
      points: [
        t`ความหมาย: $\left.\frac{\partial f}{\partial x}\right|_{(x_0,y_0)}$ คือ**ความชันของเส้นสัมผัส**พื้นผิว $z = f(x,y)$ ในแนวแกน $x$ ที่จุดนั้น`,
        t`ตัวอย่างการมองเป็นค่าคงที่: ถ้า $y$ คงที่ แล้ว $5x^2y^3$ ก็เหมือน $5x^2\cdot(\text{ตัวเลข})$ จึงได้ $\frac{\partial}{\partial x}(5x^2y^3) = 10xy^3$`,
        t`สูตร diff ทั้งหมดที่ต้องใช้ ดูได้ในหมวด "สูตรการดิฟ" ด้านบน`,
      ],
    },
    recipe: [
      t`ดูว่าโจทย์ให้ diff เทียบตัวแปรไหน แล้ว**วงตัวแปรที่เหลือ**ไว้ (ตัวที่วงคือค่าคงที่)`,
      t`diff **ทีละเทอม** เทอมที่ไม่มีตัวแปรที่ diff เลยได้ 0`,
      t`เทอมที่มีตัวแปรอยู่หลายที่ (เช่น $x\,e^{xy}$) ใช้ product rule ส่วนเทอมที่มีฟังก์ชันซ้อน (เช่น $\sin(xy)$) ใช้ chain rule`,
      t`ถ้าโจทย์ให้จุดมา ให้ diff ให้เสร็จก่อน **แล้วค่อยแทนค่า**`,
    ],
    examples: [
      {
        src: 'Example 3',
        title: 'แทนค่าที่จุด',
        q: t`จงหา $\frac{\partial f}{\partial x}$ และ $\frac{\partial f}{\partial y}$ ที่จุด $(4,-5)$ ถ้า $f(x,y) = x^2 + 3xy + y - 1$`,
        steps: [
          t`หา ∂f/∂x: มอง y เป็นค่าคงที่::diff ทีละเทอม $$\frac{\partial}{\partial x}(x^2) = 2x,\quad \frac{\partial}{\partial x}(3xy) = 3y\cdot\frac{\partial}{\partial x}(x) = 3y,\quad \frac{\partial}{\partial x}(y) = 0,\quad \frac{\partial}{\partial x}(1) = 0$$`,
          t`รวมเทอม::$$\frac{\partial f}{\partial x} = 2x + 3y$$`,
          t`แทนจุด (4, −5)::$$f_x(4,-5) = 2(4) + 3(-5) = 8 - 15 = -7$$`,
          t`หา ∂f/∂y: มอง x เป็นค่าคงที่::$$\frac{\partial}{\partial y}(x^2) = 0,\quad \frac{\partial}{\partial y}(3xy) = 3x,\quad \frac{\partial}{\partial y}(y) = 1,\quad \frac{\partial}{\partial y}(1) = 0$$ ดังนั้น $\frac{\partial f}{\partial y} = 3x + 1$`,
          t`แทนจุด (4, −5)::$$f_y(4,-5) = 3(4) + 1 = 13$$`,
        ],
        answer: t`$f_x(4,-5) = -7,\quad f_y(4,-5) = 13$`,
      },
      {
        src: 'Example 5',
        title: 'ต้องใช้ quotient',
        q: t`จงหา $f_x$ และ $f_y$ ถ้า $f(x,y) = \dfrac{2y}{y + \cos x}$`,
        steps: [
          t`หา f_x: ตัวเศษไม่มี x::ตัวเศษ $2y$ เป็นค่าคงที่ จึงเขียนใหม่เป็นเลขยกกำลังลบ จะ diff ง่ายกว่า quotient $$f = 2y\,(y + \cos x)^{-1}$$`,
          t`ใช้ power rule + chain rule::ให้ $u = y + \cos x$ จะได้ $\frac{\partial u}{\partial x} = -\sin x$ $$\frac{\partial}{\partial x}u^{-1} = -u^{-2}\cdot\frac{\partial u}{\partial x}$$`,
          t`ประกอบคำตอบ f_x::$$f_x = 2y\cdot(-1)(y+\cos x)^{-2}\cdot(-\sin x) = \frac{2y\sin x}{(y+\cos x)^2}$$ ลบคูณลบได้บวก`,
          t`หา f_y: y อยู่ทั้งบนและล่าง::ต้องใช้ quotient rule $\left(\frac{\text{บน}}{\text{ล่าง}}\right)' = \frac{\text{ล่าง}\cdot\text{บน}' - \text{บน}\cdot\text{ล่าง}'}{\text{ล่าง}^2}$ โดย บน $= 2y$ (diff ได้ 2) และ ล่าง $= y + \cos x$ (diff เทียบ y ได้ 1)`,
          t`แทนลงสูตร::$$f_y = \frac{(y+\cos x)(2) - 2y(1)}{(y+\cos x)^2} = \frac{2y + 2\cos x - 2y}{(y+\cos x)^2} = \frac{2\cos x}{(y+\cos x)^2}$$`,
        ],
        answer: t`$f_x = \dfrac{2y\sin x}{(y+\cos x)^2},\quad f_y = \dfrac{2\cos x}{(y+\cos x)^2}$`,
      },
    ],
    traps: [
      t`ลืมคูณอนุพันธ์ของข้างใน เช่น $\frac{\partial}{\partial y}\sin(xy) = x\cos(xy)$ ไม่ใช่ $\cos(xy)$`,
      t`เทอมที่มีแต่ตัวแปรที่ถูกมองเป็นค่าคงที่ diff แล้วได้ 0 เช่น $y - 1$ เมื่อหา $f_x$`,
      t`เทอมอย่าง $3xy$ เมื่อ diff เทียบ $x$ ได้ $3y$ ไม่ใช่ 0 เพราะยังมี $x$ อยู่`,
      t`ถ้าโจทย์ให้หาค่าที่จุด ให้ diff จนเสร็จก่อน แล้วจึงแทนค่า`,
    ],
    tutor: [
      t`ให้น้องวงตัวแปรที่ "ไม่ได้ diff" ด้วยปากกาสีอื่น แล้วคิดว่าเป็นตัวเลข เช่น $3xy$ เทียบ $x$ ให้คิดเหมือน $3\cdot 5\cdot x$`,
      t`เปิดรูป 3 มิติให้น้องดู: ระนาบ $x = 1$ ทำให้ $x$ คงที่ เหลือเส้นโค้งที่มีแค่ $y$ ความชันของเส้นนั้นคือ $\partial z/\partial y$`,
      t`ถ้าน้องติด ให้เปิดหมวดสูตรการดิฟด้วยกัน ปัญหาส่วนใหญ่อยู่ที่ product rule กับ chain rule`,
    ],
    practice: [
      {
        id: 't1a',
        q: t`$f(x,y) = x^3y^2 - 4xy + 7$ จงหา $f_x$ และ $f_y$ ที่จุด $(1,-1)$`,
        sol: [
          t`หา f_x: y คงที่::$x^3y^2 \to 3x^2y^2$ (ดึง $y^2$ ออกมาเป็นค่าคงที่), $-4xy \to -4y$, $7 \to 0$ $$f_x = 3x^2y^2 - 4y$$`,
          t`แทนจุด (1, −1)::$$f_x(1,-1) = 3(1)^2(-1)^2 - 4(-1) = 3 + 4 = 7$$`,
          t`หา f_y: x คงที่::$x^3y^2 \to 2x^3y$, $-4xy \to -4x$, $7 \to 0$ $$f_y = 2x^3y - 4x$$`,
          t`แทนจุด (1, −1)::$$f_y(1,-1) = 2(1)(-1) - 4(1) = -2 - 4 = -6$$`,
        ],
        answer: t`$f_x(1,-1) = 7,\quad f_y(1,-1) = -6$`,
      },
      {
        id: 't1e',
        src: 'Example 4',
        q: t`จงหา $\frac{\partial f}{\partial y}$ ถ้า $f(x,y) = y\sin(xy)$`,
        hint: t`$y$ อยู่สองที่ คือข้างหน้ากับใน $\sin$ จึงต้องใช้ product rule`,
        sol: [
          t`แยกเป็นผลคูณ::ให้ $u = y$ และ $v = \sin(xy)$ แล้วใช้ $(uv)' = u'v + uv'$ (x คงที่)`,
          t`diff แต่ละตัว::$u_y = 1$ และ $v_y = \cos(xy)\cdot\frac{\partial}{\partial y}(xy) = x\cos(xy)$ (chain rule: คูณอนุพันธ์ของข้างใน)`,
          t`ประกอบคำตอบ::$$\frac{\partial f}{\partial y} = (1)\sin(xy) + y\cdot x\cos(xy) = \sin(xy) + xy\cos(xy)$$`,
        ],
        answer: t`$\dfrac{\partial f}{\partial y} = \sin(xy) + xy\cos(xy)$`,
      },
      {
        id: 't1b',
        q: t`$f(x,y) = x\,e^{xy}$ จงหา $f_x$ และ $f_y$`,
        hint: t`$f_x$ ต้องใช้ product rule เพราะมี $x$ ทั้งสองตัว ส่วน $f_y$ มอง $x$ ข้างหน้าเป็นค่าคงที่`,
        sol: [
          t`หา f_x: x อยู่สองที่::ใช้ product rule ให้ $u = x,\ v = e^{xy}$ จะได้ $u_x = 1$ และ $v_x = e^{xy}\cdot\frac{\partial}{\partial x}(xy) = y\,e^{xy}$`,
          t`ประกอบ f_x::$$f_x = (1)e^{xy} + x\cdot y\,e^{xy} = (1 + xy)e^{xy}$$`,
          t`หา f_y: x ข้างหน้าเป็นค่าคงที่::ดึง $x$ ออกมา แล้ว diff แค่ $e^{xy}$ ด้วย chain rule $$f_y = x\cdot e^{xy}\cdot\frac{\partial}{\partial y}(xy) = x\cdot e^{xy}\cdot x = x^2e^{xy}$$`,
        ],
        answer: t`$f_x = (1 + xy)e^{xy},\quad f_y = x^2e^{xy}$`,
      },
      {
        id: 't1c',
        q: t`$f(x,y) = \dfrac{x - y}{x + y}$ จงหา $f_x$ และ $f_y$`,
        sol: [
          t`เตรียมสูตร quotient::$\left(\frac{\text{บน}}{\text{ล่าง}}\right)' = \frac{\text{ล่าง}\cdot\text{บน}' - \text{บน}\cdot\text{ล่าง}'}{\text{ล่าง}^2}$ โดย บน $= x - y$ และ ล่าง $= x + y$`,
          t`หา f_x::บน$_x = 1$, ล่าง$_x = 1$ $$f_x = \frac{(x+y)(1) - (x-y)(1)}{(x+y)^2} = \frac{x + y - x + y}{(x+y)^2} = \frac{2y}{(x+y)^2}$$`,
          t`หา f_y::บน$_y = -1$, ล่าง$_y = 1$ $$f_y = \frac{(x+y)(-1) - (x-y)(1)}{(x+y)^2} = \frac{-x - y - x + y}{(x+y)^2} = \frac{-2x}{(x+y)^2}$$`,
        ],
        answer: t`$f_x = \dfrac{2y}{(x+y)^2},\quad f_y = \dfrac{-2x}{(x+y)^2}$`,
      },
      {
        id: 't1d',
        src: 'แบบ Example 7',
        q: t`ระนาบ $y = 1$ ตัดพื้นผิว $z = x^2 + 3xy$ จงหาความชันของเส้นสัมผัสที่จุด $(2, 1, 10)$`,
        hint: t`ระนาบ $y = 1$ ทำให้ $y$ คงที่ ความชันจึงเป็น $\frac{\partial z}{\partial x}$`,
        sol: [
          t`ดูว่าต้อง diff เทียบอะไร::ระนาบ $y = 1$ ทำให้ $y$ คงที่ เส้นโค้งที่เหลือเปลี่ยนตาม $x$ อย่างเดียว ความชันจึงคือ $\frac{\partial z}{\partial x}$`,
          t`diff::$$\frac{\partial z}{\partial x} = 2x + 3y$$`,
          t`แทนจุด (2, 1)::$$\left.\frac{\partial z}{\partial x}\right|_{(2,1)} = 2(2) + 3(1) = 7$$`,
        ],
        answer: t`ความชัน $= 7$`,
      },
    ],
  },

  /* ============================ ข้อ 2 ============================ */
  {
    id: 't2',
    num: 2,
    title: 'อนุพันธ์ย่อยอันดับสอง',
    short: 'อันดับสอง',
    figure: 'tree',
    figureTitle: 'จาก f แตกเป็น 4 ตัว',
    figureHint: 'แตะกิ่งไหนก็ได้เพื่อดูว่าต้อง diff ตามลำดับอะไร',
    concept: {
      eyebrow: 'มีทั้งหมด 4 ตัว',
      lead: t`diff ครั้งแรกได้ $f_x$ กับ $f_y$ แล้ว**เอาผลลัพธ์ไป diff ซ้ำ**อีกครั้งเทียบ $x$ หรือ $y$ จึงได้ 4 แบบ`,
      formulas: [
        t`$$\frac{\partial^2 f}{\partial x^2} = \frac{\partial}{\partial x}\!\left(\frac{\partial f}{\partial x}\right), \qquad \frac{\partial^2 f}{\partial y^2} = \frac{\partial}{\partial y}\!\left(\frac{\partial f}{\partial y}\right)$$`,
        t`$$\frac{\partial^2 f}{\partial y\,\partial x} = f_{xy} = \frac{\partial}{\partial y}\!\left(\frac{\partial f}{\partial x}\right), \qquad \frac{\partial^2 f}{\partial x\,\partial y} = f_{yx} = \frac{\partial}{\partial x}\!\left(\frac{\partial f}{\partial y}\right)$$`,
      ],
      points: [
        t`**วิธีจำลำดับ:** แบบเศษส่วน $\frac{\partial^2 f}{\partial y\,\partial x}$ อ่านจากขวาไปซ้าย ($x$ ก่อน แล้วจึง $y$) ส่วนแบบตัวห้อย $f_{xy}$ อ่านจากซ้ายไปขวา ($x$ ก่อน แล้วจึง $y$) ทั้งสองแบบคือตัวเดียวกัน`,
        t`ฟังก์ชันที่เจอในข้อสอบส่วนใหญ่จะได้ $f_{xy} = f_{yx}$ ใช้ตรวจคำตอบตัวเองได้`,
      ],
    },
    recipe: [
      t`หา**อันดับหนึ่ง**ให้ครบก่อน: $f_x$ และ $f_y$ แล้วเขียนใส่กรอบไว้`,
      t`อ่านโจทย์ว่าต้องการตัวไหน แล้วดูว่า**ต้อง diff อะไรก่อน** (เศษส่วนอ่านขวาไปซ้าย)`,
      t`เอาตัวในกรอบมา**diff ซ้ำ**เทียบตัวแปรที่สอง โดยใช้หลักเดิมของข้อ 1 (ตัวที่เหลือเป็นค่าคงที่)`,
      t`ถ้าหาทั้ง $f_{xy}$ และ $f_{yx}$ ให้**เทียบกัน** ถ้าไม่เท่ากันแปลว่าคำนวณผิดสักจุด`,
    ],
    examples: [
      {
        src: 'Example 8',
        title: 'diff สองรอบ',
        q: t`ถ้า $f(x,y) = x\cos y + ye^x$ จงหา $\frac{\partial^2 f}{\partial x^2}$ และ $\frac{\partial^2 f}{\partial y\,\partial x}$`,
        steps: [
          t`หาอันดับหนึ่ง ∂f/∂x ก่อน::y คงที่: $x\cos y \to \cos y$ (เพราะ $\cos y$ เป็นค่าคงที่ที่คูณ $x$) และ $ye^x \to ye^x$ $$\frac{\partial f}{\partial x} = \cos y + ye^x$$`,
          t`∂²f/∂x²: diff ผลลัพธ์เทียบ x อีกครั้ง::$\cos y$ ไม่มี $x$ จึงได้ 0 ส่วน $ye^x \to ye^x$ $$\frac{\partial^2 f}{\partial x^2} = ye^x$$`,
          t`∂²f/∂y∂x: อ่านจากขวาไปซ้าย = x ก่อน แล้วจึง y::เอา $\frac{\partial f}{\partial x} = \cos y + ye^x$ มา diff เทียบ $y$: $\cos y \to -\sin y$ และ $ye^x \to e^x$ ($e^x$ เป็นค่าคงที่) $$\frac{\partial^2 f}{\partial y\,\partial x} = -\sin y + e^x$$`,
        ],
        answer: t`$\dfrac{\partial^2 f}{\partial x^2} = ye^x,\quad \dfrac{\partial^2 f}{\partial y\,\partial x} = -\sin y + e^x$`,
      },
    ],
    traps: [
      t`อ่านลำดับใน $\frac{\partial^2 f}{\partial y\,\partial x}$ ผิด (ตัวขวาสุดต้องทำก่อน)`,
      t`ตอน diff ครั้งที่สอง ลืมใช้ product rule กับเทอมอย่าง $y\,e^{xy}$`,
      t`ได้ $f_{xy} \ne f_{yx}$ แสดงว่าคำนวณผิดสักจุด ให้กลับไปตรวจอันดับหนึ่งก่อน`,
    ],
    tutor: [
      t`ให้น้องเขียน $f_x$ กับ $f_y$ ใส่กรอบไว้ก่อนทุกครั้ง แล้วค่อย diff ต่อจากกรอบ จะไม่สับสนว่ากำลังทำตัวไหน`,
      t`ให้น้องหาทั้ง $f_{xy}$ และ $f_{yx}$ แล้วเทียบกัน ถ้าเท่ากันก็มั่นใจได้`,
    ],
    practice: [
      {
        id: 't2a',
        src: 'HW 17/09',
        q: t`ต่อจาก Example 8: $f = x\cos y + ye^x$ จงหา $\frac{\partial^2 f}{\partial y^2}$ และ $\frac{\partial^2 f}{\partial x\,\partial y}$`,
        sol: [
          t`หาอันดับหนึ่ง ∂f/∂y ก่อน::x คงที่: $x\cos y \to -x\sin y$ และ $ye^x \to e^x$ $$\frac{\partial f}{\partial y} = -x\sin y + e^x$$`,
          t`∂²f/∂y²: diff เทียบ y อีกครั้ง::$-x\sin y \to -x\cos y$ และ $e^x$ ไม่มี $y$ จึงได้ 0 $$\frac{\partial^2 f}{\partial y^2} = -x\cos y$$`,
          t`∂²f/∂x∂y: y ก่อน แล้วจึง x::เอา $-x\sin y + e^x$ มา diff เทียบ $x$: $-x\sin y \to -\sin y$ และ $e^x \to e^x$ $$\frac{\partial^2 f}{\partial x\,\partial y} = -\sin y + e^x$$`,
          t`ตรวจคำตอบ::ได้เท่ากับ $\frac{\partial^2 f}{\partial y\,\partial x}$ ใน Example 8 ตามที่ควรเป็น`,
        ],
        answer: t`$\dfrac{\partial^2 f}{\partial y^2} = -x\cos y,\quad \dfrac{\partial^2 f}{\partial x\,\partial y} = -\sin y + e^x$`,
      },
      {
        id: 't2b',
        q: t`$f(x,y) = x^3y^2 - 2xy^4$ จงหาอนุพันธ์ย่อยอันดับสองทั้ง 4 ตัว`,
        sol: [
          t`อันดับหนึ่ง::$$f_x = 3x^2y^2 - 2y^4, \qquad f_y = 2x^3y - 8xy^3$$`,
          t`f_xx: diff f_x เทียบ x::$3x^2y^2 \to 6xy^2$ และ $-2y^4 \to 0$ $$f_{xx} = 6xy^2$$`,
          t`f_yy: diff f_y เทียบ y::$2x^3y \to 2x^3$ และ $-8xy^3 \to -24xy^2$ $$f_{yy} = 2x^3 - 24xy^2$$`,
          t`f_xy: diff f_x เทียบ y::$3x^2y^2 \to 6x^2y$ และ $-2y^4 \to -8y^3$ $$f_{xy} = 6x^2y - 8y^3$$`,
          t`f_yx: diff f_y เทียบ x แล้วตรวจ::$2x^3y \to 6x^2y$ และ $-8xy^3 \to -8y^3$ $$f_{yx} = 6x^2y - 8y^3$$ เท่ากับ $f_{xy}$`,
        ],
        answer: t`$f_{xx} = 6xy^2,\ f_{yy} = 2x^3 - 24xy^2,\ f_{xy} = f_{yx} = 6x^2y - 8y^3$`,
      },
      {
        id: 't2c',
        q: t`$f(x,y) = e^{xy}$ จงหา $f_{xx}, f_{yy}, f_{xy}$`,
        hint: t`$f_x = y\,e^{xy}$ เมื่อ diff เทียบ $y$ ต้องใช้ product rule`,
        sol: [
          t`อันดับหนึ่ง (chain rule)::$$f_x = e^{xy}\cdot y = y\,e^{xy}, \qquad f_y = e^{xy}\cdot x = x\,e^{xy}$$`,
          t`f_xx::$y$ เป็นค่าคงที่ จึง diff แค่ $e^{xy}$ ได้ $y\,e^{xy}$ อีกครั้ง $$f_{xx} = y\cdot y\,e^{xy} = y^2e^{xy}$$`,
          t`f_yy::ทำแบบเดียวกัน $$f_{yy} = x\cdot x\,e^{xy} = x^2e^{xy}$$`,
          t`f_xy: diff y·e^{xy} เทียบ y::$y$ อยู่สองที่ จึงใช้ product rule $$f_{xy} = (1)e^{xy} + y\cdot x\,e^{xy} = (1 + xy)e^{xy}$$`,
        ],
        answer: t`$f_{xx} = y^2e^{xy},\ f_{yy} = x^2e^{xy},\ f_{xy} = (1 + xy)e^{xy}$`,
      },
    ],
  },

  /* ============================ ข้อ 3 ============================ */
  {
    id: 't3',
    num: 3,
    title: 'กฎลูกโซ่ 2 ตัวแปร',
    short: 'ลูกโซ่ 2 ตัวแปร',
    figure: 'chain2',
    figureTitle: 'แผนภาพเพชร w → x, y → t',
    figureHint: 'กดเล่นเพื่อดูทีละเส้นทาง แต่ละเส้นทางคือหนึ่งเทอมในสูตร',
    concept: {
      eyebrow: 'สูตร',
      lead: t`ใช้เมื่อ $w$ ขึ้นกับ $x, y$ แต่ $x$ กับ $y$ ขึ้นกับ $t$ อีกทีหนึ่ง เราอยากรู้ว่า $w$ เปลี่ยนตาม $t$ เท่าไร`,
      formulas: [t`$$\frac{dw}{dt} = \frac{\partial w}{\partial x}\frac{dx}{dt} + \frac{\partial w}{\partial y}\frac{dy}{dt}$$`],
      points: [
        t`**แผนภาพเพชร:** $w$ อยู่บนสุด แตกกิ่งลงไปที่ $x$ กับ $y$ (ใช้ $\partial$ เพราะ $w$ มีหลายตัวแปร) แล้วทั้งสองกิ่งมารวมกันที่ $t$ (ใช้ $d$ เพราะ $x(t), y(t)$ มีตัวแปรเดียว)`,
        t`แต่ละเส้นทางจาก $w$ ลงไปถึง $t$ คือหนึ่งเทอม: **คูณตามกิ่ง** แล้ว**บวกทุกเส้นทาง**`,
      ],
    },
    recipe: [
      t`**วาดแผนภาพเพชร** $w \to x, y \to t$ แล้วเขียนสูตรจากแผนภาพ`,
      t`หาชิ้นส่วนบน: $\frac{\partial w}{\partial x}$ และ $\frac{\partial w}{\partial y}$ (ใช้หลักข้อ 1)`,
      t`หาชิ้นส่วนล่าง: $\frac{dx}{dt}$ และ $\frac{dy}{dt}$ (diff ตัวแปรเดียวธรรมดา)`,
      t`**คูณตามกิ่ง แล้วบวก** จากนั้นแทน $x, y$ ด้วยฟังก์ชันของ $t$ ให้คำตอบเหลือแต่ $t$`,
      t`ถ้าโจทย์ให้ค่า $t$ ให้หาค่า $x, y$ ที่ $t$ นั้นก่อน แล้วแทนเป็นตัวเลขได้เลย`,
    ],
    examples: [
      {
        src: 'Example 9',
        title: 'ตามเส้นทางวงกลม',
        q: t`จงใช้กฎลูกโซ่หาอนุพันธ์ของ $w = xy$ เทียบกับ $t$ ตามเส้นทาง $x = \cos t,\ y = \sin t$ และหาค่าที่ $t = \frac{\pi}{2}$`,
        steps: [
          t`วาดแผนภาพและเขียนสูตร::$w \to x, y \to t$ ได้ $$\frac{dw}{dt} = \frac{\partial w}{\partial x}\frac{dx}{dt} + \frac{\partial w}{\partial y}\frac{dy}{dt}$$`,
          t`ชิ้นส่วนบน (กิ่ง ∂)::$w = xy$ ดังนั้น $\frac{\partial w}{\partial x} = y$ และ $\frac{\partial w}{\partial y} = x$`,
          t`ชิ้นส่วนล่าง (กิ่ง d)::$\frac{dx}{dt} = \frac{d}{dt}\cos t = -\sin t$ และ $\frac{dy}{dt} = \frac{d}{dt}\sin t = \cos t$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = y(-\sin t) + x(\cos t)$$`,
          t`แทน x = cos t, y = sin t::$$\frac{dw}{dt} = -\sin t\cdot\sin t + \cos t\cdot\cos t = -\sin^2 t + \cos^2 t$$`,
          t`แทน t = π/2::$\sin\frac{\pi}{2} = 1,\ \cos\frac{\pi}{2} = 0$ $$\left.\frac{dw}{dt}\right|_{t=\pi/2} = -(1)^2 + (0)^2 = -1$$`,
        ],
        answer: t`$\dfrac{dw}{dt} = \cos^2 t - \sin^2 t$ และที่ $t = \frac{\pi}{2}$ ได้ $-1$`,
      },
    ],
    traps: [
      t`ลืมแทน $x, y$ กลับเป็น $t$ คำตอบสุดท้ายต้องเป็นฟังก์ชันของ $t$ เท่านั้น`,
      t`ใช้ $d$ กับ $\partial$ สลับกัน: $w$ มีสองตัวแปรจึงใช้ $\partial$ ส่วน $x(t), y(t)$ มีตัวแปรเดียวจึงใช้ $d$`,
      t`ตรวจคำตอบได้โดยแทน $x, y$ ลงใน $w$ ก่อน แล้ว diff เทียบ $t$ ตรงๆ ต้องได้คำตอบเท่ากัน`,
    ],
    tutor: [
      t`วาดแผนภาพเพชรบนกระดานทุกข้อ ระบายสีกิ่งซ้ายกับกิ่งขวาให้ต่างกันแบบที่อาจารย์ทำ`,
      t`ให้น้องตรวจคำตอบด้วยวิธีแทนค่าแล้ว diff ตรงๆ จะเห็นว่ากฎลูกโซ่ให้คำตอบเดียวกัน`,
    ],
    practice: [
      {
        id: 't3a',
        src: 'HW 17/09',
        q: t`จงหา $\frac{dw}{dt}$ เมื่อ $w = x^2y,\ x = t^2,\ y = t^3$`,
        sol: [
          t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = 2xy$ และ $\frac{\partial w}{\partial y} = x^2$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 2t$ และ $\frac{dy}{dt} = 3t^2$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 2xy(2t) + x^2(3t^2)$$`,
          t`แทน x = t², y = t³::$$= 2(t^2)(t^3)(2t) + (t^2)^2(3t^2) = 4t^6 + 3t^6 = 7t^6$$`,
          t`ตรวจ::แทนก่อนแล้ว diff: $w = (t^2)^2\,t^3 = t^7$ จึงได้ $\frac{dw}{dt} = 7t^6$ ตรงกัน`,
        ],
        answer: t`$\dfrac{dw}{dt} = 7t^6$`,
      },
      {
        id: 't3b',
        q: t`$w = xy^2,\ x = t^2,\ y = 2t + 1$ จงหา $\frac{dw}{dt}$ ที่ $t = 1$`,
        hint: t`ที่ $t = 1$ จะได้ $x = 1,\ y = 3$ แทนตัวเลขเลยจะเร็วกว่า`,
        sol: [
          t`หาค่า x, y ที่ t = 1 ก่อน::$x = 1^2 = 1$ และ $y = 2(1) + 1 = 3$`,
          t`ชิ้นส่วนบน แล้วแทนตัวเลข::$\frac{\partial w}{\partial x} = y^2 = 9$ และ $\frac{\partial w}{\partial y} = 2xy = 2(1)(3) = 6$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 2t = 2$ และ $\frac{dy}{dt} = 2$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 9(2) + 6(2) = 30$$`,
        ],
        answer: t`$\left.\dfrac{dw}{dt}\right|_{t=1} = 30$`,
      },
      {
        id: 't3c',
        q: t`$w = \dfrac{x}{y},\ x = \cos t,\ y = \sin t$ จงหา $\frac{dw}{dt}$ และค่าที่ $t = \frac{\pi}{4}$`,
        sol: [
          t`ชิ้นส่วนบน::$w = x\,y^{-1}$ ดังนั้น $\frac{\partial w}{\partial x} = \frac{1}{y}$ และ $\frac{\partial w}{\partial y} = -\frac{x}{y^2}$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = -\sin t$ และ $\frac{dy}{dt} = \cos t$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = \frac{1}{y}(-\sin t) - \frac{x}{y^2}(\cos t)$$`,
          t`แทน x = cos t, y = sin t::$$= \frac{-\sin t}{\sin t} - \frac{\cos^2 t}{\sin^2 t} = -1 - \frac{\cos^2 t}{\sin^2 t}$$`,
          t`รวมเศษส่วน::$$= -\frac{\sin^2 t + \cos^2 t}{\sin^2 t} = -\frac{1}{\sin^2 t}$$ (ใช้ $\sin^2 t + \cos^2 t = 1$)`,
          t`แทน t = π/4::$\sin\frac{\pi}{4} = \frac{1}{\sqrt2}$ จึงได้ $\sin^2\frac{\pi}{4} = \frac12$ $$\frac{dw}{dt} = -\frac{1}{1/2} = -2$$`,
        ],
        answer: t`$\dfrac{dw}{dt} = -\dfrac{1}{\sin^2 t}$ และที่ $t = \frac{\pi}{4}$ ได้ $-2$`,
      },
    ],
  },

  /* ============================ ข้อ 4 ============================ */
  {
    id: 't4',
    num: 4,
    title: 'กฎลูกโซ่ 3 ตัวแปร',
    short: 'ลูกโซ่ 3 ตัวแปร',
    figure: 'chain3',
    figureTitle: 'เพิ่มกิ่ง z เป็น 3 เส้นทาง',
    figureHint: 'กดเล่นเพื่อดูทีละเส้นทาง เส้นทางที่สามคือเทอมที่คนลืมบ่อยที่สุด',
    concept: {
      eyebrow: 'เหมือนข้อ 3 แต่มี 3 กิ่ง',
      lead: t`ถ้า $w = f(x,y,z)$ และ $x, y, z$ เป็นฟังก์ชันของ $t$ แผนภาพเพชรจะมี 3 กิ่ง จึงได้ 3 เทอม`,
      formulas: [t`$$\frac{dw}{dt} = \frac{\partial w}{\partial x}\frac{dx}{dt} + \frac{\partial w}{\partial y}\frac{dy}{dt} + \frac{\partial w}{\partial z}\frac{dz}{dt}$$`],
      points: [t`ขั้นตอนเหมือนข้อ 3 ทุกอย่าง ต่างแค่ต้องนับให้ครบ **3 เทอม**`],
    },
    recipe: [
      t`**วาดแผนภาพ 3 กิ่ง** $w \to x, y, z \to t$`,
      t`ทำตาราง 3 แถว: แถวละ $\frac{\partial w}{\partial(\cdot)}$ กับ $\frac{d(\cdot)}{dt}$ ของ $x$, $y$, $z$`,
      t`คูณในแต่ละแถว แล้ว**บวกครบ 3 เทอม**`,
      t`แทนทุกตัวให้เป็น $t$ หรือแทนค่า $t$ ที่โจทย์ให้`,
    ],
    examples: [
      {
        src: 'Example 10',
        title: 'สามกิ่ง',
        q: t`จงหา $\frac{dw}{dt}$ ถ้า $w = xy + z,\ x = \cos t,\ y = \sin t,\ z = t$ และหาค่าที่ $t = 0$`,
        steps: [
          t`เขียนสูตร 3 กิ่ง::$$\frac{dw}{dt} = \frac{\partial w}{\partial x}\frac{dx}{dt} + \frac{\partial w}{\partial y}\frac{dy}{dt} + \frac{\partial w}{\partial z}\frac{dz}{dt}$$`,
          t`ชิ้นส่วนบน::$w = xy + z$ ดังนั้น $\frac{\partial w}{\partial x} = y$, $\frac{\partial w}{\partial y} = x$, $\frac{\partial w}{\partial z} = 1$ (เทอม $z$ diff เทียบ $z$ ได้ 1)`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = -\sin t$, $\frac{dy}{dt} = \cos t$, $\frac{dz}{dt} = 1$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = y(-\sin t) + x(\cos t) + 1(1)$$`,
          t`แทน x, y เป็น t::$$\frac{dw}{dt} = -\sin^2 t + \cos^2 t + 1$$`,
          t`แทน t = 0::$\sin 0 = 0,\ \cos 0 = 1$ $$\left.\frac{dw}{dt}\right|_{t=0} = -0 + 1 + 1 = 2$$`,
        ],
        answer: t`$\dfrac{dw}{dt} = -\sin^2 t + \cos^2 t + 1$ และที่ $t = 0$ ได้ $2$`,
      },
    ],
    traps: [
      t`ลืมเทอมที่สาม ให้นับให้ครบ 3 เทอมทุกครั้ง`,
      t`$\frac{\partial w}{\partial z}$ ของ $w = xy + z$ คือ 1 ไม่ใช่ 0`,
      t`ถ้าโจทย์ให้ค่า $t$ ให้หาค่า $x, y, z$ ที่ $t$ นั้นก่อน แล้วแทนเป็นตัวเลข จะลดโอกาสคำนวณผิด`,
    ],
    tutor: [
      t`สอนต่อจากข้อ 3 ทันที บอกน้องว่า "เพิ่มกิ่งเดียว" น้องจะไม่รู้สึกว่าเป็นเรื่องใหม่`,
      t`ให้น้องเขียนตาราง 3 แถว: $\partial w/\partial(\cdot)$ และ $d(\cdot)/dt$ สำหรับ $x, y, z$ แล้วคูณกันในแต่ละแถว`,
    ],
    practice: [
      {
        id: 't4a',
        q: t`$w = xyz,\ x = t,\ y = t^2,\ z = t^3$ จงหา $\frac{dw}{dt}$ ที่ $t = 1$`,
        sol: [
          t`หาค่าที่ t = 1 ก่อน::$x = 1,\ y = 1,\ z = 1$`,
          t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = yz = 1$, $\frac{\partial w}{\partial y} = xz = 1$, $\frac{\partial w}{\partial z} = xy = 1$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 1$, $\frac{dy}{dt} = 2t = 2$, $\frac{dz}{dt} = 3t^2 = 3$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 1(1) + 1(2) + 1(3) = 6$$`,
          t`ตรวจ::$w = t\cdot t^2\cdot t^3 = t^6$ ได้ $\frac{dw}{dt} = 6t^5 = 6$ ที่ $t = 1$`,
        ],
        answer: t`$\left.\dfrac{dw}{dt}\right|_{t=1} = 6$`,
      },
      {
        id: 't4b',
        q: t`$w = x^2 + y^2 + z^2,\ x = \cos t,\ y = \sin t,\ z = t$ จงหา $\frac{dw}{dt}$`,
        sol: [
          t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = 2x$, $\frac{\partial w}{\partial y} = 2y$, $\frac{\partial w}{\partial z} = 2z$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = -\sin t$, $\frac{dy}{dt} = \cos t$, $\frac{dz}{dt} = 1$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 2x(-\sin t) + 2y(\cos t) + 2z(1)$$`,
          t`แทนเป็น t::$$= -2\cos t\sin t + 2\sin t\cos t + 2t = 2t$$ สองเทอมแรกหักล้างกัน`,
        ],
        answer: t`$\dfrac{dw}{dt} = 2t$`,
      },
      {
        id: 't4c',
        q: t`$w = x^2y + z^2,\ x = t,\ y = t^2,\ z = 2t$ จงหา $\frac{dw}{dt}$ ที่ $t = 1$`,
        sol: [
          t`หาค่าที่ t = 1 ก่อน::$x = 1,\ y = 1,\ z = 2$`,
          t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = 2xy = 2$, $\frac{\partial w}{\partial y} = x^2 = 1$, $\frac{\partial w}{\partial z} = 2z = 4$`,
          t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 1$, $\frac{dy}{dt} = 2t = 2$, $\frac{dz}{dt} = 2$`,
          t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 2(1) + 1(2) + 4(2) = 12$$`,
        ],
        answer: t`$\left.\dfrac{dw}{dt}\right|_{t=1} = 12$`,
      },
    ],
  },

  /* ============================ ข้อ 5 ============================ */
  {
    id: 't5',
    num: 5,
    title: 'อนุพันธ์ระบุทิศทาง',
    short: 'ระบุทิศทาง',
    figure: 'direction',
    figureTitle: 'f = 2x² + y² ที่จุด P(−1, 1)',
    figureHint: 'ลากปลายลูกศรสีแดง (u) ให้หมุนรอบจุด P แล้วดูค่า D_u f เปลี่ยนตามมุม',
    concept: {
      eyebrow: 'สูตร',
      lead: t`อนุพันธ์ระบุทิศทางบอกว่า $f$ เปลี่ยนเร็วแค่ไหน**เมื่อเดินไปในทิศ $\vec u$** คำนวณจาก**ผลคูณเชิงสเกลาร์ (dot)** ของแกรเดียนต์กับเวกเตอร์หนึ่งหน่วย`,
      formulas: [
        t`$$\left(\frac{df}{ds}\right)_{\vec u,\,P_0} = (\nabla f)_{P_0}\cdot\vec u$$`,
        t`$$\nabla f = \frac{\partial f}{\partial x}\,\vec i + \frac{\partial f}{\partial y}\,\vec j \ \left(+ \frac{\partial f}{\partial z}\,\vec k\right), \qquad \vec u = \frac{\vec v}{|\vec v|}, \qquad |\vec v| = \sqrt{a^2 + b^2\,(+\,c^2)}$$`,
        t`$$(a_1\vec i + b_1\vec j)\cdot(a_2\vec i + b_2\vec j) = a_1a_2 + b_1b_2$$`,
      ],
      points: [
        t`อีกรูปแบบ: $D_{\vec u}f = |\nabla f|\cos\theta$ ค่ามากสุดคือ $|\nabla f|$ ซึ่งเกิดในทิศของ $\nabla f$`,
      ],
    },
    recipe: [
      t`หา $\nabla f$ คือหา $f_x$, $f_y$ (และ $f_z$) แล้วเขียนเป็น $f_x\vec i + f_y\vec j$`,
      t`**แทนจุด $P_0$** ลงใน $\nabla f$ ให้เป็นตัวเลข`,
      t`หา $|\vec v|$ แล้ว**หารทุกตัว**ด้วย $|\vec v|$ ได้ $\vec u$`,
      t`**dot**: คูณตัวหน้า $\vec i$ กับตัวหน้า $\vec i$ คูณตัวหน้า $\vec j$ กับตัวหน้า $\vec j$ แล้วบวกกัน`,
    ],
    examples: [
      {
        src: 'Example 1',
        title: '2 ตัวแปร',
        q: t`จงหาอนุพันธ์ของ $f(x,y) = xe^y + \cos(xy)$ ที่จุด $(2,0)$ ในทิศทางของ $\vec v = 3\vec i - 4\vec j$`,
        steps: [
          t`หา ∂f/∂x (y คงที่)::$xe^y \to e^y$ และ $\cos(xy) \to -\sin(xy)\cdot y$ (chain rule) $$\frac{\partial f}{\partial x} = e^y - y\sin(xy)$$`,
          t`หา ∂f/∂y (x คงที่)::$xe^y \to xe^y$ และ $\cos(xy) \to -\sin(xy)\cdot x$ $$\frac{\partial f}{\partial y} = xe^y - x\sin(xy)$$`,
          t`แทนจุด (2, 0)::$e^0 = 1$ และ $\sin 0 = 0$ $$f_x = 1 - 0 = 1,\quad f_y = 2(1) - 0 = 2 \;\Rightarrow\; (\nabla f)_{P_0} = \vec i + 2\vec j$$`,
          t`ทำ v ให้เป็นเวกเตอร์หนึ่งหน่วย::$$|\vec v| = \sqrt{3^2 + (-4)^2} = \sqrt{25} = 5 \;\Rightarrow\; \vec u = \frac{3}{5}\vec i - \frac{4}{5}\vec j$$`,
          t`dot กัน::$$\left(\frac{df}{ds}\right)_{\vec u,(2,0)} = (1)\left(\tfrac35\right) + (2)\left(-\tfrac45\right) = \tfrac35 - \tfrac85 = -1$$`,
        ],
        answer: t`$\left(\dfrac{df}{ds}\right)_{\vec u,(2,0)} = -1$`,
      },
      {
        src: 'Example 4',
        title: '3 ตัวแปร',
        q: t`จงหาอนุพันธ์ของ $f(x,y,z) = x^3 - xy^2 - z$ ที่จุด $(1,1,0)$ ในทิศทางของ $\vec v = 2\vec i - 3\vec j + 6\vec k$`,
        steps: [
          t`ทำ v ให้เป็นเวกเตอร์หนึ่งหน่วย::$$|\vec v| = \sqrt{2^2 + (-3)^2 + 6^2} = \sqrt{49} = 7 \;\Rightarrow\; \vec u = \tfrac27\vec i - \tfrac37\vec j + \tfrac67\vec k$$`,
          t`หา ∇f ทั้ง 3 ส่วน::$f_x = 3x^2 - y^2$, $f_y = -2xy$, $f_z = -1$ $$\nabla f = (3x^2 - y^2)\vec i - 2xy\,\vec j - \vec k$$`,
          t`แทนจุด (1, 1, 0)::$$(\nabla f)_{P_0} = (3 - 1)\vec i - 2\vec j - \vec k = 2\vec i - 2\vec j - \vec k$$`,
          t`dot กัน::$$(2)\left(\tfrac27\right) + (-2)\left(-\tfrac37\right) + (-1)\left(\tfrac67\right) = \tfrac47 + \tfrac67 - \tfrac67 = \tfrac47$$`,
        ],
        answer: t`$\left(\dfrac{df}{ds}\right)_{\vec u,P_0} = \dfrac47$`,
      },
    ],
    traps: [
      t`ลืมหารด้วย $|\vec v|$ เป็นจุดที่เสียคะแนนบ่อยที่สุด`,
      t`เครื่องหมายลบใน $\vec v$ เช่น $-4\vec j$ ยกกำลังสองแล้วได้ $+16$ แต่ตอน dot ต้องเก็บเครื่องหมายลบไว้`,
      t`ถ้าโจทย์บอกทิศ "จาก P ไป Q" ต้องใช้ $\vec v = Q - P$ ไม่ใช่พิกัดของ Q`,
    ],
    tutor: [
      t`เขียน 4 ขั้นไว้มุมกระดานตลอดการติวหัวข้อนี้ ให้น้องติ๊กทีละขั้น`,
      t`เปิดรูปให้น้องหมุน $\vec u$ เอง จะเห็นว่าค่ามากสุดเมื่อ $\vec u$ ชี้ทางเดียวกับ $\nabla f$ และเป็น 0 เมื่อตั้งฉาก`,
      t`โจทย์ Quiz 3 ข้อด้านล่างเป็นแนวที่อาจารย์ออก ให้น้องทำเองก่อนแล้วค่อยเฉลย`,
    ],
    practice: [
      {
        id: 't5a',
        src: 'Quiz 24/09',
        q: t`จงหาอนุพันธ์ของ $f(x,y) = 2xy - 3y^2$ ที่จุด $P_0(5,5)$ ในทิศทางของ $\vec A = 4\vec i + 3\vec j$`,
        sol: [
          t`หา ∇f::$f_x = 2y$ และ $f_y = 2x - 6y$ $$\nabla f = 2y\,\vec i + (2x - 6y)\,\vec j$$`,
          t`แทนจุด (5, 5)::$$(\nabla f)_{P_0} = 10\,\vec i + (10 - 30)\,\vec j = 10\vec i - 20\vec j$$`,
          t`หา u::$$|\vec A| = \sqrt{4^2 + 3^2} = 5 \;\Rightarrow\; \vec u = \tfrac45\vec i + \tfrac35\vec j$$`,
          t`dot กัน::$$10\left(\tfrac45\right) + (-20)\left(\tfrac35\right) = 8 - 12 = -4$$`,
        ],
        answer: t`$\left(\dfrac{df}{ds}\right)_{\vec u,P_0} = -4$`,
      },
      {
        id: 't5b',
        src: 'Quiz 1/10',
        q: t`จงหาอนุพันธ์ของ $f(x,y) = 2x^2 + y^2$ ที่จุด $P_0(-1,1)$ ในทิศทางของ $\vec A = 3\vec i - 4\vec j$`,
        sol: [
          t`หา ∇f::$f_x = 4x$ และ $f_y = 2y$ $$\nabla f = 4x\,\vec i + 2y\,\vec j$$`,
          t`แทนจุด (−1, 1)::$$(\nabla f)_{P_0} = -4\vec i + 2\vec j$$`,
          t`หา u::$$|\vec A| = \sqrt{3^2 + (-4)^2} = 5 \;\Rightarrow\; \vec u = \tfrac35\vec i - \tfrac45\vec j$$`,
          t`dot กัน::$$(-4)\left(\tfrac35\right) + (2)\left(-\tfrac45\right) = -\tfrac{12}{5} - \tfrac85 = -\tfrac{20}{5} = -4$$`,
        ],
        answer: t`$\left(\dfrac{df}{ds}\right)_{\vec u,P_0} = -4$`,
      },
      {
        id: 't5c',
        src: 'Quiz 1/10',
        q: t`ให้ $f(x,y) = x - y,\ g(x,y) = 3y$ จงหา $\nabla\!\left(\frac{f}{g}\right)$`,
        hint: t`ใช้กฎผลหารของแกรเดียนต์ $\nabla\!\left(\frac{f}{g}\right) = \frac{g\nabla f - f\nabla g}{g^2}$`,
        sol: [
          t`หา ∇f และ ∇g::$\nabla f = \vec i - \vec j$ และ $\nabla g = 0\,\vec i + 3\vec j = 3\vec j$`,
          t`แทนลงกฎผลหาร::$$\nabla\!\left(\frac{f}{g}\right) = \frac{3y(\vec i - \vec j) - (x - y)(3\vec j)}{(3y)^2}$$`,
          t`กระจายตัวเศษ::$$3y\,\vec i - 3y\,\vec j - 3x\,\vec j + 3y\,\vec j = 3y\,\vec i - 3x\,\vec j$$`,
          t`หารด้วย 9y²::$$\nabla\!\left(\frac{f}{g}\right) = \frac{3y}{9y^2}\vec i - \frac{3x}{9y^2}\vec j = \frac{1}{3y}\,\vec i - \frac{x}{3y^2}\,\vec j$$`,
          t`ตรวจ::$\frac{f}{g} = \frac{x}{3y} - \frac13$ diff ตรงๆ ได้ $\frac{1}{3y}$ และ $-\frac{x}{3y^2}$ ตรงกัน`,
        ],
        answer: t`$\nabla\!\left(\dfrac{f}{g}\right) = \dfrac{1}{3y}\,\vec i - \dfrac{x}{3y^2}\,\vec j$`,
      },
      {
        id: 't5d',
        q: t`จงหาอนุพันธ์ของ $f(x,y,z) = xy + yz + zx$ ที่จุด $(1,-1,2)$ ในทิศทางของ $\vec v = 3\vec i + 6\vec j - 2\vec k$`,
        sol: [
          t`หา ∇f::$f_x = y + z$, $f_y = x + z$, $f_z = y + x$`,
          t`แทนจุด (1, −1, 2)::$$(\nabla f)_{P_0} = (-1 + 2)\vec i + (1 + 2)\vec j + (-1 + 1)\vec k = \vec i + 3\vec j + 0\vec k$$`,
          t`หา u::$$|\vec v| = \sqrt{9 + 36 + 4} = 7 \;\Rightarrow\; \vec u = \tfrac37\vec i + \tfrac67\vec j - \tfrac27\vec k$$`,
          t`dot กัน::$$(1)\left(\tfrac37\right) + (3)\left(\tfrac67\right) + (0)\left(-\tfrac27\right) = \tfrac37 + \tfrac{18}{7} = 3$$`,
        ],
        answer: t`$\left(\dfrac{df}{ds}\right)_{\vec u,P_0} = 3$`,
      },
    ],
  },

  /* ============================ ข้อ 6 ============================ */
  {
    id: 't6',
    num: 6,
    title: 'เส้นสัมผัส level curve',
    short: 'เส้นสัมผัส',
    figure: 'level',
    figureTitle: 'วงรี x²/4 + y² = c',
    figureHint: 'ลากจุด P ไปที่ไหนก็ได้ เส้นสัมผัสกับ ∇f จะเปลี่ยนตาม และตั้งฉากกันเสมอ',
    concept: {
      eyebrow: 'หลักการ',
      lead: t`ที่ทุกจุด $\nabla f$ จะ**ตั้งฉาก**กับ level curve $f(x,y) = c$ จึงใช้ $\vec N = (\nabla f)_{P_0}$ เป็นเวกเตอร์ตั้งฉากของเส้นสัมผัส แล้วตั้ง dot ให้เท่ากับ 0`,
      formulas: [
        t`$$\vec N\cdot\big[(x - x_0)\,\vec i + (y - y_0)\,\vec j\big] = 0$$`,
        t`$$f_x(x_0,y_0)\,(x - x_0) + f_y(x_0,y_0)\,(y - y_0) = 0$$`,
      ],
      points: [t`ถ้าโจทย์ให้สมการมาในรูป "อะไรสักอย่าง $= c$" ให้ตั้ง $f(x,y)$ เป็น**ฝั่งที่มีตัวแปร**ทั้งหมด`],
    },
    recipe: [
      t`ตั้ง $f(x,y)$ จากฝั่งซ้ายของสมการ แล้ว**ตรวจว่าจุดอยู่บนเส้นโค้ง**`,
      t`หา $\vec N = \nabla f = f_x\vec i + f_y\vec j$`,
      t`**แทนจุด** $P_0(x_0, y_0)$ ลงใน $\vec N$`,
      t`เขียน $f_x(x - x_0) + f_y(y - y_0) = 0$ แล้ว**กระจายและจัดรูป**`,
      t`ตรวจโดยแทน $(x_0, y_0)$ ลงในคำตอบ ต้องเป็นจริง`,
    ],
    examples: [
      {
        src: 'Example 2',
        title: 'สัมผัสวงรี',
        q: t`จงหาสมการเส้นตรงที่สัมผัสวงรี $\dfrac{x^2}{4} + y^2 = 2$ ที่จุด $(-2, 1)$`,
        steps: [
          t`ตั้ง f และตรวจจุด::$f(x,y) = \frac{x^2}{4} + y^2$ และที่ $(-2,1)$: $\frac{4}{4} + 1 = 2$ จุดอยู่บนวงรีจริง`,
          t`หา N = ∇f::$$\nabla f = \frac{\partial}{\partial x}\left(\frac{x^2}{4}\right)\vec i + \frac{\partial}{\partial y}(y^2)\,\vec j = \frac{x}{2}\,\vec i + 2y\,\vec j$$`,
          t`แทนจุด (−2, 1)::$$\vec N = \frac{-2}{2}\,\vec i + 2(1)\,\vec j = -\vec i + 2\vec j$$`,
          t`ตั้ง dot = 0::$$(-\vec i + 2\vec j)\cdot\big[(x + 2)\vec i + (y - 1)\vec j\big] = 0$$ สังเกต $x - (-2) = x + 2$`,
          t`กระจายและจัดรูป::$$-(x + 2) + 2(y - 1) = 0 \;\Rightarrow\; -x - 2 + 2y - 2 = 0 \;\Rightarrow\; 2y - x = 4$$`,
          t`ตรวจ::แทน $(-2, 1)$: $2(1) - (-2) = 4$ เป็นจริง`,
        ],
        answer: t`$2y - x = 4$`,
      },
    ],
    traps: [
      t`เครื่องหมายใน $(x - x_0)$: ถ้า $x_0 = -2$ จะได้ $(x + 2)$`,
      t`ตรวจก่อนว่าจุดอยู่บนเส้นโค้งจริง โดยแทนค่าลงในสมการแล้วต้องได้ $c$`,
      t`ตรวจคำตอบโดยแทน $(x_0, y_0)$ ลงในสมการเส้นสัมผัส ต้องเป็นจริง`,
    ],
    tutor: [
      t`เชื่อมกับข้อ 5 ว่าใช้ $\nabla f$ ตัวเดียวกัน แค่เอาไปทำต่ออีกแบบ`,
      t`เปิดรูปให้น้องลากจุดเอง น้องจะเห็นว่า $\nabla f$ ตั้งฉากกับเส้นสัมผัสทุกตำแหน่ง จึงต้องตั้ง dot ให้เท่ากับ 0`,
    ],
    practice: [
      {
        id: 't6a',
        q: t`ให้ $f(x,y) = 100 - x^2 - y^2$ จงหาสมการเส้นสัมผัส level curve $f(x,y) = 75$ ที่จุด $(3,4)$`,
        hint: t`level curve นี้คือวงกลม $x^2 + y^2 = 25$ (จาก Example 1 ในสไลด์ชุดแรก)`,
        sol: [
          t`ตรวจจุด::$100 - 9 - 16 = 75$ จุดอยู่บนเส้นโค้งจริง`,
          t`หา N = ∇f::$$\nabla f = -2x\,\vec i - 2y\,\vec j$$`,
          t`แทนจุด (3, 4)::$$\vec N = -6\vec i - 8\vec j$$`,
          t`ตั้งสมการ::$$-6(x - 3) - 8(y - 4) = 0$$`,
          t`กระจายและจัดรูป::$$-6x + 18 - 8y + 32 = 0 \;\Rightarrow\; 6x + 8y = 50 \;\Rightarrow\; 3x + 4y = 25$$`,
        ],
        answer: t`$3x + 4y = 25$`,
      },
      {
        id: 't6b',
        q: t`จงหาสมการเส้นสัมผัส $xy = 6$ ที่จุด $(2,3)$`,
        sol: [
          t`ตั้ง f::$f(x,y) = xy$ และที่ $(2,3)$: $2\cdot3 = 6$ ใช้ได้`,
          t`หา N = ∇f แล้วแทนจุด::$$\nabla f = y\,\vec i + x\,\vec j \;\Rightarrow\; \vec N = 3\vec i + 2\vec j$$`,
          t`ตั้งสมการ แล้วจัดรูป::$$3(x - 2) + 2(y - 3) = 0 \;\Rightarrow\; 3x - 6 + 2y - 6 = 0 \;\Rightarrow\; 3x + 2y = 12$$`,
        ],
        answer: t`$3x + 2y = 12$`,
      },
      {
        id: 't6c',
        q: t`จงหาสมการเส้นสัมผัส $x^2 - xy + y^2 = 7$ ที่จุด $(-1,2)$`,
        hint: t`ตรวจจุดก่อน: $1 + 2 + 4 = 7$ ใช้ได้`,
        sol: [
          t`ตั้ง f และตรวจจุด::$f = x^2 - xy + y^2$ ที่ $(-1,2)$: $1 - (-2) + 4 = 7$ ใช้ได้`,
          t`หา N = ∇f::$f_x = 2x - y$ และ $f_y = -x + 2y$`,
          t`แทนจุด (−1, 2)::$f_x = -2 - 2 = -4$ และ $f_y = 1 + 4 = 5$ ดังนั้น $\vec N = -4\vec i + 5\vec j$`,
          t`ตั้งสมการ แล้วจัดรูป::$$-4(x + 1) + 5(y - 2) = 0 \;\Rightarrow\; -4x - 4 + 5y - 10 = 0 \;\Rightarrow\; 5y - 4x = 14$$`,
        ],
        answer: t`$5y - 4x = 14$`,
      },
    ],
  },
];

/* ============================ ข้อสอบจำลอง ============================ */
export const mock: Practice[] = [
  {
    id: 'm1', src: 'ข้อ 1',
    q: t`$f(x,y) = x^2y^3 + 4xy - 5$ จงหา $\frac{\partial f}{\partial x}$ และ $\frac{\partial f}{\partial y}$ ที่จุด $(1,-1)$`,
    sol: [
      t`หา f_x (y คงที่)::$$f_x = 2xy^3 + 4y \;\Rightarrow\; f_x(1,-1) = 2(1)(-1) + 4(-1) = -6$$`,
      t`หา f_y (x คงที่)::$$f_y = 3x^2y^2 + 4x \;\Rightarrow\; f_y(1,-1) = 3(1)(1) + 4(1) = 7$$`,
    ],
    answer: t`$f_x(1,-1) = -6,\quad f_y(1,-1) = 7$`,
  },
  {
    id: 'm2', src: 'ข้อ 2',
    q: t`ถ้า $f(x,y) = x\sin y + y^2e^x$ จงหา $\frac{\partial^2 f}{\partial x^2}$, $\frac{\partial^2 f}{\partial y^2}$ และ $\frac{\partial^2 f}{\partial y\,\partial x}$`,
    sol: [
      t`อันดับหนึ่ง::$$\frac{\partial f}{\partial x} = \sin y + y^2e^x, \qquad \frac{\partial f}{\partial y} = x\cos y + 2ye^x$$`,
      t`∂²f/∂x²::diff $\sin y + y^2e^x$ เทียบ $x$ $$\frac{\partial^2 f}{\partial x^2} = y^2e^x$$`,
      t`∂²f/∂y²::diff $x\cos y + 2ye^x$ เทียบ $y$ $$\frac{\partial^2 f}{\partial y^2} = -x\sin y + 2e^x$$`,
      t`∂²f/∂y∂x::diff $\frac{\partial f}{\partial x} = \sin y + y^2e^x$ เทียบ $y$ $$\frac{\partial^2 f}{\partial y\,\partial x} = \cos y + 2ye^x$$`,
    ],
    answer: t`$y^2e^x,\quad -x\sin y + 2e^x,\quad \cos y + 2ye^x$`,
  },
  {
    id: 'm3', src: 'ข้อ 3',
    q: t`$w = x^2 + 3xy,\ x = 2t,\ y = t^2$ จงหา $\frac{dw}{dt}$ ที่ $t = 1$`,
    sol: [
      t`หาค่าที่ t = 1 ก่อน::$x = 2,\ y = 1$`,
      t`ชิ้นส่วนบนและล่าง::$\frac{\partial w}{\partial x} = 2x + 3y = 7$, $\frac{\partial w}{\partial y} = 3x = 6$, $\frac{dx}{dt} = 2$, $\frac{dy}{dt} = 2t = 2$`,
      t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 7(2) + 6(2) = 26$$`,
    ],
    answer: t`$26$`,
  },
  {
    id: 'm4', src: 'ข้อ 4',
    q: t`$w = xy + z^2,\ x = \cos t,\ y = \sin t,\ z = t$ จงหา $\frac{dw}{dt}$ และค่าที่ $t = 0$`,
    sol: [
      t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = y$, $\frac{\partial w}{\partial y} = x$, $\frac{\partial w}{\partial z} = 2z$`,
      t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = -\sin t$, $\frac{dy}{dt} = \cos t$, $\frac{dz}{dt} = 1$`,
      t`คูณตามกิ่ง แล้วบวก แล้วแทนเป็น t::$$\frac{dw}{dt} = y(-\sin t) + x\cos t + 2z = -\sin^2 t + \cos^2 t + 2t$$`,
      t`แทน t = 0::$$-0 + 1 + 0 = 1$$`,
    ],
    answer: t`$-\sin^2 t + \cos^2 t + 2t$ และที่ $t = 0$ ได้ $1$`,
  },
  {
    id: 'm5', src: 'ข้อ 5',
    q: t`จงหาอนุพันธ์ของ $f(x,y) = x^2y - 3y$ ที่จุด $(2,1)$ ในทิศทางของ $\vec v = 3\vec i + 4\vec j$`,
    sol: [
      t`หา ∇f แล้วแทนจุด::$$\nabla f = 2xy\,\vec i + (x^2 - 3)\,\vec j \;\Rightarrow\; (\nabla f)_{(2,1)} = 4\vec i + \vec j$$`,
      t`หา u::$|\vec v| = 5$ ดังนั้น $\vec u = \tfrac35\vec i + \tfrac45\vec j$`,
      t`dot กัน::$$4\left(\tfrac35\right) + 1\left(\tfrac45\right) = \tfrac{12}{5} + \tfrac45 = \tfrac{16}{5}$$`,
    ],
    answer: t`$\dfrac{16}{5}$`,
  },
  {
    id: 'm6', src: 'ข้อ 6',
    q: t`จงหาสมการเส้นสัมผัส level curve $x^2 + 2y^2 = 3$ ที่จุด $(1,1)$`,
    sol: [
      t`หา N::$\nabla f = 2x\,\vec i + 4y\,\vec j$ ที่ $(1,1)$ ได้ $\vec N = 2\vec i + 4\vec j$`,
      t`ตั้งสมการ แล้วจัดรูป::$$2(x - 1) + 4(y - 1) = 0 \;\Rightarrow\; 2x + 4y = 6 \;\Rightarrow\; x + 2y = 3$$`,
    ],
    answer: t`$x + 2y = 3$`,
  },
];

export const plan = [
  { time: '0:00–0:15', what: 'สูตรการดิฟ', note: 'ทบทวนตารางสูตร แล้วเล่นการ์ดฝึกจำให้ได้ทุกใบ' },
  { time: '0:15–0:40', what: 'ข้อ 1 อนุพันธ์ย่อยอันดับหนึ่ง', note: 'ฝึกมองตัวแปรอื่นเป็นค่าคงที่ ใช้ product และ chain rule ให้คล่อง' },
  { time: '0:40–1:00', what: 'ข้อ 2 อันดับสอง', note: 'diff ซ้ำอีกรอบ ระวังลำดับของ ∂²f/∂y∂x' },
  { time: '1:00–1:40', what: 'ข้อ 3 และ 4 กฎลูกโซ่', note: 'วาดแผนภาพเพชรแบบที่อาจารย์วาดทุกครั้ง' },
  { time: '1:40–1:50', what: 'พัก', note: '' },
  { time: '1:50–2:20', what: 'ข้อ 5 อนุพันธ์ระบุทิศทาง', note: 'มีโจทย์ Quiz 3 ข้อ ให้ทำให้คล่อง' },
  { time: '2:20–2:40', what: 'ข้อ 6 เส้นสัมผัส level curve', note: 'ทำ 5 ขั้นตามกล่องวิธีทำ' },
  { time: '2:40–3:10', what: 'ข้อสอบจำลอง จับเวลา 30 นาที', note: 'ทำให้ครบโดยไม่เปิดเฉลย แล้วค่อยตรวจ' },
];
