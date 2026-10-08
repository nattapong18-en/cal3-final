// โจทย์ยากแบบข้อสอบ: ซ้อนหลายกฎ (ผลคูณ ผลหาร ลูกโซ่ ln e sin cos และค่า π) ในข้อเดียว
import type { Practice } from './topics';

const t = String.raw;

export const hard: Practice[] = [
  {
    id: 'h1', src: 'ข้อ 1 · ผลคูณ + e',
    q: t`$f(x,y) = x^2e^{xy}$ จงหา $f_x$ และ $f_y$`,
    sol: [
      t`f_x: x อยู่สองที่ ต้องใช้ product::$u = x^2$ ($u_x = 2x$) และ $v = e^{xy}$ ($v_x = y\,e^{xy}$ จากลูกโซ่)`,
      t`ประกอบ f_x::$$f_x = 2x\,e^{xy} + x^2\cdot y\,e^{xy} = x\,e^{xy}(2 + xy)$$`,
      t`f_y: x² เป็นค่าคงที่::$$f_y = x^2\cdot e^{xy}\cdot x = x^3e^{xy}$$`,
    ],
    answer: t`$f_x = x\,e^{xy}(2 + xy),\quad f_y = x^3e^{xy}$`,
  },
  {
    id: 'h2', src: 'ข้อ 1 · ผลหาร',
    q: t`$f(x,y) = \dfrac{x^2 - y}{x + y^2}$ จงหา $f_x$ และ $f_y$`,
    sol: [
      t`f_x: เตรียมสูตร::บน $= x^2 - y$ (diff เทียบ x ได้ $2x$) และ ล่าง $= x + y^2$ (diff เทียบ x ได้ 1)`,
      t`แทนสูตร f_x::$$f_x = \frac{(x + y^2)(2x) - (x^2 - y)(1)}{(x + y^2)^2} = \frac{2x^2 + 2xy^2 - x^2 + y}{(x + y^2)^2} = \frac{x^2 + 2xy^2 + y}{(x + y^2)^2}$$`,
      t`f_y: เตรียมสูตร::diff เทียบ y: บน $\to -1$ และ ล่าง $\to 2y$`,
      t`แทนสูตร f_y::$$f_y = \frac{(x + y^2)(-1) - (x^2 - y)(2y)}{(x + y^2)^2} = \frac{-x - y^2 - 2x^2y + 2y^2}{(x + y^2)^2} = \frac{y^2 - x - 2x^2y}{(x + y^2)^2}$$`,
    ],
    answer: t`$f_x = \dfrac{x^2 + 2xy^2 + y}{(x + y^2)^2},\quad f_y = \dfrac{y^2 - x - 2x^2y}{(x + y^2)^2}$`,
  },
  {
    id: 'h3', src: 'ข้อ 2 · e คูณ cos',
    q: t`$f(x,y) = e^x\cos(xy)$ จงหา $f_x$, $f_y$ และ $\dfrac{\partial^2 f}{\partial y\,\partial x}$`,
    sol: [
      t`f_x: x อยู่สองที่::$u = e^x$, $v = \cos(xy)$ ได้ $v_x = -y\sin(xy)$ $$f_x = e^x\cos(xy) - y\,e^x\sin(xy)$$`,
      t`f_y: e^x เป็นค่าคงที่::$$f_y = e^x\cdot\big(-x\sin(xy)\big) = -x\,e^x\sin(xy)$$`,
      t`∂²f/∂y∂x: diff f_x เทียบ y ทีละเทอม::เทอมแรก $e^x\cos(xy) \to -x\,e^x\sin(xy)$ เทอมที่สอง $y\,e^x\sin(xy)$ มี y สองที่ ใช้ product ได้ $e^x\sin(xy) + xy\,e^x\cos(xy)$`,
      t`รวม (ระวังเครื่องหมายลบหน้าเทอมที่สอง)::$$\frac{\partial^2 f}{\partial y\,\partial x} = -x\,e^x\sin(xy) - e^x\sin(xy) - xy\,e^x\cos(xy)$$`,
    ],
    answer: t`$\dfrac{\partial^2 f}{\partial y\,\partial x} = -e^x\big[(x + 1)\sin(xy) + xy\cos(xy)\big]$`,
  },
  {
    id: 'h4', src: 'ข้อ 1 · ln แทนค่า',
    q: t`$f(x,y) = \ln(x^2 + xy + y^2)$ จงหา $f_x$ และ $f_y$ ที่จุด $(1,1)$`,
    sol: [
      t`สูตร ln::$\frac{\partial}{\partial x}\ln u = \frac{u_x}{u}$ โดย $u = x^2 + xy + y^2$`,
      t`หา f_x และ f_y::$$f_x = \frac{2x + y}{x^2 + xy + y^2}, \qquad f_y = \frac{x + 2y}{x^2 + xy + y^2}$$`,
      t`แทนจุด (1, 1)::ตัวส่วน $= 1 + 1 + 1 = 3$ $$f_x = \frac{3}{3} = 1, \qquad f_y = \frac{3}{3} = 1$$`,
    ],
    answer: t`$f_x(1,1) = 1,\quad f_y(1,1) = 1$`,
  },
  {
    id: 'h5', src: 'ข้อ 2 · ผลคูณ + ln',
    q: t`$f(x,y) = x\ln(xy)$ จงหา $f_{xx}$, $f_{yy}$ และ $f_{xy}$`,
    sol: [
      t`f_x: product::$u = x$, $v = \ln(xy)$ ได้ $v_x = \frac{y}{xy} = \frac1x$ $$f_x = \ln(xy) + x\cdot\frac1x = \ln(xy) + 1$$`,
      t`f_y: x เป็นค่าคงที่::$$f_y = x\cdot\frac{x}{xy} = \frac{x}{y}$$`,
      t`อันดับสอง::$$f_{xx} = \frac{\partial}{\partial x}\big(\ln(xy) + 1\big) = \frac1x, \qquad f_{yy} = \frac{\partial}{\partial y}\left(\frac{x}{y}\right) = -\frac{x}{y^2}$$`,
      t`f_xy และตรวจ::$$f_{xy} = \frac{\partial}{\partial y}\big(\ln(xy) + 1\big) = \frac{x}{xy} = \frac1y, \qquad f_{yx} = \frac{\partial}{\partial x}\left(\frac{x}{y}\right) = \frac1y$$ เท่ากัน`,
    ],
    answer: t`$f_{xx} = \dfrac1x,\ f_{yy} = -\dfrac{x}{y^2},\ f_{xy} = \dfrac1y$`,
  },
  {
    id: 'h6', src: 'ข้อ 3 · ln + e + sin cos',
    q: t`$w = \ln(x^2 + y^2),\ x = e^t\cos t,\ y = e^t\sin t$ จงหา $\dfrac{dw}{dt}$`,
    sol: [
      t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = \frac{2x}{x^2 + y^2}$ และ $\frac{\partial w}{\partial y} = \frac{2y}{x^2 + y^2}$`,
      t`ชิ้นส่วนล่าง (product)::$\frac{dx}{dt} = e^t\cos t - e^t\sin t$ และ $\frac{dy}{dt} = e^t\sin t + e^t\cos t$`,
      t`ตัวส่วน::$x^2 + y^2 = e^{2t}(\cos^2 t + \sin^2 t) = e^{2t}$`,
      t`คูณตามกิ่งแล้วบวก::ตัวเศษ $= 2x\frac{dx}{dt} + 2y\frac{dy}{dt} = 2e^{2t}(\cos^2 t - \cos t\sin t + \sin^2 t + \sin t\cos t) = 2e^{2t}$`,
      t`ประกอบคำตอบ::$$\frac{dw}{dt} = \frac{2e^{2t}}{e^{2t}} = 2$$ ตรวจ: $w = \ln e^{2t} = 2t$ diff ได้ 2 ตรงกัน`,
    ],
    answer: t`$\dfrac{dw}{dt} = 2$`,
  },
  {
    id: 'h7', src: 'ข้อ 4 · มีค่า π',
    q: t`$w = x\cos z + y^2,\ x = t,\ y = t^2,\ z = \pi t$ จงหา $\dfrac{dw}{dt}$ ที่ $t = 1$`,
    sol: [
      t`หาค่าที่ t = 1::$x = 1$, $y = 1$, $z = \pi$ และ $\cos\pi = -1$, $\sin\pi = 0$`,
      t`ชิ้นส่วนบน::$\frac{\partial w}{\partial x} = \cos z = -1$, $\frac{\partial w}{\partial y} = 2y = 2$, $\frac{\partial w}{\partial z} = -x\sin z = 0$`,
      t`ชิ้นส่วนล่าง::$\frac{dx}{dt} = 1$, $\frac{dy}{dt} = 2t = 2$, $\frac{dz}{dt} = \pi$`,
      t`คูณตามกิ่งแล้วบวก::$$\frac{dw}{dt} = (-1)(1) + (2)(2) + (0)(\pi) = 3$$`,
    ],
    answer: t`$\left.\dfrac{dw}{dt}\right|_{t=1} = 3$`,
  },
  {
    id: 'h8', src: 'ข้อ 5 · sin cos กับ π/2',
    q: t`จงหาอนุพันธ์ของ $f(x,y) = x\sin y + y\cos x$ ที่จุด $(0, \tfrac{\pi}{2})$ ในทิศทางของ $\vec v = \vec i + \vec j$`,
    sol: [
      t`หา ∇f::$f_x = \sin y - y\sin x$ และ $f_y = x\cos y + \cos x$`,
      t`แทนจุด (0, π/2)::$\sin\frac{\pi}{2} = 1$, $\sin 0 = 0$, $\cos\frac{\pi}{2} = 0$, $\cos 0 = 1$ $$f_x = 1 - 0 = 1, \qquad f_y = 0 + 1 = 1$$`,
      t`หา u::$|\vec v| = \sqrt2$ ดังนั้น $\vec u = \frac{1}{\sqrt2}\vec i + \frac{1}{\sqrt2}\vec j$`,
      t`dot กัน::$$\frac{1}{\sqrt2} + \frac{1}{\sqrt2} = \frac{2}{\sqrt2} = \sqrt2$$`,
    ],
    answer: t`$D_{\vec u}f = \sqrt2$`,
  },
  {
    id: 'h9', src: 'ข้อ 5 · 3 ตัวแปร + e',
    q: t`จงหาอนุพันธ์ของ $f(x,y,z) = x\,e^{yz}$ ที่จุด $(2, 0, 1)$ ในทิศทางของ $\vec v = 2\vec i + \vec j - 2\vec k$`,
    sol: [
      t`หา ∇f::$f_x = e^{yz}$, $f_y = xz\,e^{yz}$, $f_z = xy\,e^{yz}$`,
      t`แทนจุด (2, 0, 1)::$e^{0} = 1$ ดังนั้น $\nabla f = \vec i + 2\vec j + 0\vec k$`,
      t`หา u::$|\vec v| = \sqrt{4 + 1 + 4} = 3$ ดังนั้น $\vec u = \frac23\vec i + \frac13\vec j - \frac23\vec k$`,
      t`dot กัน::$$\tfrac23 + \tfrac23 + 0 = \tfrac43$$`,
    ],
    answer: t`$D_{\vec u}f = \dfrac43$`,
  },
  {
    id: 'h10', src: 'ข้อ 6 · มี e',
    q: t`จงหาสมการเส้นสัมผัส level curve $x\,e^y + y^2 = 1$ ที่จุด $(1, 0)$`,
    sol: [
      t`ตรวจจุด::$1\cdot e^0 + 0 = 1$ ใช้ได้`,
      t`หา N::$f_x = e^y$ และ $f_y = x\,e^y + 2y$ ที่ $(1,0)$ ได้ $\vec N = \vec i + \vec j$`,
      t`ตั้งสมการแล้วจัดรูป::$$1(x - 1) + 1(y - 0) = 0 \;\Rightarrow\; x + y = 1$$`,
    ],
    answer: t`$x + y = 1$`,
  },
];
