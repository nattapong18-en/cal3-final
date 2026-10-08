import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Palette } from '../lib/hooks';

// พิกัดคณิต (x, y, z) โดย z ชี้ขึ้น → พิกัด three.js (x, z, -y)
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, z, -y);

function heightColors(geo: THREE.BufferGeometry, low: string, high: string, maxH: number) {
  const pos = geo.getAttribute('position');
  const b = new THREE.Color(high), a = new THREE.Color(low).lerp(b, 0.25), c = new THREE.Color();
  const cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    c.copy(a).lerp(b, Math.min(1, Math.max(0, pos.getY(i) / maxH)));
    cols.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
}

const unitCircle = Array.from({ length: 97 }, (_, i) => {
  const a = (i / 96) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
});

function Axes({ p, len = 2.6, h = 2.8 }: { p: Palette; len?: number; h?: number }) {
  const lab = { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: p.muted, fontStyle: 'italic' } as const;
  return (
    <group>
      <Line points={[v(-len, 0, 0), v(len, 0, 0)]} color={p.muted} lineWidth={1} transparent opacity={0.6} />
      <Line points={[v(0, -len, 0), v(0, len, 0)]} color={p.muted} lineWidth={1} transparent opacity={0.6} />
      <Line points={[v(0, 0, 0), v(0, 0, h)]} color={p.muted} lineWidth={1} transparent opacity={0.6} />
      <Html zIndexRange={[5, 0]} position={v(len + 0.2, 0, 0)} center style={lab}>x</Html>
      <Html zIndexRange={[5, 0]} position={v(0, len + 0.2, 0)} center style={lab}>y</Html>
      <Html zIndexRange={[5, 0]} position={v(0, 0, h + 0.2)} center style={lab}>z</Html>
    </group>
  );
}

/* ---------------- Hero: พาราโบลาคว่ำ + ระนาบ z = c เลื่อนขึ้นลง → level curve ---------------- */
const R = 2, H = 2.2;

function Paraboloid({ p }: { p: Palette }) {
  const geo = useMemo(() => {
    const rings = 36, segs = 96, verts: number[] = [], idx: number[] = [];
    for (let i = 0; i <= rings; i++) {
      const r = (i / rings) * R;
      for (let j = 0; j <= segs; j++) {
        const a = (j / segs) * Math.PI * 2;
        const x = r * Math.cos(a), y = r * Math.sin(a), z = H * (1 - (r * r) / (R * R));
        const q = v(x, y, z);
        verts.push(q.x, q.y, q.z);
      }
    }
    for (let i = 0; i < rings; i++)
      for (let j = 0; j < segs; j++) {
        const a = i * (segs + 1) + j, b = a + segs + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    heightColors(g, p.blue, p.paper2, H);
    return g;
  }, [p.blue, p.paper2]);

  const contours = useMemo(() => [0.35, 0.8, 1.25, 1.7, 2.05].map((h) => ({ h, r: R * Math.sqrt(1 - h / H) })), []);

  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} transparent opacity={0.88} roughness={0.55} metalness={0.05} />
      </mesh>
      {contours.map((c) => (
        <group key={c.h} position={[0, c.h, 0]} scale={[c.r, 1, c.r]}>
          <Line points={unitCircle} color={p.ink} lineWidth={0.8} transparent opacity={0.35} />
        </group>
      ))}
      {contours.map((c) => (
        <group key={'f' + c.h} position={[0, 0.002, 0]} scale={[c.r, 1, c.r]}>
          <Line points={unitCircle} color={p.muted} lineWidth={0.8} transparent opacity={0.35} />
        </group>
      ))}
    </group>
  );
}

function SlidingPlane({ p }: { p: Palette }) {
  const plane = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  const floor = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Group>(null);
  const label = useRef<HTMLDivElement>(null);
  useFrame(({ clock }) => {
    const s = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.55);
    const h = H * (0.18 + 0.66 * s);
    const r = R * Math.sqrt(1 - h / H);
    plane.current?.position.setY(h);
    ring.current?.position.setY(h);
    ring.current?.scale.set(r, 1, r);
    floor.current?.scale.set(r, 1, r);
    drop.current?.position.set(r, 0, 0);
    drop.current?.scale.set(1, h, 1);
    if (label.current) label.current.textContent = `z = ${(100 * h / H).toFixed(0)}`;
  });
  return (
    <group>
      <mesh ref={plane} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 4.6]} />
        <meshBasicMaterial color={p.hl} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
        <Html zIndexRange={[5, 0]} position={[2.05, -2.05, 0]} center>
          <div ref={label} className="fig3d-label hl">z = c</div>
        </Html>
      </mesh>
      <group ref={ring}>
        <Line points={unitCircle} color={p.red} lineWidth={3} />
      </group>
      <group ref={floor} position={[0, 0.004, 0]}>
        <Line points={unitCircle} color={p.red} lineWidth={2.5} dashed dashSize={0.06} gapSize={0.05} />
        <Html zIndexRange={[5, 0]} position={[0, 0, 1]} center style={{ pointerEvents: 'none' }}>
          <div className="fig3d-label red" style={{ transform: 'translateY(16px)' }}>level curve</div>
        </Html>
      </group>
      <group ref={drop}>
        <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]} color={p.red} lineWidth={1} transparent opacity={0.5} />
      </group>
    </group>
  );
}

export function HeroSurface({ p }: { p: Palette }) {
  return (
    <Canvas camera={{ position: [5.6, 3.9, 5.6], fov: 34 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} />
      <group position={[0, -1.05, 0]}>
        <Axes p={p} len={2.6} h={2.8} />
        <Paraboloid p={p} />
        <SlidingPlane p={p} />
      </group>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} minPolarAngle={0.35} maxPolarAngle={1.45} />
    </Canvas>
  );
}

/* ---------------- ข้อ 1: ระนาบ x = 1 ตัดพื้นผิว z = x² + y² ---------------- */
const S = 0.32; // ย่อแกน z ให้รูปพอดีกรอบ (ค่าที่แสดงยังเป็นค่าจริง)
const X0 = 1;

export function SliceSurface({ p, y0 }: { p: Palette; y0: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(4, 4, 48, 48);
    const pos = g.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const q = v(x, y, S * (x * x + y * y));
      pos.setXYZ(i, q.x, q.y, q.z);
    }
    g.computeVertexNormals();
    heightColors(g, p.paper2, p.blue, S * 8);
    return g;
  }, [p.blue, p.paper2]);

  const curve = useMemo(() => Array.from({ length: 81 }, (_, i) => {
    const y = -2 + (i / 80) * 4;
    return v(X0, y, S * (X0 * X0 + y * y));
  }), []);

  const zP = S * (X0 * X0 + y0 * y0);
  const dir = new THREE.Vector3(0, S * 2 * y0, -1).normalize().multiplyScalar(1.3);
  const P = v(X0, y0, zP);
  const tangent = [P.clone().sub(dir), P.clone().add(dir)];

  return (
    <Canvas camera={{ position: [6.2, 3.9, 4.2], fov: 36 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 6, 2]} intensity={1.2} />
      <group position={[0, -1.1, 0]}>
        <Axes p={p} len={2.4} h={2.9} />
        <mesh geometry={geo}>
          <meshStandardMaterial vertexColors side={THREE.DoubleSide} transparent opacity={0.82} roughness={0.6} />
        </mesh>
        <mesh geometry={geo}>
          <meshBasicMaterial color={p.ink} wireframe transparent opacity={0.06} />
        </mesh>
        <mesh position={[X0, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.4, 2.8]} />
          <meshBasicMaterial color={p.hl} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <Html zIndexRange={[5, 0]} position={[X0, 2.95, 0]} center><div className="fig3d-label hl">ระนาบ x = 1</div></Html>
        <Line points={curve} color={p.blue} lineWidth={3} />
        <Line points={tangent} color={p.red} lineWidth={3} />
        <mesh position={P}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color={p.ink} />
        </mesh>
        <Html zIndexRange={[5, 0]} position={P} center style={{ pointerEvents: 'none' }}>
          <div className="fig3d-label ink" style={{ transform: 'translate(0, -26px)' }}>
            ({X0}, {y0.toFixed(1)}, {(X0 * X0 + y0 * y0).toFixed(2)})
          </div>
        </Html>
      </group>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0.35} maxPolarAngle={1.5} />
    </Canvas>
  );
}
