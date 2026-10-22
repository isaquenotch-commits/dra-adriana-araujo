import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp01, easeOutExpo, makeShadowTexture, StudioEnvironment, useOnScreen, usePointer } from "./shared";

/** Basalt stones for the hot-stone stack: [width, height, depth, seed, tint]. */
const STONES: [number, number, number, number, string][] = [
  [1.25, 0.46, 1.05, 1.3, "#141210"],
  [1.08, 0.42, 0.92, 2.7, "#1b1815"],
  [0.9, 0.38, 0.8, 4.1, "#121110"],
  [0.72, 0.33, 0.64, 5.9, "#1d1a17"],
  [0.52, 0.27, 0.48, 7.4, "#221e1a"],
];

function stoneGeometry(sx: number, sy: number, sz: number, seed: number) {
  const g = new THREE.SphereGeometry(1, 96, 64);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // Low-frequency lumps so each pebble has its own silhouette
    const n =
      0.07 * Math.sin(v.x * 2.1 + seed) * Math.cos(v.z * 1.7 + seed * 0.6) +
      0.04 * Math.sin(v.y * 3.3 + seed * 1.9) +
      0.025 * Math.cos((v.x + v.z) * 4.2 + seed);
    v.multiplyScalar(1 + n);
    // Flatten the underside so they sit like real stacked stones
    const y = v.y < 0 ? v.y * 0.72 : v.y;
    p.setXYZ(i, v.x * sx, y * sy, v.z * sz);
  }
  g.computeVertexNormals();
  return g;
}

function Stack({ progress, started }: { progress: MotionValue<number>; started: boolean }) {
  const startAt = useRef<number | null>(null);
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const shadow = useRef<THREE.Mesh>(null);
  const pointer = usePointer();

  const geometries = useMemo(() => STONES.map(([x, y, z, s]) => stoneGeometry(x, y, z, s)), []);
  const materials = useMemo(
    () =>
      STONES.map(
        ([, , , , tint]) =>
          new THREE.MeshPhysicalMaterial({
            color: tint,
            roughness: 0.42,
            metalness: 0,
            clearcoat: 0.9,
            clearcoatRoughness: 0.12,
          }),
      ),
    [],
  );
  const shadowTex = useMemo(() => makeShadowTexture(), []);

  // Resting heights: each stone sits on the one below
  const rest = useMemo(() => {
    let y = -1.35;
    return STONES.map(([, h], i) => {
      const prev = i === 0 ? 0 : STONES[i - 1][1] * 0.72;
      y += prev + h * 0.78;
      return y;
    });
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (started && startAt.current === null) startAt.current = t;
    const scroll = progress.get();

    // Follow the pointer, gently
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.35 + scroll * 1.4, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.08 + 0.12, 3, dt);

    let settled = 0;
    for (let i = 0; i < STONES.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      // Construction: stones are placed one by one from above
      const local = startAt.current === null ? 0 : clamp01((t - startAt.current - i * 0.22) / 1.1);
      const placed = easeOutExpo(local);
      settled += placed;
      const drop = (1 - placed) * (5 + i * 0.6);
      // Scroll: the cairn opens up like a spine being decompressed
      const spread = scroll * (i * 0.55);
      m.position.y = rest[i] + drop + spread;
      m.position.x = Math.sin(i * 1.7) * 0.06 * (1 + scroll * 3);
      m.rotation.y = i * 0.9 + t * 0.05 * (i % 2 ? 1 : -1) + scroll * (i - 2) * 0.6;
      m.rotation.z = Math.sin(i * 2.3) * 0.05 + scroll * Math.sin(i) * 0.25;
      m.visible = local > 0;
    }
    if (shadow.current) {
      const s = 0.4 + (settled / STONES.length) * 2.6;
      shadow.current.scale.set(s, s * 0.6, 1);
    }
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {STONES.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={geometries[i]}
          material={materials[i]}
          visible={false}
        />
      ))}
      <mesh ref={shadow} position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Stones({ progress, started }: { progress: MotionValue<number>; started: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const on = useOnScreen(host);
  return (
    <div ref={host} className="size-full">
      <Canvas
        frameloop={on ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.9, 8.5], fov: 30 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        aria-hidden="true"
      >
        <StudioEnvironment intensity={0.45} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff1e2" />
        <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#e8cfc7" />
        <Stack progress={progress} started={started} />
      </Canvas>
    </div>
  );
}
