// บทเรียนแบบสอนทีละขั้น + ตัวอย่างเพิ่ม (ง่าย → กลาง)
// say = ช่วงอธิบาย, check = คำถามสั้นให้ตอบก่อนไปต่อ
import type { Example } from './topics';

const t = String.raw;

export type LessonBlock =
  | { kind: 'say'; title: string; body: string }
  | { kind: 'check'; q: string; choices: string[]; answer: number; explain: string };

export const lessons: Record<string, LessonBlock[]> = {
  /* ---------------- ทบทวนการดิฟ ---------------- */
  rules: [
    {
      kind: 'say', title: 'อนุพันธ์คืออะไร',
      body: t`อนุพันธ์บอกว่า**ฟังก์ชันเปลี่ยนเร็วแค่ไหน** ณ จุดหนึ่ง ถ้าวาดกราฟ ค่าอนุพันธ์ก็คือ**ความชันของเส้นสัมผัส**ที่จุดนั้น เช่น $f(x) = x^2$ มี $f'(x) = 2x$ ที่ $x = 3$ ความชันเท่ากับ $2(3) = 6$ แปลว่าตรงนั้นกราฟชันขึ้น 6 หน่วยต่อการเดินไปทางขวา 1 หน่วย`,
    },
    {
      kind: 'say', title: 'กฎยกกำลัง: สูตรที่ใช้บ่อยที่สุด',
      body: t`**ดึงเลขชี้กำลังลงมาคูณข้างหน้า แล้วลดกำลังลง 1** $$\frac{d}{dx}x^n = n\,x^{n-1}$$ ลองดูตัวอย่าง: $x^5 \to 5x^4$, $\ 3x^2 \to 3\cdot 2x = 6x$, $\ x \to 1$, $\ 7 \to 0$ (ค่าคงที่ diff ได้ 0) และรากกับเศษส่วนก็ใช้ได้ถ้าเขียนเป็นเลขยกกำลังก่อน $$\sqrt{x} = x^{1/2} \to \tfrac12 x^{-1/2} = \frac{1}{2\sqrt x}, \qquad \frac1x = x^{-1} \to -x^{-2} = -\frac{1}{x^2}$$`,
    },
    {
      kind: 'check', q: t`$\dfrac{d}{dx}\left(4x^3\right) = \ ?$`,
      choices: [t`$12x^2$`, t`$4x^2$`, t`$12x^3$`, t`$3x^2$`], answer: 0,
      explain: t`ดึง 3 ลงมาคูณ 4 ได้ 12 แล้วลดกำลังจาก 3 เป็น 2 จึงได้ $12x^2$`,
    },
    {
      kind: 'say', title: 'ผลคูณ: หน้า diff หลัง + หลัง diff หน้า',
      body: t`ถ้าสองฟังก์ชันคูณกัน **ห้าม diff แยกแล้วเอามาคูณ** ต้องใช้ $$(uv)' = u'v + uv'$$ เช่น $x^2\sin x$: ให้ $u = x^2$ ($u' = 2x$) และ $v = \sin x$ ($v' = \cos x$) $$\frac{d}{dx}(x^2\sin x) = 2x\sin x + x^2\cos x$$`,
    },
    {
      kind: 'say', title: 'ลูกโซ่: ฟังก์ชันซ้อนกัน',
      body: t`ถ้ามีฟังก์ชันอยู่ข้างในอีกชั้น ให้ **diff ข้างนอก (คงข้างในไว้เหมือนเดิม) แล้วคูณด้วย diff ข้างใน** $$\frac{d}{dx}f(u) = f'(u)\cdot u'$$ ตัวอย่าง: $(3x + 1)^5 \to 5(3x+1)^4\cdot 3$, $\ \sin(x^2) \to \cos(x^2)\cdot 2x$, $\ e^{5x} \to e^{5x}\cdot 5$ จุดที่คนลืมบ่อยที่สุดคือ**ตัวคูณข้างใน**`,
    },
    {
      kind: 'check', q: t`$\dfrac{d}{dx}\,e^{x^2} = \ ?$`,
      choices: [t`$2x\,e^{x^2}$`, t`$e^{x^2}$`, t`$x^2e^{x^2-1}$`, t`$2e^{x^2}$`], answer: 0,
      explain: t`ข้างนอกคือ $e^{(\cdot)}$ diff แล้วได้ตัวเดิม $e^{x^2}$ จากนั้นคูณ diff ข้างใน $\frac{d}{dx}x^2 = 2x$`,
    },
    {
      kind: 'say', title: 'ผลหาร: ล่าง diff บน ลบ บน diff ล่าง ส่วน ล่างกำลังสอง',
      body: t`$$\left(\frac{u}{v}\right)' = \frac{v\,u' - u\,v'}{v^2}$$ ท่องว่า "ล่าง diff บน ลบ บน diff ล่าง ส่วน ล่างกำลังสอง" เช่น $$\frac{d}{dx}\left(\frac{x}{x+1}\right) = \frac{(x+1)(1) - x(1)}{(x+1)^2} = \frac{1}{(x+1)^2}$$ ถ้าตัวบนเป็นค่าคงที่ เขียนเป็นเลขยกกำลังลบแล้วใช้ลูกโซ่จะง่ายกว่า`,
    },
    {
      kind: 'check', q: t`$\dfrac{d}{dx}\ln(3x) = \ ?$`,
      choices: [t`$\dfrac{1}{x}$`, t`$\dfrac{3}{x}$`, t`$\dfrac{1}{3x}$`, t`$\dfrac{\ln 3}{x}$`], answer: 0,
      explain: t`ใช้ $\frac{d}{dx}\ln u = \frac{u'}{u}$ โดย $u = 3x$ และ $u' = 3$ จะได้ $\frac{3}{3x} = \frac{1}{x}$`,
    },
    {
      kind: 'say', title: 'พร้อมไปข้อ 1 แล้ว',
      body: t`ทุกข้อในข้อสอบใช้แค่สูตรพวกนี้ อนุพันธ์ย่อยไม่ได้มีสูตรใหม่ แค่เพิ่มกติกาว่า**ตัวแปรที่ไม่ได้ diff ให้มองเป็นค่าคงที่** เปิดตารางด้านล่างไว้ดูประกอบได้ตลอด`,
    },
  ],

  /* ---------------- ข้อ 1 ---------------- */
  t1: [
    {
      kind: 'say', title: 'ฟังก์ชันสองตัวแปร',
      body: t`$f(x,y)$ คือฟังก์ชันที่มีสองตัวแปร เช่น อุณหภูมิบนแผ่นเหล็กที่ตำแหน่ง $(x, y)$ ถ้าเราเดินไปตาม**แกน $x$ อย่างเดียว** ($y$ ไม่เปลี่ยน) แล้วถามว่าอุณหภูมิเปลี่ยนเร็วแค่ไหน คำตอบคือ $\frac{\partial f}{\partial x}$ สัญลักษณ์ $\partial$ อ่านว่า "พาร์เชียล" ใช้แทน $d$ เพื่อบอกว่ามีตัวแปรหลายตัว`,
    },
    {
      kind: 'say', title: 'เคล็ดลับ: แทนตัวแปรอื่นด้วยตัวเลขในใจ',
      body: t`ลองกับ $f = x^2y^3$ ถ้าเราล็อก $y = 2$ ไว้ จะได้ $f = x^2(2)^3 = 8x^2$ ซึ่ง diff เทียบ $x$ ได้ $16x$ สังเกตว่า $16x = 2x\cdot(2)^3$ ถ้าปล่อย $y$ ไว้เป็นตัวอักษรก็จะได้ $$\frac{\partial f}{\partial x} = 2x\,y^3$$ นี่คือทั้งหมดของอนุพันธ์ย่อย: **ตัวแปรที่ไม่ได้ diff ทำตัวเหมือนตัวเลข**`,
    },
    {
      kind: 'say', title: 'ลองทั้งสองทิศ',
      body: t`$f = x^2y^3$ $$\frac{\partial f}{\partial x} = 2x\,y^3 \quad (y^3 \text{ เป็นค่าคงที่ที่คูณอยู่}), \qquad \frac{\partial f}{\partial y} = x^2\cdot 3y^2 = 3x^2y^2 \quad (x^2 \text{ เป็นค่าคงที่})$$`,
    },
    {
      kind: 'check', q: t`$\dfrac{\partial}{\partial x}\left(5xy^2\right) = \ ?$`,
      choices: [t`$5y^2$`, t`$10xy$`, t`$5x$`, t`$0$`], answer: 0,
      explain: t`$5y^2$ เป็นค่าคงที่ที่คูณ $x$ อยู่ และ $\frac{d}{dx}x = 1$ จึงได้ $5y^2$`,
    },
    {
      kind: 'say', title: 'เทอมที่ไม่มีตัวแปรที่ diff ได้ 0',
      body: t`เพราะทั้งเทอมเป็นค่าคงที่ เช่น $\frac{\partial}{\partial x}(y^3 + 4) = 0$ แต่ระวัง $\frac{\partial}{\partial x}(3xy) = 3y$ ไม่ใช่ 0 เพราะยังมี $x$ อยู่ในเทอม`,
    },
    {
      kind: 'check', q: t`$\dfrac{\partial}{\partial y}\left(x^3 + 2y\right) = \ ?$`,
      choices: [t`$2$`, t`$3x^2 + 2$`, t`$0$`, t`$2y$`], answer: 0,
      explain: t`$x^3$ ไม่มี $y$ จึงได้ 0 ส่วน $2y$ diff เทียบ $y$ ได้ 2`,
    },
    {
      kind: 'say', title: 'ลูกโซ่ในอนุพันธ์ย่อย',
      body: t`สูตรลูกโซ่ใช้ได้เหมือนเดิม แค่ตอนคูณ "diff ข้างใน" ให้ diff เทียบตัวแปรที่โจทย์ถาม $$\frac{\partial}{\partial x}e^{xy} = e^{xy}\cdot\frac{\partial}{\partial x}(xy) = y\,e^{xy}, \qquad \frac{\partial}{\partial y}e^{xy} = x\,e^{xy}$$`,
    },
    {
      kind: 'check', q: t`$\dfrac{\partial}{\partial y}\sin(x^2y) = \ ?$`,
      choices: [t`$x^2\cos(x^2y)$`, t`$\cos(x^2y)$`, t`$2xy\cos(x^2y)$`, t`$-x^2\cos(x^2y)$`], answer: 0,
      explain: t`diff ข้างนอก: $\sin \to \cos$ แล้วคูณ $\frac{\partial}{\partial y}(x^2y) = x^2$`,
    },
    {
      kind: 'say', title: 'ถ้าโจทย์ให้จุดมา',
      body: t`diff ให้เสร็จก่อนเสมอ แล้วค่อยแทนตัวเลข เช่น $f = x^2y^3$ ที่ $(1, 2)$: $f_x = 2xy^3 = 2(1)(8) = 16$ ถ้าแทนก่อน diff จะได้ค่าคงที่แล้ว diff ได้ 0 ซึ่งผิด ไปลองตัวอย่างด้านล่างได้เลย`,
    },
  ],

  /* ---------------- ข้อ 2 ---------------- */
  t2: [
    {
      kind: 'say', title: 'อันดับสอง = diff ซ้ำอีกครั้ง',
      body: t`ตัวแปรเดียว: $f = x^3 \to f' = 3x^2 \to f'' = 6x$ สองตัวแปรก็เหมือนกัน แต่ $f_x$ และ $f_y$ ต่างก็เป็นฟังก์ชันของ $x, y$ จึง diff ต่อได้อีกตัวละ 2 แบบ รวมเป็น **4 ตัว**: $f_{xx}, f_{xy}, f_{yx}, f_{yy}$`,
    },
    {
      kind: 'say', title: 'ลองกับ f = x²y³',
      body: t`อันดับหนึ่ง: $f_x = 2xy^3$ และ $f_y = 3x^2y^2$ จากนั้น diff ซ้ำ $$f_{xx} = \frac{\partial}{\partial x}(2xy^3) = 2y^3, \qquad f_{yy} = \frac{\partial}{\partial y}(3x^2y^2) = 6x^2y$$ $$f_{xy} = \frac{\partial}{\partial y}(2xy^3) = 6xy^2, \qquad f_{yx} = \frac{\partial}{\partial x}(3x^2y^2) = 6xy^2$$ สังเกตว่า $f_{xy} = f_{yx}$`,
    },
    {
      kind: 'check', q: t`ถ้า $f_x = 4x^3y^2$ แล้ว $f_{xy} = \ ?$`,
      choices: [t`$8x^3y$`, t`$12x^2y^2$`, t`$4x^3$`, t`$8xy$`], answer: 0,
      explain: t`$f_{xy}$ คือเอา $f_x$ ไป diff เทียบ $y$: $4x^3$ เป็นค่าคงที่ และ $y^2 \to 2y$ จึงได้ $8x^3y$ (ตัวเลือก $12x^2y^2$ คือ $f_{xx}$)`,
    },
    {
      kind: 'say', title: 'อ่านลำดับให้ถูก',
      body: t`มีสองแบบที่เขียนต่างกันแต่หมายถึงตัวเดียวกัน $$f_{xy} = \frac{\partial^2 f}{\partial y\,\partial x}$$ ตัวห้อย $f_{xy}$ อ่าน**ซ้ายไปขวา**: $x$ ก่อน แล้วจึง $y$ ส่วนแบบเศษส่วนอ่าน**ขวาไปซ้าย**: ตัวที่ติดกับ $f$ ($\partial x$) ทำก่อน`,
    },
    {
      kind: 'check', q: t`$\dfrac{\partial^2 f}{\partial x\,\partial y}$ ต้อง diff เทียบอะไรก่อน?`,
      choices: ['เทียบ y ก่อน แล้วจึงเทียบ x', 'เทียบ x ก่อน แล้วจึงเทียบ y'], answer: 0,
      explain: t`แบบเศษส่วนอ่านจากขวาไปซ้าย ตัวขวาสุดคือ $\partial y$ จึงทำก่อน`,
    },
    {
      kind: 'say', title: 'ตัวช่วยตรวจคำตอบ',
      body: t`ถ้าหาทั้ง $f_{xy}$ และ $f_{yx}$ แล้วได้ไม่เท่ากัน แปลว่าผิดสักจุด ให้ย้อนกลับไปตรวจ $f_x$ กับ $f_y$ ก่อน ปกติความผิดอยู่ที่อันดับหนึ่ง`,
    },
  ],

  /* ---------------- ข้อ 3 ---------------- */
  t3: [
    {
      kind: 'say', title: 'สถานการณ์',
      body: t`สมมติ $w$ คืออุณหภูมิที่ตำแหน่ง $(x, y)$ และมีมดเดินอยู่ ตำแหน่งของมดเปลี่ยนตามเวลา $x = x(t),\ y = y(t)$ เราอยากรู้ว่า**อุณหภูมิที่มดรู้สึกเปลี่ยนเร็วแค่ไหนตามเวลา** นั่นคือ $\frac{dw}{dt}$`,
    },
    {
      kind: 'say', title: 'ทำไมต้องบวกสองเทอม',
      body: t`ลูกโซ่ตัวแปรเดียวคือ $\frac{dy}{dt} = \frac{dy}{dx}\cdot\frac{dx}{dt}$ (คูณต่อกัน) แต่คราวนี้ $w$ เปลี่ยนได้**สองทาง**: เพราะ $x$ เปลี่ยน และเพราะ $y$ เปลี่ยน แต่ละทางคูณกันเหมือนเดิม แล้วเอาสองทางมารวมกัน $$\frac{dw}{dt} = \underbrace{\frac{\partial w}{\partial x}\frac{dx}{dt}}_{\text{ผ่าน } x} + \underbrace{\frac{\partial w}{\partial y}\frac{dy}{dt}}_{\text{ผ่าน } y}$$`,
    },
    {
      kind: 'say', title: 'ตัวอย่างง่ายที่สุด',
      body: t`$w = x + y^2,\ x = t^2,\ y = 3t$ $$\frac{\partial w}{\partial x} = 1,\quad \frac{\partial w}{\partial y} = 2y,\quad \frac{dx}{dt} = 2t,\quad \frac{dy}{dt} = 3$$ $$\frac{dw}{dt} = 1(2t) + 2y(3) = 2t + 6(3t) = 20t$$ ตรวจ: แทนก่อนได้ $w = t^2 + 9t^2 = 10t^2$ diff ได้ $20t$ ตรงกัน`,
    },
    {
      kind: 'check', q: t`$w = xy,\ x = t,\ y = t^2$ จะได้ $\dfrac{dw}{dt} = \ ?$`,
      choices: [t`$3t^2$`, t`$2t$`, t`$t^2$`, t`$t^3$`], answer: 0,
      explain: t`$y(1) + x(2t) = t^2 + 2t^2 = 3t^2$ หรือแทนก่อนได้ $w = t^3$ ก็ diff ได้ $3t^2$ เหมือนกัน`,
    },
    {
      kind: 'check', q: t`ทำไมกิ่งบนใช้ $\dfrac{\partial w}{\partial x}$ แต่กิ่งล่างใช้ $\dfrac{dx}{dt}$?`,
      choices: [t`เพราะ $w$ มีหลายตัวแปร แต่ $x$ มีตัวแปรเดียวคือ $t$`, t`เพราะ $x$ มีหลายตัวแปร`, 'สองตัวนี้ใช้สลับกันได้'], answer: 0,
      explain: t`ใช้ $\partial$ เมื่อฟังก์ชันมีหลายตัวแปร ($w$ ขึ้นกับ $x, y$) และใช้ $d$ เมื่อมีตัวแปรเดียว ($x$ ขึ้นกับ $t$ อย่างเดียว)`,
    },
    {
      kind: 'say', title: 'สรุปวิธีทำ',
      body: t`วาดเพชร → หาชิ้นบน 2 ตัว → หาชิ้นล่าง 2 ตัว → คูณตามกิ่งแล้วบวก → แทนให้เหลือแต่ $t$ และถ้าไม่แน่ใจ ให้ตรวจด้วยการแทนก่อนแล้ว diff ตรงๆ`,
    },
  ],

  /* ---------------- ข้อ 4 ---------------- */
  t4: [
    {
      kind: 'say', title: 'เพิ่มตัวแปรอีกหนึ่งตัว',
      body: t`ถ้า $w$ ขึ้นกับ $x, y, z$ ก็มีทางให้ $w$ เปลี่ยนได้ **3 ทาง** จึงได้ 3 เทอม ไม่มีอะไรใหม่นอกจากนั้น $$\frac{dw}{dt} = \frac{\partial w}{\partial x}\frac{dx}{dt} + \frac{\partial w}{\partial y}\frac{dy}{dt} + \frac{\partial w}{\partial z}\frac{dz}{dt}$$`,
    },
    {
      kind: 'say', title: 'ตัวอย่างง่าย',
      body: t`$w = x + y + z,\ x = t,\ y = t^2,\ z = t^3$ ชิ้นบนเป็น 1 ทั้งหมด จึงได้ $$\frac{dw}{dt} = 1(1) + 1(2t) + 1(3t^2) = 1 + 2t + 3t^2$$`,
    },
    {
      kind: 'check', q: t`$w = x^2 + y^2 + z^2$ โดย $x, y, z$ เป็นฟังก์ชันของ $t$ สูตร $\dfrac{dw}{dt}$ มีกี่เทอม?`,
      choices: ['3 เทอม', '2 เทอม', '1 เทอม', '6 เทอม'], answer: 0,
      explain: 'มีตัวแปรกลาง 3 ตัว (x, y, z) จึงมี 3 เส้นทาง เท่ากับ 3 เทอม',
    },
    {
      kind: 'say', title: 'ระวังเทอมที่ดูเหมือนไม่มีตัวแปร',
      body: t`ถ้า $w = xz + y$ จะได้ $\frac{\partial w}{\partial y} = 1$ ไม่ใช่ 0 เพราะเทอม $y$ diff เทียบ $y$ ได้ 1 ลองต่อด้วย $x = t,\ y = t^2,\ z = t^3$ $$\frac{dw}{dt} = z(1) + 1(2t) + x(3t^2) = t^3 + 2t + 3t^3 = 4t^3 + 2t$$ ตรวจ: $w = t^4 + t^2$ diff ได้ $4t^3 + 2t$ ตรงกัน`,
    },
    {
      kind: 'check', q: t`$w = x^2y + 5z$ จะได้ $\dfrac{\partial w}{\partial z} = \ ?$`,
      choices: [t`$5$`, t`$0$`, t`$x^2y$`, t`$5z$`], answer: 0,
      explain: t`$x^2y$ ไม่มี $z$ จึงได้ 0 ส่วน $5z$ diff เทียบ $z$ ได้ 5`,
    },
  ],

  /* ---------------- ข้อ 5 ---------------- */
  t5: [
    {
      kind: 'say', title: 'เดินเฉียงได้ไหม',
      body: t`$\frac{\partial f}{\partial x}$ บอกความชันเมื่อเดินตามแกน $x$ และ $\frac{\partial f}{\partial y}$ บอกความชันเมื่อเดินตามแกน $y$ แต่ถ้าเราอยากเดิน**เฉียงไปในทิศใดก็ได้** ต้องใช้**อนุพันธ์ระบุทิศทาง**`,
    },
    {
      kind: 'say', title: 'แกรเดียนต์ ∇f',
      body: t`เอาความชันทั้งสองแกนมาเขียนรวมเป็นเวกเตอร์เดียว $$\nabla f = f_x\,\vec i + f_y\,\vec j$$ เวกเตอร์นี้ชี้ไปในทิศที่ $f$ **เพิ่มขึ้นเร็วที่สุด** เช่น $f = x^2 + y^2$ จะได้ $\nabla f = 2x\,\vec i + 2y\,\vec j$ และที่จุด $(1, 2)$ ได้ $2\vec i + 4\vec j$`,
    },
    {
      kind: 'say', title: 'ทบทวนเวกเตอร์: ขนาดกับเวกเตอร์หนึ่งหน่วย',
      body: t`ขนาดของ $\vec v = a\vec i + b\vec j$ คือ $|\vec v| = \sqrt{a^2 + b^2}$ ส่วน**เวกเตอร์หนึ่งหน่วย**คือเวกเตอร์ที่ชี้ทางเดิมแต่ยาว 1 ได้จากการหารด้วยขนาด เช่น $\vec v = 3\vec i + 4\vec j$ มี $|\vec v| = \sqrt{9 + 16} = 5$ $$\vec u = \frac{\vec v}{|\vec v|} = \frac35\vec i + \frac45\vec j$$`,
    },
    {
      kind: 'check', q: t`เวกเตอร์หนึ่งหน่วยในทิศ $6\vec i - 8\vec j$ คือ?`,
      choices: [t`$\tfrac35\vec i - \tfrac45\vec j$`, t`$6\vec i - 8\vec j$`, t`$\tfrac{6}{10}\vec i + \tfrac{8}{10}\vec j$`, t`$\vec i - \vec j$`], answer: 0,
      explain: t`$|\vec v| = \sqrt{36 + 64} = 10$ แล้วหารทุกตัวด้วย 10: $\frac{6}{10} = \frac35$ และ $\frac{-8}{10} = -\frac45$ (เครื่องหมายลบต้องคงไว้)`,
    },
    {
      kind: 'say', title: 'ผลคูณเชิงสเกลาร์ (dot)',
      body: t`คูณตัวหน้า $\vec i$ ด้วยกัน คูณตัวหน้า $\vec j$ ด้วยกัน แล้วบวก ผลที่ได้เป็นตัวเลข ไม่ใช่เวกเตอร์ $$(a_1\vec i + b_1\vec j)\cdot(a_2\vec i + b_2\vec j) = a_1a_2 + b_1b_2$$ เช่น $(2\vec i + 3\vec j)\cdot(4\vec i - \vec j) = 8 - 3 = 5$`,
    },
    {
      kind: 'check', q: t`$(\vec i + 2\vec j)\cdot(3\vec i - 4\vec j) = \ ?$`,
      choices: [t`$-5$`, t`$11$`, t`$3 - 8\vec j$`, t`$5$`], answer: 0,
      explain: t`$(1)(3) + (2)(-4) = 3 - 8 = -5$`,
    },
    {
      kind: 'say', title: 'รวมทุกอย่างเข้าด้วยกัน',
      body: t`$$D_{\vec u}f = \nabla f\cdot\vec u$$ ลองตรวจว่าสูตรสมเหตุสมผล: ถ้าเดินตามแกน $x$ คือ $\vec u = \vec i$ จะได้ $(f_x\vec i + f_y\vec j)\cdot\vec i = f_x$ ตรงกับ $\frac{\partial f}{\partial x}$ พอดี ค่ามากสุดเกิดเมื่อ $\vec u$ ชี้ทางเดียวกับ $\nabla f$ และมีค่าเท่ากับ $|\nabla f|$`,
    },
    {
      kind: 'check', q: t`ถ้า $\nabla f = 3\vec i + 4\vec j$ ค่ามากที่สุดที่ $D_{\vec u}f$ เป็นได้คือ?`,
      choices: [t`$5$`, t`$7$`, t`$3$`, t`$25$`], answer: 0,
      explain: t`ค่ามากสุดคือ $|\nabla f| = \sqrt{9 + 16} = 5$ เกิดเมื่อเดินในทิศของ $\nabla f$`,
    },
  ],

  /* ---------------- ข้อ 6 ---------------- */
  t6: [
    {
      kind: 'say', title: 'level curve คือเส้นชั้นความสูง',
      body: t`level curve ของ $f$ คือเส้นที่ $f$ มีค่าเท่ากันตลอดเส้น เหมือนเส้นชั้นความสูงในแผนที่ภูเขา เช่น $f = x^2 + y^2$ ที่ระดับ 25 คือวงกลม $x^2 + y^2 = 25$ รัศมี 5`,
    },
    {
      kind: 'say', title: 'ทำไม ∇f ตั้งฉากกับเส้นสัมผัส',
      body: t`ถ้าเดินไปตาม level curve ค่า $f$ ไม่เปลี่ยนเลย แปลว่าในทิศของเส้นสัมผัส $D_{\vec u}f = \nabla f\cdot\vec u = 0$ และ dot เป็น 0 ก็แปลว่า**สองเวกเตอร์ตั้งฉากกัน** ดังนั้น $\nabla f$ ตั้งฉากกับเส้นสัมผัสเสมอ`,
    },
    {
      kind: 'say', title: 'สมการเส้นตรงจากเวกเตอร์ตั้งฉาก',
      body: t`ถ้ารู้เวกเตอร์ตั้งฉาก $\vec N = A\vec i + B\vec j$ และจุดที่เส้นผ่าน $(x_0, y_0)$ เส้นตรงคือ $$A(x - x_0) + B(y - y_0) = 0$$ เช่น $\vec N = 2\vec i + 3\vec j$ ผ่านจุด $(1, 1)$: $2(x - 1) + 3(y - 1) = 0$ จัดรูปได้ $2x + 3y = 5$`,
    },
    {
      kind: 'check', q: t`เส้นตรงที่มี $\vec N = \vec i - \vec j$ และผ่านจุด $(2, 0)$ คือ?`,
      choices: [t`$x - y = 2$`, t`$x + y = 2$`, t`$x - y = 0$`, t`$2x = y$`], answer: 0,
      explain: t`$1(x - 2) + (-1)(y - 0) = 0$ ได้ $x - 2 - y = 0$ หรือ $x - y = 2$`,
    },
    {
      kind: 'say', title: 'รวมเป็นวิธีหาเส้นสัมผัส',
      body: t`ใช้ $\vec N = \nabla f$ ที่จุดนั้น เช่น $x^2 + y^2 = 25$ ที่ $(3, 4)$: $\nabla f = 2x\,\vec i + 2y\,\vec j$ ที่จุดได้ $6\vec i + 8\vec j$ $$6(x - 3) + 8(y - 4) = 0 \;\Rightarrow\; 3x + 4y = 25$$`,
    },
    {
      kind: 'check', q: t`$\nabla f$ ของ $f = x^2 + 3y$ ที่จุด $(1, 2)$ คือ?`,
      choices: [t`$2\vec i + 3\vec j$`, t`$2\vec i + 6\vec j$`, t`$\vec i + 3\vec j$`, t`$2x\,\vec i + 3\vec j$`], answer: 0,
      explain: t`$f_x = 2x = 2$ และ $f_y = 3$ (ค่าคงที่ ไม่ขึ้นกับจุด) ส่วนตัวเลือกสุดท้ายยังไม่ได้แทนจุด`,
    },
  ],
};

/* ---------------- ตัวอย่างเพิ่ม ระดับง่ายและกลาง ---------------- */
export const extraExamples: Record<string, Example[]> = {
  t1: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'พหุนาม', level: 'ง่าย',
      q: t`จงหา $f_x$ และ $f_y$ ถ้า $f(x,y) = 3x^2y + 5y^3$`,
      steps: [
        t`หา f_x: y คงที่::$3x^2y$: ค่าคงที่ $3y$ คูณ $x^2$ จึงได้ $3y\cdot 2x = 6xy$ ส่วน $5y^3$ ไม่มี $x$ ได้ 0 $$f_x = 6xy$$`,
        t`หา f_y: x คงที่::$3x^2y$: ค่าคงที่ $3x^2$ คูณ $y$ ได้ $3x^2$ ส่วน $5y^3 \to 15y^2$ $$f_y = 3x^2 + 15y^2$$`,
      ],
      answer: t`$f_x = 6xy,\quad f_y = 3x^2 + 15y^2$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'มี e, sin, ln', level: 'กลาง',
      q: t`จงหา $f_x$ และ $f_y$ ถ้า $f(x,y) = e^x\sin y + x\ln y$`,
      steps: [
        t`หา f_x: y คงที่::$e^x\sin y$: $\sin y$ เป็นค่าคงที่ จึงได้ $e^x\sin y$ และ $x\ln y$: $\ln y$ เป็นค่าคงที่ จึงได้ $\ln y$ $$f_x = e^x\sin y + \ln y$$`,
        t`หา f_y: x คงที่::$e^x\sin y$: $e^x$ เป็นค่าคงที่ และ $\sin y \to \cos y$ ส่วน $x\ln y$: $x$ เป็นค่าคงที่ และ $\ln y \to \frac1y$ $$f_y = e^x\cos y + \frac{x}{y}$$`,
      ],
      answer: t`$f_x = e^x\sin y + \ln y,\quad f_y = e^x\cos y + \dfrac{x}{y}$`,
    },
  ],
  t2: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'พหุนาม', level: 'ง่าย',
      q: t`จงหาอนุพันธ์ย่อยอันดับสองทั้ง 4 ตัวของ $f(x,y) = x^4 + x^2y^2 + y^4$`,
      steps: [
        t`อันดับหนึ่ง::$$f_x = 4x^3 + 2xy^2, \qquad f_y = 2x^2y + 4y^3$$`,
        t`f_xx และ f_yy::$$f_{xx} = \frac{\partial}{\partial x}(4x^3 + 2xy^2) = 12x^2 + 2y^2, \qquad f_{yy} = \frac{\partial}{\partial y}(2x^2y + 4y^3) = 2x^2 + 12y^2$$`,
        t`f_xy และ f_yx::$$f_{xy} = \frac{\partial}{\partial y}(4x^3 + 2xy^2) = 4xy, \qquad f_{yx} = \frac{\partial}{\partial x}(2x^2y + 4y^3) = 4xy$$ เท่ากันตามที่ควรเป็น`,
      ],
      answer: t`$f_{xx} = 12x^2 + 2y^2,\ f_{yy} = 2x^2 + 12y^2,\ f_{xy} = f_{yx} = 4xy$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'ต้องใช้ product ตอน diff รอบสอง', level: 'กลาง',
      q: t`ถ้า $f(x,y) = \sin(xy)$ จงหา $f_{xx}$ และ $f_{xy}$`,
      steps: [
        t`อันดับหนึ่ง (chain rule)::$$f_x = \cos(xy)\cdot y = y\cos(xy)$$`,
        t`f_xx: y เป็นค่าคงที่::diff $\cos(xy)$ เทียบ $x$ ได้ $-\sin(xy)\cdot y$ $$f_{xx} = y\cdot\big(-y\sin(xy)\big) = -y^2\sin(xy)$$`,
        t`f_xy: y อยู่สองที่ ต้องใช้ product::ให้ $u = y$ และ $v = \cos(xy)$: $u_y = 1$, $v_y = -x\sin(xy)$ $$f_{xy} = (1)\cos(xy) + y\big(-x\sin(xy)\big) = \cos(xy) - xy\sin(xy)$$`,
      ],
      answer: t`$f_{xx} = -y^2\sin(xy),\quad f_{xy} = \cos(xy) - xy\sin(xy)$`,
    },
  ],
  t3: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'คำตอบเป็น 0', level: 'ง่าย',
      q: t`$w = x^2 + y^2,\ x = \cos t,\ y = \sin t$ จงหา $\frac{dw}{dt}$`,
      steps: [
        t`ชิ้นส่วนบนและล่าง::$\frac{\partial w}{\partial x} = 2x$, $\frac{\partial w}{\partial y} = 2y$, $\frac{dx}{dt} = -\sin t$, $\frac{dy}{dt} = \cos t$`,
        t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 2x(-\sin t) + 2y(\cos t) = -2\cos t\sin t + 2\sin t\cos t = 0$$`,
        t`ทำไมได้ 0::แทนก่อนได้ $w = \cos^2 t + \sin^2 t = 1$ ซึ่งเป็นค่าคงที่ จุดเดินบนวงกลมรัศมี 1 ระยะจากจุดกำเนิดจึงไม่เปลี่ยน`,
      ],
      answer: t`$\dfrac{dw}{dt} = 0$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'แทนค่า t', level: 'กลาง',
      q: t`$w = x^2y,\ x = 1 + t,\ y = t^2$ จงหา $\frac{dw}{dt}$ ที่ $t = 1$`,
      steps: [
        t`หาค่าที่ t = 1 ก่อน::$x = 2,\ y = 1$`,
        t`ชิ้นส่วนบน แทนตัวเลขเลย::$\frac{\partial w}{\partial x} = 2xy = 4$ และ $\frac{\partial w}{\partial y} = x^2 = 4$`,
        t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 1$ และ $\frac{dy}{dt} = 2t = 2$`,
        t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 4(1) + 4(2) = 12$$`,
      ],
      answer: t`$\left.\dfrac{dw}{dt}\right|_{t=1} = 12$`,
    },
  ],
  t4: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'ทุกชิ้นบนเป็น 1', level: 'ง่าย',
      q: t`$w = x + y + z,\ x = t,\ y = t^2,\ z = t^3$ จงหา $\frac{dw}{dt}$`,
      steps: [
        t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = \frac{\partial w}{\partial y} = \frac{\partial w}{\partial z} = 1$`,
        t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 1$, $\frac{dy}{dt} = 2t$, $\frac{dz}{dt} = 3t^2$`,
        t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 1 + 2t + 3t^2$$`,
      ],
      answer: t`$\dfrac{dw}{dt} = 1 + 2t + 3t^2$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'มี e', level: 'กลาง',
      q: t`$w = xy + yz,\ x = e^t,\ y = t,\ z = e^{-t}$ จงหา $\frac{dw}{dt}$ ที่ $t = 0$`,
      steps: [
        t`หาค่าที่ t = 0 ก่อน::$x = e^0 = 1$, $y = 0$, $z = e^0 = 1$`,
        t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = y = 0$, $\frac{\partial w}{\partial y} = x + z = 2$, $\frac{\partial w}{\partial z} = y = 0$`,
        t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = e^t = 1$, $\frac{dy}{dt} = 1$, $\frac{dz}{dt} = -e^{-t} = -1$`,
        t`คูณตามกิ่ง แล้วบวก::$$\frac{dw}{dt} = 0(1) + 2(1) + 0(-1) = 2$$`,
      ],
      answer: t`$\left.\dfrac{dw}{dt}\right|_{t=0} = 2$`,
    },
  ],
  t5: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'ทำครบ 4 ขั้น', level: 'ง่าย',
      q: t`จงหาอนุพันธ์ของ $f(x,y) = x^2 + y^2$ ที่จุด $(1, 2)$ ในทิศทางของ $\vec v = 3\vec i + 4\vec j$`,
      steps: [
        t`หา ∇f::$\nabla f = 2x\,\vec i + 2y\,\vec j$`,
        t`แทนจุด (1, 2)::$(\nabla f)_P = 2\vec i + 4\vec j$`,
        t`หา u::$|\vec v| = \sqrt{9 + 16} = 5$ ดังนั้น $\vec u = \frac35\vec i + \frac45\vec j$`,
        t`dot กัน::$$2\left(\tfrac35\right) + 4\left(\tfrac45\right) = \tfrac65 + \tfrac{16}{5} = \tfrac{22}{5}$$`,
      ],
      answer: t`$D_{\vec u}f = \dfrac{22}{5}$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'ทิศจาก P ไป Q', level: 'กลาง',
      q: t`จงหาอนุพันธ์ของ $f(x,y) = x^2y$ ที่จุด $P(1, 3)$ ในทิศทางจาก $P$ ไป $Q(4, -1)$`,
      steps: [
        t`หาเวกเตอร์ทิศ::$\vec v = Q - P = (4 - 1)\vec i + (-1 - 3)\vec j = 3\vec i - 4\vec j$`,
        t`หา u::$|\vec v| = 5$ ดังนั้น $\vec u = \frac35\vec i - \frac45\vec j$`,
        t`หา ∇f แล้วแทนจุด P::$\nabla f = 2xy\,\vec i + x^2\,\vec j$ ที่ $(1,3)$ ได้ $6\vec i + \vec j$`,
        t`dot กัน::$$6\left(\tfrac35\right) + 1\left(-\tfrac45\right) = \tfrac{18}{5} - \tfrac45 = \tfrac{14}{5}$$`,
      ],
      answer: t`$D_{\vec u}f = \dfrac{14}{5}$`,
    },
  ],
  t6: [
    {
      src: 'ตัวอย่างเพิ่ม', title: 'วงกลม', level: 'ง่าย',
      q: t`จงหาสมการเส้นสัมผัส $x^2 + y^2 = 10$ ที่จุด $(1, 3)$`,
      steps: [
        t`ตรวจจุด::$1 + 9 = 10$ อยู่บนวงกลมจริง`,
        t`หา N::$\nabla f = 2x\,\vec i + 2y\,\vec j$ ที่ $(1,3)$ ได้ $\vec N = 2\vec i + 6\vec j$`,
        t`ตั้งสมการ แล้วจัดรูป::$$2(x - 1) + 6(y - 3) = 0 \;\Rightarrow\; 2x + 6y = 20 \;\Rightarrow\; x + 3y = 10$$`,
      ],
      answer: t`$x + 3y = 10$`,
    },
    {
      src: 'ตัวอย่างเพิ่ม', title: 'พาราโบลา y = x²', level: 'กลาง',
      q: t`จงหาเส้นสัมผัสของ $y = x^2$ ที่จุด $(2, 4)$ โดยใช้วิธี level curve`,
      steps: [
        t`ย้ายข้างให้เป็น level curve::$y = x^2$ เขียนเป็น $f(x,y) = y - x^2 = 0$`,
        t`หา N::$\nabla f = -2x\,\vec i + \vec j$ ที่ $(2,4)$ ได้ $\vec N = -4\vec i + \vec j$`,
        t`ตั้งสมการ แล้วจัดรูป::$$-4(x - 2) + 1(y - 4) = 0 \;\Rightarrow\; y = 4x - 4$$`,
        t`ตรวจด้วยวิธี ม.ปลาย::ความชันของ $y = x^2$ คือ $2x = 4$ ที่ $x = 2$ จึงได้ $y - 4 = 4(x - 2)$ ตรงกัน`,
      ],
      answer: t`$y = 4x - 4$`,
    },
  ],
};
