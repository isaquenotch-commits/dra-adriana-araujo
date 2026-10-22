import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp01, easeOutExpo, StudioEnvironment, useOnScreen, usePointer } from "./shared";

const COUNT = 22;
const BONE = new THREE.Color("#ece3d5");
const HOT = new THREE.Color("#b98a6e");
const DISC = new THREE.Color("#e8cfc7");

/** Where vertebra i sits on the S-curve, and how big it is. */
function layout(i: number) {
  const t = i / (COUNT - 1);
  const y = 3.3 - t * 6.6;
  // Cervical lordosis → thoracic kyphosis → lumbar lordosis → sacrum
  const z = 0.32 * Math.sin(t * Math.PI * 2.1 + 0.2) - (t > 0.86 ? (t - 0.86) * 3 : 0);
  const tilt = 0.32 * Math.cos(t * Math.PI * 2.1 + 0.2);
  const lumbar = Math.min(t, 0.86) / 0.86;
  const sacral = t > 0.86 ? 1 - (t - 0.86) * 3.2 : 1;
  const s = (0.5 + lumbar * 0.62) * sacral;
  return { y, z, tilt, s };
}

function Vertebrae({ range, built }: { range: [number, number]; built: boolean }) {
  const group = useRef<THREE.Group>(null);
  const parts = useRef<(THREE.Group | null)[]>([]);
  const startAt = useRef<number | null>(null);
  const pointer = usePointer();

  const geo = useMemo(() => {
    const body = new THREE.CylinderGeometry(0.34, 0.37, 0.19, 40, 1);
    body.translate(0, 0, 0.1);
    const disc = new THREE.CylinderGeometry(0.31, 0.31, 0.08, 32);
    disc.translate(0, -0.15, 0.1);
    const spinous = new THREE.ConeGeometry(0.08, 0.55, 12);
    spinous.rotateX(-Math.PI / 2 - 0.45);
    spinous.translate(0, -0.08, -0.62);
    const transverse = new THREE.CapsuleGeometry(0.055, 0.5, 6, 12);
    transverse.rotateZ(Math.PI / 2);
    const arch = new THREE.TorusGeometry(0.17, 0.05, 10, 24, Math.PI);
    arch.rotateX(Math.PI / 2);
    arch.rotateZ(Math.PI);
    arch.translate(0, 0, -0.2);
    return { body, disc, spinous, transverse, arch };
  }, []);

  const mats = useMemo(
    () =>
      Array.from(
        { length: COUNT },
        () =>
          // Standard (not Physical) material: a much lighter shader for 22 vertebrae
          new THREE.MeshStandardMaterial({
            color: BONE.clone(),
            roughness: 0.5,
            emissive: HOT.clone(),
            emissiveIntensity: 0,
          }),
      ),
    [],
  );
  // No transmission: it forces an extra full render pass every frame
  const discMat = useMemo(() => new THREE.MeshStandardMaterial({ color: DISC, roughness: 0.35 }), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (built && startAt.current === null) startAt.current = t;
    const g = group.current;
    if (!g) return;

    const all = range[0] === 0 && range[1] === COUNT - 1;
    const mid = (layout(range[0]).y + layout(range[1]).y) / 2;
    const zoom = all ? 0.62 : 0.86;
    // Centre the active region and lean in
    g.position.y = THREE.MathUtils.damp(g.position.y, -mid * zoom, 3.2, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, zoom, 3.2, dt));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.9 + Math.sin(t * 0.25) * 0.35 + pointer.current.x * 0.4, 2.5, dt);

    for (let i = 0; i < COUNT; i++) {
      const p = parts.current[i];
      if (!p) continue;
      // Construction: assembled bottom-up, vertebra by vertebra
      const order = COUNT - 1 - i;
      const local = startAt.current === null ? 0 : clamp01((t - startAt.current - order * 0.05) / 0.9);
      const k = easeOutExpo(local);
      p.visible = local > 0;
      const L = layout(i);
      p.position.set((1 - k) * (i % 2 ? 2.2 : -2.2), L.y + (1 - k) * 0.6, L.z);
      p.rotation.set(L.tilt + (1 - k) * 1.2, (1 - k) * 2, 0);
      p.scale.setScalar(L.s * (0.6 + 0.4 * k));

      const active = i >= range[0] && i <= range[1];
      const m = mats[i];
      const pulse = active ? 0.22 + Math.sin(t * 2.4 - i * 0.35) * 0.1 : 0;
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, pulse, 6, dt);
      m.color.lerp(active ? HOT : BONE, 1 - Math.exp(-5 * dt));
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: COUNT }, (_, i) => (
        <group
          key={i}
          ref={(g) => {
            parts.current[i] = g;
          }}
          visible={false}
        >
          <mesh geometry={geo.body} material={mats[i]} />
          <mesh geometry={geo.arch} material={mats[i]} />
          <mesh geometry={geo.spinous} material={mats[i]} />
          <mesh geometry={geo.transverse} material={mats[i]} position={[0, 0, -0.18]} />
          {i < COUNT - 4 && <mesh geometry={geo.disc} material={discMat} />}
        </group>
      ))}
    </group>
  );
}

export default function Spine({ range, built }: { range: [number, number]; built: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const on = useOnScreen(host);
  return (
    <div ref={host} className="size-full">
      <Canvas
        frameloop={on ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 32 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        aria-hidden="true"
      >
        <StudioEnvironment intensity={0.7} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={2} color="#fff1e2" />
        <directionalLight position={[-5, -2, -4]} intensity={1.2} color="#b98a6e" />
        <Vertebrae range={range} built={built} />
      </Canvas>
    </div>
  );
}
