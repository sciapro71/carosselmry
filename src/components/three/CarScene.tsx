"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import { carScroll, ramp, smooth } from "@/components/three/state";
import { hotspots, type Hotspot } from "@/config/site";

/** URL du modèle — surchargée par l'aperçu autonome (GLB embarqué en data URI). */
const MODEL_URL =
  (typeof window !== "undefined" &&
    (window as unknown as { __CAR_GLB__?: string }).__CAR_GLB__) ||
  "/models/car.glb";

/* ------------------------------------------------------------ */
/* Trajectoire caméra                                            */
/* ------------------------------------------------------------ */

const CAMERA_KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [4.7, 1.7, 5.0], look: [0, 0.45, 0] },
  { p: 0.16, pos: [3.3, 1.35, 5.7], look: [0, 0.45, 0] },
  { p: 0.38, pos: [-3.9, 1.45, 5.0], look: [0, 0.45, 0] },
  { p: 0.56, pos: [-2.0, 2.7, 6.0], look: [0, 0.35, 0] },
  { p: 0.84, pos: [4.3, 1.25, 4.7], look: [0, 0.45, 0] },
  { p: 1.0, pos: [5.2, 1.45, 4.3], look: [0, 0.5, 0] },
];

function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let a = CAMERA_KEYS[0];
  let b = CAMERA_KEYS[CAMERA_KEYS.length - 1];
  for (let i = 0; i < CAMERA_KEYS.length - 1; i++) {
    if (p >= CAMERA_KEYS[i].p && p <= CAMERA_KEYS[i + 1].p) {
      a = CAMERA_KEYS[i];
      b = CAMERA_KEYS[i + 1];
      break;
    }
  }
  const t = smooth(ramp(p, a.p, b.p));
  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
  );
  outLook.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], t),
    THREE.MathUtils.lerp(a.look[1], b.look[1], t),
    THREE.MathUtils.lerp(a.look[2], b.look[2], t)
  );
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  const targetPos = useMemo(() => new THREE.Vector3(3.4, 1.2, 3.6), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 1 / 20);
    sampleCamera(carScroll.p, targetPos, targetLook);
    // Écrans portrait : champ de vision élargi pour garder la voiture entière
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const wantedFov = aspect < 0.7 ? 52 : aspect < 1 ? 44 : 34;
    if (Math.abs(cam.fov - wantedFov) > 0.1) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, wantedFov, 1 - Math.exp(-3 * d));
      cam.updateProjectionMatrix();
    }
    // Parallaxe légère au pointeur (désactivée si mouvement réduit)
    if (!carScroll.reducedMotion) {
      targetPos.x += carScroll.pointerX * 0.18;
      targetPos.y += -carScroll.pointerY * 0.12;
    }
    const k = 1 - Math.exp(-4.5 * d);
    camera.position.lerp(targetPos, k);
    currentLook.lerp(targetLook, k);
    camera.lookAt(currentLook);
  });
  return null;
}

/* ------------------------------------------------------------ */
/* Balayage lumineux de diagnostic                               */
/* ------------------------------------------------------------ */

function DiagnosticSweep() {
  const group = useRef<THREE.Group>(null);
  const wide = useRef<THREE.MeshBasicMaterial>(null);
  const thin = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const p = carScroll.p;
    const t = ramp(p, 0.16, 0.37);
    // Le balayage traverse la voiture puis disparaît
    const vis = t > 0 && t < 1 ? Math.sin(Math.min(t, 1) * Math.PI) : 0;
    g.visible = vis > 0.01;
    g.position.x = THREE.MathUtils.lerp(-2.9, 2.9, smooth(t));
    if (wide.current) wide.current.opacity = 0.10 * vis;
    if (thin.current) thin.current.opacity = 0.5 * vis;
    if (light.current) light.current.intensity = 26 * vis;
  });

  return (
    <group ref={group} visible={false}>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 1, 0]}>
        <planeGeometry args={[3.4, 2.3]} />
        <meshBasicMaterial
          ref={wide}
          color="#f36b21"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 1, 0]}>
        <planeGeometry args={[3.4, 0.05]} />
        <meshBasicMaterial
          ref={thin}
          color="#ffd9bd"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={light} color="#f36b21" intensity={0} distance={5} decay={2} position={[0, 1.1, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------ */
/* Points interactifs                                            */
/* ------------------------------------------------------------ */

function HotspotMarkers({ onSelect }: { onSelect: (h: Hotspot) => void }) {
  return (
    <>
      {hotspots.map((h) => (
        <Html
          key={h.id}
          position={h.position}
          center
          zIndexRange={[14, 5]}
          wrapperClass="hotspot-wrapper"
        >
          <button
            type="button"
            className="hotspot"
            aria-label={`${h.title} — en savoir plus`}
            onClick={() => onSelect(h)}
          >
            <span className="hotspot-ring" aria-hidden />
            <span className="hotspot-dot" aria-hidden />
          </button>
        </Html>
      ))}
    </>
  );
}

/* ------------------------------------------------------------ */
/* Voiture + matière peinture                                    */
/* ------------------------------------------------------------ */

// États de la matière au fil de la séquence
const COLOR_ARRIVAL = new THREE.Color("#3d3d41"); // véhicule terne à l'arrivée
const COLOR_PRIMER = new THREE.Color("#8f8f92"); // apprêt gris mat

function CarModel({ onSelect }: { onSelect: (h: Hotspot) => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const chosen = useMemo(() => new THREE.Color(carScroll.colorHex), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: COLOR_ARRIVAL.clone(),
        metalness: 0.35,
        roughness: 0.6,
        clearcoat: 0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.3,
      }),
    []
  );

  // Normalisation du modèle : centré, posé au sol, ~4,4 m de long.
  const prepared = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 4.4 / size.x;
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.material = material;
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });
    return { scale, offset: new THREE.Vector3(-center.x, -box.min.y, -center.z) };
  }, [scene, material]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 1 / 20);
    const p = carScroll.p;

    // Rotation : légère respiration en phase héro + drag utilisateur
    if (group.current) {
      const idle =
        carScroll.reducedMotion
          ? 0
          : Math.sin(state.clock.elapsedTime * 0.22) * 0.1 * (1 - smooth(ramp(p, 0.05, 0.2)));
      const target = idle + carScroll.dragRot;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        target,
        1 - Math.exp(-5 * d)
      );
    }

    // Teinte choisie (transition douce quand l'utilisateur change de couleur)
    tmp.set(carScroll.colorHex);
    chosen.lerp(tmp, 1 - Math.exp(-6 * d));

    // Éclairage global : de l'ombre vers la pleine lumière d'atelier
    const lightLevel = 0.32 + 0.68 * smooth(ramp(p, 0.08, 0.86));
    material.envMapIntensity = 0.25 + lightLevel * 1.15;

    // Séquence apprêt → peinture → vernis
    const t = ramp(p, 0.56, 0.84);
    if (t <= 0) {
      material.color.copy(COLOR_ARRIVAL);
      material.roughness = 0.6;
      material.clearcoat = 0;
      material.metalness = 0.35;
    } else {
      const toPrimer = smooth(ramp(t, 0, 0.3));
      const toPaint = smooth(ramp(t, 0.34, 0.64));
      const toGloss = smooth(ramp(t, 0.68, 1));
      material.color
        .copy(COLOR_ARRIVAL)
        .lerp(COLOR_PRIMER, toPrimer)
        .lerp(chosen, toPaint);
      material.roughness = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.6, 0.68, toPrimer),
        0.34,
        toPaint
      );
      material.roughness = THREE.MathUtils.lerp(material.roughness, 0.1, toGloss);
      material.metalness = THREE.MathUtils.lerp(0.35, 0.72, toPaint);
      material.clearcoat = toGloss;
    }
  });

  return (
    <group ref={group}>
      <group ref={inner} scale={prepared.scale} position={[0, 0, 0]}>
        <group position={prepared.offset}>
          <primitive object={scene} />
        </group>
        {/* Les points interactifs suivent le repère du modèle d'origine */}
        <group position={prepared.offset}>
          <HotspotMarkers onSelect={onSelect} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

/* ------------------------------------------------------------ */
/* Éclairage d'atelier                                           */
/* ------------------------------------------------------------ */

function StudioLights() {
  const key = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const level = 0.32 + 0.68 * smooth(ramp(carScroll.p, 0.08, 0.86));
    if (key.current) key.current.intensity = 90 * level;
    if (fill.current) fill.current.intensity = 0.55 * level;
    if (rim.current) rim.current.intensity = 34 * (0.4 + 0.6 * level);
    if (amb.current) amb.current.intensity = 0.16 + 0.3 * level;
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.2} color="#f7f6f2" />
      <spotLight
        ref={key}
        position={[4, 6, 4]}
        angle={0.65}
        penumbra={0.7}
        intensity={40}
        color="#fff3e8"
        distance={20}
        decay={1.8}
      />
      <directionalLight ref={fill} position={[-5, 3, -2]} intensity={0.3} color="#dfe3ea" />
      <spotLight
        ref={rim}
        position={[-4, 4.5, -5]}
        angle={0.7}
        penumbra={0.9}
        intensity={30}
        color="#f08a4b"
        distance={18}
        decay={2}
      />
    </>
  );
}

/* ------------------------------------------------------------ */
/* Scène complète                                                */
/* ------------------------------------------------------------ */

export default function CarScene({
  onSelect,
  quality,
}: {
  onSelect: (h: Hotspot) => void;
  quality: "high" | "low";
}) {
  return (
    <>
      <color attach="background" args={["#0a0a0b"]} />
      <fog attach="fog" args={["#0a0a0b", 13, 28]} />

      <CameraRig />
      <StudioLights />
      <DiagnosticSweep />
      <CarModel onSelect={onSelect} />

      {/* Sol d'atelier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <circleGeometry args={[11, 48]} />
        <meshStandardMaterial color="#101012" roughness={0.85} metalness={0.15} />
      </mesh>
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.72}
        scale={9}
        blur={2.4}
        far={2.2}
        resolution={quality === "high" ? 512 : 256}
        frames={1}
        color="#000000"
      />

      {/* Environnement studio procédural (aucune ressource externe) */}
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#ffffff"
          position={[0, 4, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[7, 2.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#f7f6f2"
          position={[-5, 1.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#ffe2cc"
          position={[5, 1.6, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 1, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#f36b21"
          position={[0, 1.2, -6]}
          scale={[4, 0.7, 1]}
        />
      </Environment>
    </>
  );
}
