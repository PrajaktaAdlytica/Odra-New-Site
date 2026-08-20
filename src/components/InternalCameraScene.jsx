import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

const sceneImages = [
  "/assets/portal-entry-v2.png",
  "/assets/portal-hero-v3.png",
  "/assets/portal-global-v2.png",
  "/assets/odra-editorial-lavender.webp",
  "/assets/odra-editorial-mint.webp",
  "/assets/odra-editorial-yellow.webp",
  "/assets/odra-architectural-hero.webp",
  "/assets/odra-founder-collaboration.png",
];

function CameraRig({ progress, sceneCount }) {
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const destination = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    // Move from the current room to the next room while both section surfaces
    // remain present; there is no standalone empty-image chapter.
    const travel = Math.max(1, sceneCount - 1) * 18;
    const z = 12 - progress.current * travel;
    const x = Math.sin(progress.current * Math.PI * Math.max(1, sceneCount - 1)) * .72;
    destination.set(x, 2.2, z);
    const damping = 1 - Math.exp(-delta * 6.2);
    camera.position.lerp(destination, damping);
    lookAt.lerp(new THREE.Vector3(x, 2.2, z - 14), damping);
    camera.lookAt(lookAt);
  });
  return null;
}

function JourneyPlanes({ sceneCount }) {
  const textures = useTexture(sceneImages);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return Array.from({ length: Math.max(2, sceneCount + 1) }, (_, index) => {
    const texture = textures[index % textures.length];
    const x = Math.sin(index * 1.7) * .7;
    const tone = index % 3 === 0 ? "#fff7f0" : index % 3 === 1 ? "#f1ebfb" : "#e8f5ef";
    return (
      <group position={[x, 2.2, 3 - index * 18]} key={index}>
        <mesh position={[0, 0, -.08]}>
          <planeGeometry args={[27, 15.2]} />
          <meshBasicMaterial color={tone} toneMapped={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[24.8, 13.95]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -6.15, .12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[28, 14]} />
          <meshStandardMaterial color="#f7efe6" roughness={1} />
        </mesh>
      </group>
    );
  });
}

function InternalScene({ progress, sceneCount }) {
  return <>
    <color attach="background" args={["#fff7f0"]} />
    <fog attach="fog" args={["#fff7f0", 26, 54]} />
    <ambientLight intensity={1.4} color="#fffaf4" />
    <directionalLight position={[-4, 9, 7]} intensity={1.1} color="#fff2e2" />
    <CameraRig progress={progress} sceneCount={sceneCount} />
    <JourneyPlanes sceneCount={sceneCount} />
  </>;
}

export default function InternalCameraScene({ progress, sceneCount }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  if (reducedMotion || failed) return null;

  return <Canvas
    dpr={[1, 1.35]}
    camera={{ position: [0, 2.2, 12], fov: 42, near: .1, far: 72 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    onCreated={({ gl }) => {
      gl.setClearColor("#fff7f0", 0);
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.08;
    }}
    onError={() => setFailed(true)}
  ><InternalScene progress={progress} sceneCount={sceneCount} /></Canvas>;
}
