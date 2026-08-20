import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import {
  consortiumPartners,
  events,
  faqGroups,
  founderSupport,
  investmentCriteria,
  metrics,
  news,
  processSteps,
  team,
  thesisAreas,
} from "./siteData";
import { portfolioCompanies as portfolio } from "./data/portfolio";
import { isPhaseTwoPath, isPublicPath, isSchoolPath } from "./data/routeRegistry";
import { RouteLoading } from "./components/PagePrimitives";
import { SiteFooter, SiteHeader, SiteShell, SkipLink } from "./components/SiteChrome";

gsap.registerPlugin(ScrollTrigger);

const PhaseTwoRoutes = lazy(() => import("./phase-two/PhaseTwoRoutes"));
const ApplicationPage = lazy(() => import("./application/ApplicationPage"));
const PublicRoutes = lazy(() => import("./public/PublicRoutes"));
const SchoolRoutes = lazy(() => import("./school/SchoolRoutes"));

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const palette = {
  orange: "#ea580c",
  orangeDeep: "#c94305",
  cream: "#fff7f0",
  paper: "#fffdfa",
  stone: "#e8dfd4",
  stoneShadow: "#cfc1b2",
  ink: "#2a2733",
  lavender: "#d8d0f1",
  mint: "#d5eee5",
  blue: "#d7e7f5",
  yellow: "#f2dda1",
};

const cameraKeys = [
  { p: 0, position: [-0.1, 2.25, 10.8], target: [0, 2.25, -2.5] },
  { p: 0.12, position: [0.2, 2.15, 8.4], target: [1.1, 2.2, -3.8] },
  { p: 0.245, position: [3.85, 1.95, 0.8], target: [4.15, 2.05, -5.6] },
  { p: 0.31, position: [4.15, 1.9, -11.8], target: [2.2, 2.05, -18.2] },
  { p: 0.37, position: [-0.1, 2.35, -10.8], target: [0.55, 2.25, -29.4] },
  { p: 0.52, position: [0.35, 2.2, -15.8], target: [3.25, 2.15, -29.4] },
  { p: 0.625, position: [5.7, 1.75, -25.5], target: [5.9, 1.9, -31.2] },
  { p: 0.69, position: [4.15, 1.9, -37.8], target: [1.2, 2.15, -45.5] },
  { p: 0.76, position: [0.2, 2.25, -39.3], target: [0.8, 2.25, -50] },
  { p: 1, position: [0, 2.5, -40.2], target: [0.7, 2.3, -50] },
];

function eased(value) {
  return value * value * (3 - 2 * value);
}

function sampleCamera(progress) {
  if (progress > 1) {
    const continuationCameraKeys = [
      { p: 1, position: [0, 2.5, -40.2], target: [0.7, 2.3, -50] },
      { p: 2, position: [0.45, 2.25, -58], target: [0.45, 2.25, -68] },
      { p: 3, position: [-0.35, 2.35, -76], target: [-0.2, 2.3, -86] },
      { p: 4, position: [0.55, 2.15, -94], target: [0.5, 2.2, -104] },
      { p: 5, position: [-0.45, 2.3, -112], target: [-0.3, 2.28, -122] },
      { p: 6, position: [0.35, 2.2, -130], target: [0.4, 2.25, -140] },
      { p: 7, position: [0, 2.3, -148], target: [0, 2.3, -158] },
    ];
    const nextIndex = continuationCameraKeys.findIndex((key) => key.p >= progress);
    if (nextIndex <= 0) return continuationCameraKeys[0];
    if (nextIndex === -1) return continuationCameraKeys[continuationCameraKeys.length - 1];
    const a = continuationCameraKeys[nextIndex - 1];
    const b = continuationCameraKeys[nextIndex];
    const t = eased((progress - a.p) / (b.p - a.p));
    return {
      position: a.position.map((value, index) => THREE.MathUtils.lerp(value, b.position[index], t)),
      target: a.target.map((value, index) => THREE.MathUtils.lerp(value, b.target[index], t)),
    };
  }
  const nextIndex = cameraKeys.findIndex((key) => key.p >= progress);
  if (nextIndex <= 0) return cameraKeys[0];
  if (nextIndex === -1) return cameraKeys[cameraKeys.length - 1];
  const a = cameraKeys[nextIndex - 1];
  const b = cameraKeys[nextIndex];
  const t = eased((progress - a.p) / (b.p - a.p));
  return {
    position: a.position.map((value, index) => THREE.MathUtils.lerp(value, b.position[index], t)),
    target: a.target.map((value, index) => THREE.MathUtils.lerp(value, b.target[index], t)),
  };
}

function CameraJourney({ progress }) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const frame = sampleCamera(progress.current);
    const damping = 1 - Math.exp(-delta * 6.5);
    camera.position.lerp(new THREE.Vector3(...frame.position), damping);
    target.lerp(new THREE.Vector3(...frame.target), damping);
    camera.lookAt(target);
  });

  return null;
}

function PlasterMaterial({ color = "#ffffff", repeat = [3, 3], roughness = 0.96 }) {
  const source = useTexture("/assets/ivory-plaster.png");
  const texture = useMemo(() => {
    const clone = source.clone();
    clone.wrapS = clone.wrapT = THREE.RepeatWrapping;
    clone.repeat.set(...repeat);
    clone.colorSpace = THREE.SRGBColorSpace;
    clone.needsUpdate = true;
    return clone;
  }, [source, repeat]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <meshStandardMaterial
      bumpMap={texture}
      bumpScale={0.018}
      color={color}
      roughness={roughness}
      metalness={0}
      envMapIntensity={0.22}
    />
  );
}

function ArchPortal({ position, innerColor = palette.orangeDeep, scale = 1, filled = false, stone = "#fffefa", steps = false }) {
  const archGeometry = useMemo(() => {
    const points = [];
    for (let index = 0; index <= 48; index += 1) {
      const angle = Math.PI - (Math.PI * index) / 48;
      points.push(new THREE.Vector2(Math.cos(angle) * 2.25, Math.sin(angle) * 2.25));
    }
    for (let index = 0; index <= 48; index += 1) {
      const angle = (Math.PI * index) / 48;
      points.push(new THREE.Vector2(Math.cos(angle) * 1.42, Math.sin(angle) * 1.42));
    }
    const result = new THREE.ExtrudeGeometry(new THREE.Shape(points), {
      depth: 0.82,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      curveSegments: 48,
    });
    result.translate(0, 0, -0.41);
    return result;
  }, []);

  const fillShape = useMemo(() => {
    const points = [new THREE.Vector2(-1.42, 0), new THREE.Vector2(1.42, 0), new THREE.Vector2(1.42, 2.95)];
    for (let index = 0; index <= 48; index += 1) {
      const angle = (Math.PI * index) / 48;
      points.push(new THREE.Vector2(Math.cos(angle) * 1.42, 2.95 + Math.sin(angle) * 1.42));
    }
    return new THREE.Shape(points);
  }, []);

  const portalScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <group position={position} scale={portalScale}>
      <mesh position={[-1.835, 1.475, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.83, 2.95, 0.82]} />
        <PlasterMaterial color={stone} repeat={[1.2, 2.6]} />
      </mesh>
      <mesh position={[1.835, 1.475, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.83, 2.95, 0.82]} />
        <PlasterMaterial color={stone} repeat={[1.2, 2.6]} />
      </mesh>
      <mesh geometry={archGeometry} position={[0, 2.95, 0]} castShadow receiveShadow>
        <PlasterMaterial color={stone} repeat={[2.2, 2.2]} />
      </mesh>
      {filled && (
        <mesh position={[0, 0, -0.08]} receiveShadow>
          <shapeGeometry args={[fillShape, 48]} />
          <meshBasicMaterial color={innerColor} toneMapped={false} />
        </mesh>
      )}
      {steps && [0, 1, 2, 3].map((step) => (
        <mesh key={step} position={[0, 0.1 + step * 0.13, -1.0 - step * 0.54]} castShadow receiveShadow>
          <boxGeometry args={[2.72 + step * 0.22, 0.2, 1.0]} />
          <PlasterMaterial color="#fffdfa" repeat={[2.4, 1]} />
        </mesh>
      ))}
      <rectAreaLight position={[0, 2.15, 0.54]} rotation={[0, Math.PI, 0]} width={2.5} height={3.7} intensity={filled ? 0.42 : 0.58} color="#fff0dc" />
    </group>
  );
}

function CurrentPath({ points, opacity = 1 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, 120, 0.013, 10, false);
  }, [points]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={palette.orange} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function RoadRibbon({ points, radius = 0.52 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, 96, radius, 18, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#eee8df" roughness={0.98} />
    </mesh>
  );
}

function EntryRoom() {
  return (
    <group>
      <mesh position={[0, -0.08, -1]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <PlasterMaterial color="#fffefa" repeat={[7, 7]} />
      </mesh>
      <mesh position={[-3.1, 3.5, -5.55]} receiveShadow castShadow>
        <boxGeometry args={[10.45, 7, 1.05]} />
        <PlasterMaterial color="#fffdf8" repeat={[4.8, 3.3]} />
      </mesh>
      <mesh position={[9.38, 3.5, -5.55]} receiveShadow castShadow>
        <boxGeometry args={[5.9, 7, 1.05]} />
        <PlasterMaterial color="#f3e8dd" repeat={[3, 3.3]} />
      </mesh>
      <mesh position={[4.2, 6.08, -5.55]} receiveShadow castShadow>
        <boxGeometry args={[4.52, 1.84, 1.05]} />
        <PlasterMaterial color="#f3e8dd" repeat={[2.2, 1]} />
      </mesh>
      <mesh position={[4.2, 3.0, -7.85]} receiveShadow>
        <boxGeometry args={[4.58, 6.0, 0.18]} />
        <PlasterMaterial color="#fff6ed" repeat={[2.2, 2.8]} />
      </mesh>
      <ArchPortal position={[4.2, 0, -4.98]} stone="#eee2d6" scale={[0.73, 0.93, 1]} steps />
      <RoundedBox args={[4.25, 1.22, 2.75]} radius={0.035} position={[-6.7, 0.57, -2.65]} castShadow receiveShadow>
        <PlasterMaterial color="#e5d5c6" repeat={[2.2, 1.1]} />
      </RoundedBox>
      <mesh position={[-6.65, 1.72, -2.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.72, 96, 96]} />
        <PlasterMaterial color="#d2c0ae" repeat={[2.2, 1.8]} />
      </mesh>
      <CurrentPath points={[
        [-0.6, 0.035, 4], [0.6, 0.035, 1.8], [1.9, 0.035, -1], [4.1, 0.035, -4.7],
      ]} />
    </group>
  );
}

function HeroRoom() {
  return (
    <group position={[0, 0, -18]}>
      <mesh position={[0, -0.08, -1]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 28]} />
        <PlasterMaterial color="#fffefa" repeat={[7, 7]} />
      </mesh>
      <mesh position={[6.25, 3.5, -12.15]} receiveShadow castShadow>
        <boxGeometry args={[11.6, 7, 1.0]} />
        <PlasterMaterial color="#fffaf4" repeat={[5.8, 3.2]} />
      </mesh>
      <mesh position={[4.25, 4.45, -11.58]} receiveShadow>
        <shapeGeometry args={[(() => {
          const blueField = new THREE.Shape();
          blueField.moveTo(-3.7, 2.45);
          blueField.lineTo(5.8, 2.45);
          blueField.lineTo(5.8, -1.75);
          blueField.lineTo(-3.7, 0.25);
          blueField.closePath();
          return blueField;
        })()]} />
        <meshBasicMaterial color="#bdd3ea" toneMapped={false} />
      </mesh>
      <ArchPortal position={[5.9, 0, -11.0]} innerColor="#ca4b1a" stone="#f6eee8" scale={[0.61, 0.88, 0.72]} filled />
      <mesh position={[2.42, 0.025, -11.54]} receiveShadow>
        <shapeGeometry args={[(() => {
          const wedge = new THREE.Shape();
          wedge.moveTo(0, 0);
          wedge.lineTo(8.8, 0);
          wedge.lineTo(8.8, 3.8);
          wedge.closePath();
          return wedge;
        })()]} />
        <meshBasicMaterial color="#d8d0f1" toneMapped={false} />
      </mesh>
      <CurrentPath points={[
        [-2.8, 0.035, 1.5], [-1, 0.035, -2], [0.8, 0.035, -5.5], [5.85, 0.035, -11.4],
      ]} />
    </group>
  );
}

function WorldMap() {
  const geometry = useMemo(() => {
    const countries = feature(worldData, worldData.objects.countries);
    const positions = [];
    const addRing = (ring) => {
      for (let index = 0; index < ring.length; index += 3) {
        const [lon, lat] = ring[index];
        positions.push((lon / 180) * 8.4, 2.85 + (lat / 90) * 2.35, 0);
      }
    };

    countries.features.forEach((country) => {
      const coordinates = country.geometry.coordinates;
      if (country.geometry.type === "Polygon") coordinates.forEach(addRing);
      if (country.geometry.type === "MultiPolygon") coordinates.forEach((polygon) => polygon.forEach(addRing));
    });

    const mapGeometry = new THREE.BufferGeometry();
    mapGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return mapGeometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#7896b0" size={0.052} transparent opacity={0.78} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function MiniPortal({ position, color, scale = 0.62 }) {
  return (
    <group position={position} scale={scale}>
      <ArchPortal position={[0, 0, 0]} innerColor="#fff7eb" stone={color} scale={0.72} filled />
      <pointLight position={[0, 1.7, 0.3]} color="#ffd5b5" intensity={0.38} distance={3.2} />
    </group>
  );
}

function GlobalRoom() {
  return (
    <group position={[0, 0, -44]}>
      <mesh position={[0, -0.08, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 25]} />
        <PlasterMaterial color="#fffefa" repeat={[8, 6]} />
      </mesh>
      <mesh position={[0, 3.5, -6.2]} receiveShadow castShadow>
        <boxGeometry args={[20, 7, 0.9]} />
        <PlasterMaterial color="#fffaf5" repeat={[7, 3]} />
      </mesh>
      <group position={[1.7, 1.28, -5.66]} scale={0.62}><WorldMap /></group>
      <RoadRibbon points={[
        [-10.5, 0.08, 2.2], [-8.4, 0.08, 0.9], [-6.7, 0.08, -0.4], [-5.8, 0.08, -2.1], [-5.72, 0.08, -5.1],
      ]} radius={0.46} />
      <MiniPortal position={[-5.7, 0, -5.64]} color="#d5cbed" scale={0.155} />
      <MiniPortal position={[-1.55, 0, -5.64]} color="#edc97f" scale={0.16} />
      <MiniPortal position={[3.05, 0, -5.64]} color="#bfe1d4" scale={0.155} />
      <MiniPortal position={[6.4, 0, -5.64]} color="#c2d9ec" scale={0.15} />
      <CurrentPath points={[
        [-9.5, 0.02, 1.8], [-7.2, 0.02, -0.3], [-5.9, 0.02, -2.1], [-5.7, 0.02, -5.15],
      ]} opacity={0.18} />
      <CurrentPath points={[
        [-5.7, 0.03, -5.28], [-3.8, 0.28, -5.25], [-1.55, 0.03, -5.28],
        [0.7, 0.28, -5.25], [3.05, 0.03, -5.28], [4.7, 0.22, -5.25], [6.4, 0.03, -5.28],
      ]} opacity={0.85} />
    </group>
  );
}

function VisualPlate({ src, position, width = 28 }) {
  const texture = useTexture(src);
  const height = width * (9 / 16);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
    </mesh>
  );
}

function Scene({ progress }) {
  const warmLight = useRef();

  useFrame(() => {
    if (!warmLight.current) return;
    const p = progress.current;
    warmLight.current.intensity = THREE.MathUtils.lerp(1.52, 1.3, Math.min(1, p * 1.5));
    warmLight.current.position.x = THREE.MathUtils.lerp(-4, 3, p);
  });

  return (
    <>
      <color attach="background" args={[palette.cream]} />
      <fog attach="fog" args={[palette.cream, 34, 78]} />
      <hemisphereLight intensity={0.9} color="#fffdf9" groundColor="#d8cec5" />
      <ambientLight intensity={0.9} color="#fffaf3" />
      <directionalLight ref={warmLight} position={[-7, 11, 8]} intensity={1.52} color="#fff3e4" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.00018} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-10} />
      <directionalLight position={[8, 8, -34]} intensity={0.3} color="#dceaff" />
      <CameraJourney progress={progress} />
      <VisualPlate src="/assets/portal-entry-v2.png" position={[0, 2.25, -5.2]} width={22} />
      <VisualPlate src="/assets/portal-hero-v3.png" position={[1.4, 2.2, -29.55]} width={19.5} />
      <VisualPlate src="/assets/portal-global-v2.png" position={[0.7, 2.25, -50]} width={14} />
      <VisualPlate src="/assets/odra-editorial-lavender.webp" position={[0.45, 2.25, -68]} width={16.8} />
      <VisualPlate src="/assets/odra-architectural-hero.webp" position={[-0.2, 2.3, -86]} width={16.8} />
      <VisualPlate src="/assets/odra-editorial-mint.webp" position={[0.5, 2.2, -104]} width={16.8} />
      <VisualPlate src="/assets/odra-global-network-map.png" position={[-0.3, 2.28, -122]} width={16.8} />
      <VisualPlate src="/assets/odra-founder-collaboration.png" position={[0.4, 2.25, -140]} width={16.8} />
      <VisualPlate src="/assets/odra-editorial-yellow.webp" position={[0, 2.3, -158]} width={16.8} />
    </>
  );
}

const routes = [
  ["Team", "/team"],
  ["Partners", "/partners"],
  ["Thesis", "/thesis"],
  ["Newsroom", "/newsroom"],
  ["Events", "/events"],
  ["FAQ", "/faq"],
];

function Icon({ name, alt = "" }) {
  return <img className="ui-icon" src={`/assets/icons/${name}.svg`} alt={alt} />;
}

function SocialIcon({ name }) {
  if (name === "linkedin") {
    return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.15 7.75a2.12 2.12 0 1 0 0-4.24 2.12 2.12 0 0 0 0 4.24ZM3.35 20.5h3.6V9.35h-3.6V20.5Zm5.84 0h3.6v-6.21c0-1.64.31-3.23 2.35-3.23 2.01 0 2.04 1.88 2.04 3.34v6.1h3.6v-6.88c0-3.38-.73-5.98-4.68-5.98-1.9 0-3.17 1.04-3.69 2.02h-.05V9.35H9.19V20.5Z" /></svg>;
  }
  if (name === "x") {
    return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 3.5h4.63l4.14 5.52 4.78-5.52h2.06l-5.87 6.78 6.37 8.49H15.7l-4.48-5.98-5.17 5.98H4l6.25-7.24L4.2 3.5Zm3.71 1.58h-.72l9.3 12.2h.73L7.91 5.08Z" /></svg>;
  }
  return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M3.5 5.25A2.25 2.25 0 0 0 1.25 7.5v9A2.25 2.25 0 0 0 3.5 18.75h17a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-17Zm.13 1.5 8.37 6.1 8.37-6.1H3.63Zm17.62 1.12-8.81 6.43a.75.75 0 0 1-.88 0L2.75 7.87v8.63c0 .41.34.75.75.75h17a.75.75 0 0 0 .75-.75V7.87Z" clipRule="evenodd" /></svg>;
}

function Header() {
  return <SiteHeader />;
}

function ChapterLabel({ number, name }) {
  return <div className="chapter-label" aria-hidden="true"><span>{number}</span><i /><strong>{name}</strong></div>;
}

function AppContent() {
  return (
    <>
      <section className="chapter entry-chapter" id="entry">
        <ChapterLabel number="01" name="Entry" />
        <div className="chapter-copy entry-copy">
          <h1>Built for the long run.<br />By those who build.</h1>
          <i className="copy-accent" />
          <span>We partner early and stay close—sharing experience, opening doors, and helping you build what lasts.</span>
        </div>
      </section>
      <section className="chapter hero-chapter" id="hero">
        <ChapterLabel number="02" name="Hero" />
        <div className="chapter-copy hero-copy">
          <p className="eyebrow"><i /> Now accepting applications</p>
          <h2>We back<br /><em>ambitious founders</em><br />building<br />category-defining<br />companies.</h2>
          <span>Capital, networks, and hands-on support to help you build a category-defining company.</span>
          <div className="actions">
            <a className="primary-action" href="/apply">Apply now <b>→</b></a>
            <a className="secondary-action" href="/investment">Our investment approach <b>→</b></a>
          </div>
        </div>
      </section>
      <section className="chapter global-chapter" id="global">
        <ChapterLabel number="03" name="Global ambition" />
        <div className="chapter-copy global-copy">
          <p className="eyebrow">Connected by founder focus</p>
          <h2>Global ambition.<br /><em>Connected by<br />founder focus.</em></h2>
          <span>We build a global network of operators, partners, and investors to support founders everywhere.</span>
        </div>
      </section>
      <div className="journey-progress" aria-hidden="true"><span /></div>
    </>
  );
}

function SectionLabel({ number, name }) {
  return <aside className="section-index"><span>{number}</span><i /><strong>{name}</strong></aside>;
}

function AnimatedMetric({ value, label, index }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const target = Number(value.replace(/\D/g, ""));
    const prefix = value.startsWith("$") ? "$" : "";
    const middle = value.includes("M") ? "M" : "";
    const suffix = value.endsWith("+") ? "+" : "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced) { setDisplay(value); return; }
      const started = performance.now() + index * 110;
      const tick = (now) => {
        const progress = Math.min(1, Math.max(0, (now - started) / 1450));
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${prefix}${Math.round(target * easedProgress)}${middle}${suffix}`);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: .55 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [index, value]);

  return <article className="motion-card" ref={ref}><strong>{display}</strong><span>{label}</span><i aria-hidden="true" /></article>;
}

function ProofSection() {
  return <section className="continuation-section proof-section motion-reveal" id="proof">
    <SectionLabel number="03" name="Global proof" />
    <div className="section-intro"><p className="kicker">The platform in motion</p><h2>Built around<br />founder progress.</h2><p>Capital, technology, experienced operators, and company relationships connected across one venture platform.</p></div>
    <div className="metric-grid">{metrics.map((metric, index) => <AnimatedMetric {...metric} index={index} key={metric.label} />)}</div>
  </section>;
}

function SupportSection() {
  const visuals = ["odra-editorial-lavender.webp", "odra-editorial-mint.webp", "odra-editorial-yellow.webp"];
  return (
    <section className="continuation-section support-section motion-reveal" id="support">
      <SectionLabel number="04" name="Founder support" />
      <div className="section-intro">
        <p className="kicker">How we help founders win</p>
        <h2>Three ways<br /><em>we help you scale.</em></h2>
      </div>
      <div className="support-grid">
        {founderSupport.map((item, index) => (
          <article className={`support-card ${item.tone}`} key={item.title}>
            <img className="support-photo" src={`/assets/${visuals[index]}`} alt="" />
            <div className="support-overlay" />
            <span className="card-number">{item.number}</span>
            <Icon name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <a href="/founder-support" aria-label={`Learn about ${item.title}`}><Icon name="arrow-right" /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

function NetworkSection() {
  return (
    <section className="continuation-section network-preview motion-heading" id="network">
      <SectionLabel number="07" name="Network ecosystem" />
      <div className="section-intro compact"><p className="kicker">Access with context</p><h2>A network built<br /><em>around the decision.</em></h2><p>Founder peers, operators, market relationships, learning infrastructure, and capital conversations—connected when they can move the company forward.</p><a className="text-link" href="/network">Explore the network <Icon name="arrow-right" /></a></div>
      <div className="network-preview-map"><img src="/assets/odra-global-network-map.png" alt="Abstract map of Odra's connected founder network" /><div>{["Founder peers", "Operators", "Market access", "Capital relationships"].map((item, index) => <a href="/network" className="motion-card" key={item}><span>0{index + 1}</span><strong>{item}</strong><Icon name="arrow-right" /></a>)}</div></div>
    </section>
  );
}

function PeopleProofSection() {
  return (
    <section className="continuation-section people-proof motion-heading" id="people-proof">
      <SectionLabel number="08" name="People, stories & proof" />
      <div className="section-intro compact"><p className="kicker">Experience in the room</p><h2>People who help<br /><em>make the next move clearer.</em></h2><p>Meet the team, read practical founder perspectives, and enter the conversations behind company-building progress.</p><div className="people-proof-links"><a className="text-link" href="/team">Meet the team <Icon name="arrow-right" /></a><a className="text-link" href="/insights">Read insights <Icon name="arrow-right" /></a></div></div>
      <div className="people-proof-grid">{team.slice(0, 3).map((person, index) => <a href="/team" className="motion-card" key={person.name}><img src={person.image} alt={person.name} /><span>0{index + 1}</span><small>{person.role}</small><h3>{person.name}</h3></a>)}<a className="people-proof-story motion-card" href="/insights/evidence-before-velocity"><small>Founder practice · 6 min</small><h3>Evidence before velocity.</h3><p>What early momentum should actually prove.</p><Icon name="arrow-right" /></a></div>
    </section>
  );
}

function ThesisPreview() {
  const cards = [
    { number: "01", title: "Category-shaping ambition", body: "We look for founders who can reframe an important market and make a new future feel inevitable.", image: "/assets/odra-editorial-lavender.webp" },
    { number: "02", title: "Technology with consequence", body: "The strongest products solve a real problem, deepen with use, and create value that compounds over time.", image: "/assets/odra-architectural-hero.webp" },
    { number: "03", title: "Evidence before theatre", body: "Founder insight, customer pull, and technical advantage matter more than a polished performance of certainty.", image: "/assets/odra-editorial-yellow.webp" },
  ];
  return (
    <section className="continuation-section thesis-preview motion-reveal" id="thesis-preview">
      <SectionLabel number="05" name="Investment thesis" />
      <div className="section-intro compact"><p className="kicker">What we believe</p><h2>Our investment<br /><em>approach.</em></h2><p>We back ambitious founders building technology companies with the potential to matter globally.</p><a className="text-link" href="/investment">Explore our approach <Icon name="arrow-right" /></a></div>
      <div className="thesis-card-grid">
        {cards.map((card) => <a className="thesis-photo-card" href="/investment" key={card.title} style={{ "--card-image": `url(${card.image})` }}><span>{card.number}</span><h3>{card.title}</h3><p>{card.body}</p><Icon name="arrow-right" /></a>)}
      </div>
    </section>
  );
}

function PortfolioPreview() {
  const [active, setActive] = useState(0);
  const companies = portfolio.slice(0, 5);
  return (
    <section className="continuation-section portfolio-preview motion-reveal" id="portfolio">
      <SectionLabel number="06" name="Portfolio preview" />
      <div className="section-intro compact"><h2>Companies<br />in focus.</h2><p>Explore the ten companies approved for the redesigned Odra portfolio.</p><a className="text-link" href="/portfolio">View all companies <Icon name="arrow-right" /></a></div>
      <div className="portfolio-list">
        {companies.map((company, index) => <a href={`/portfolio/${company.slug}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} key={company.name}><strong>{company.name}</strong><span>{company.sector}</span><small>{company.domain}</small><b>+</b></a>)}
      </div>
      <a className="portfolio-image" href={`/portfolio/${companies[active].slug}`}><img key={companies[active].image} src={companies[active].image} alt="" /><span>{companies[active].name}<Icon name="arrow-up-right" /></span></a>
    </section>
  );
}

function ApplySection() {
  return (
    <section className="continuation-section apply-section motion-reveal" id="apply">
      <SectionLabel number="09" name="Apply portal" />
      <img className="apply-photo" src="/assets/odra-founder-collaboration.png" alt="Founders collaborating around a table" />
      <div className="apply-wash" />
      <div className="apply-copy"><p className="kicker">Applications are open</p><h2>Let’s build<br /><em>what lasts.</em></h2><p>We are always excited to meet ambitious founders. It is never too early to start a conversation.</p></div>
      <div className="apply-actions"><a className="primary-action" href="/apply">Start an application <Icon name="arrow-right" /></a><a className="secondary-action" href="/investment">Our investment approach <Icon name="arrow-right" /></a></div>
    </section>
  );
}

function Footer() {
  return <SiteFooter />;
}

function HomepageContinuation() {
  return <div className="site-continuation"><ProofSection /><SupportSection /><ThesisPreview /><PortfolioPreview /><NetworkSection /><PeopleProofSection /><ApplySection /><Footer /></div>;
}

const pageMeta = {
  "/team": ["01", "Team", "Built by operators.", "Backed by people who have built before.", "/assets/odra-architectural-hero.webp"],
  "/partners": ["02", "Partners", "A network built to move founders forward.", "Capital, expertise, infrastructure, and access—connected around one ambition.", "/assets/odra-founder-collaboration.png"],
  "/thesis": ["03", "Thesis", "Conviction before consensus.", "We back ambitious founders building the essential technology of the next economy.", "/assets/odra-editorial-lavender.webp"],
  "/newsroom": ["04", "Newsroom", "Ideas and progress from the companies we back.", "Portfolio updates, founder perspectives, and ecosystem intelligence.", "/assets/odra-editorial-yellow.webp"],
  "/events": ["05", "Events", "Where the ecosystem meets.", "Founder sessions, demo days, and conversations shaping what comes next.", "/assets/odra-founder-collaboration.png"],
  "/faq": ["06", "FAQ", "Questions, answered clearly.", "Everything founders need to know about applying, investing, and working with Odra Venture.", "/assets/odra-editorial-mint.webp"],
};

const plannedPageMeta = {};

function PlannedPage({ path }) {
  const [label, title, body] = plannedPageMeta[path];
  return <section className="not-found-page planned-page"><p className="kicker">{label}</p><h1>{title}</h1><p>{body}</p><div className="phase-hero-actions"><a className="primary-action" href="mailto:hello@odraventure.com">Contact Odra <Icon name="arrow-right" /></a><a className="secondary-action" href="/investment">Explore investment <Icon name="arrow-right" /></a></div></section>;
}

function PageHero({ path }) {
  const [number, label, title, body, image] = pageMeta[path];
  return <section className="internal-hero motion-reveal"><SectionLabel number={number} name={label} /><div className="internal-hero-copy"><p className="kicker">{label}</p><h1>{title}</h1><p>{body}</p></div><div className="internal-hero-image"><img src={image} alt="" /></div></section>;
}

function TeamPage() {
  return <><PageHero path="/team" /><section className="internal-section team-section"><div className="internal-heading motion-reveal"><p className="kicker">Our team</p><h2>Experience that<br />shows up.</h2></div><div className="team-grid">{team.map((person, index) => <article className="team-card motion-reveal" key={person.name}><div className="team-photo"><img src={person.image} alt={person.name} /><span>0{index + 1}</span></div><div className="team-info"><h3>{person.name}</h3><strong>{person.role}</strong><p>{person.body}</p><a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn <Icon name="arrow-up-right" /></a></div></article>)}</div></section></>;
}

function PartnersPage() {
  return <><PageHero path="/partners" /><section className="internal-section partners-section"><div className="internal-heading motion-reveal"><p className="kicker">Strategic network</p><h2>More than capital.</h2><p>A connected ecosystem of funds, accelerators, venture builders, and domain experts.</p></div><div className="partner-list">{consortiumPartners.map((partner, index) => <a className="partner-row motion-reveal" href={partner.href} target="_blank" rel="noreferrer" key={partner.name}><span>0{index + 1}</span><div><small>{partner.type}</small><h3>{partner.name}</h3><p>{partner.body}</p></div><div><strong>{partner.value}</strong><small>{partner.place}</small></div><Icon name="arrow-up-right" /></a>)}</div></section></>;
}

function ThesisPage() {
  return <><PageHero path="/thesis" /><section className="internal-section thesis-page-section"><div className="internal-heading motion-reveal"><p className="kicker">Focus areas</p><h2>Where we invest.</h2></div><div className="focus-grid">{thesisAreas.map((area, index) => <article className={`focus-card tone-${index + 1} motion-reveal`} key={area.title}><span>{area.number}</span><h3>{area.title}</h3><p>{area.body}</p><div>{area.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div><div className="criteria-block motion-reveal"><div><p className="kicker">Investment criteria</p><h2>What we look for.</h2></div><ol>{investmentCriteria.map((criterion, index) => <li key={criterion}><span>0{index + 1}</span>{criterion}</li>)}</ol></div><div className="process-block"><div className="internal-heading motion-reveal"><p className="kicker">The process</p><h2>From first hello<br />to partnership.</h2></div><div className="process-grid">{processSteps.map((step) => <article className="motion-reveal" key={step.number}><span>{step.number}</span><small>{step.meta}</small><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></div></section></>;
}

function NewsroomPage() {
  const newsImages = ["/assets/odra-editorial-yellow.webp", "/assets/portfolio/carbvault-editorial-v2.webp", "/assets/portfolio/cogstorm-editorial-v2.webp", "/assets/portfolio/gridvoltx-editorial-v2.webp", "/assets/portfolio/primvolt-editorial-v2.webp", "/assets/portfolio/socwire-editorial-v2.webp", "/assets/portfolio/solarnerve-editorial-v2.webp", "/assets/portfolio/topspots-editorial-v2.webp"];
  return <><PageHero path="/newsroom" /><section className="internal-section newsroom-section"><div className="news-grid">{news.map((item, index) => <article className="news-card motion-reveal" key={`${item.company}-${index}`}><img src={newsImages[index]} alt="" /><div><span>{item.category}</span><small>{item.read}</small></div><h2>{item.title || item.company}</h2><p>{item.body}</p><a href={item.href}>Read update <Icon name="arrow-right" /></a></article>)}</div></section></>;
}

function NewsDetailPage({ path }) {
  const item = news.find((entry) => entry.href === path);

  if (!item) return <NotFoundPage />;

  return (
    <>
      <section className="news-detail-hero motion-reveal">
        <SectionLabel number="04" name="Newsroom" />
        <div>
          <a className="text-link" href="/newsroom">← Back to newsroom</a>
          <p className="kicker">{item.category}</p>
          <h1>{item.title || item.company}</h1>
          <div className="news-detail-meta"><span>{item.company}</span><span>{item.date || item.read}</span></div>
        </div>
      </section>
      <section className="news-detail-body motion-reveal">
        <p>{item.body}</p>
        {item.focus && <div><small>Focus</small><strong>{item.focus}</strong></div>}
        <a className="primary-action" href="mailto:hello@odraventure.com">Start a conversation <Icon name="arrow-right" /></a>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="kicker">404</p>
      <h1>That page is not here.</h1>
      <p>The link may have changed. Use the navigation above or return to the homepage.</p>
      <a className="primary-action" href="/">Return home <Icon name="arrow-right" /></a>
    </section>
  );
}

function EventsPage() {
  const images = ["/assets/odra-founder-collaboration.png", "/assets/odra-editorial-lavender.webp", "/assets/odra-architectural-hero.webp", "/assets/odra-editorial-mint.webp"];
  return <><PageHero path="/events" /><section className="internal-section events-section"><div className="event-grid">{events.map((event, index) => <article className="event-card motion-reveal" key={event.number}><img src={images[index]} alt="" /><span>{event.number}</span><div><small>{event.meta}</small><h2>{event.title}</h2><p>{event.body}</p><strong>{event.audience}</strong></div></article>)}</div><div className="event-cta motion-reveal"><img src="/assets/odra-architectural-hero.webp" alt="" /><div><p className="kicker">Partnerships</p><h2>Interested in speaking or sponsoring?</h2><p>We are open to partnerships with organisations that share our commitment to early-stage technology companies in Europe.</p><a className="primary-action" href="mailto:hello@odraventure.com">Get in touch <Icon name="arrow-right" /></a></div></div></section></>;
}

function FaqPage() {
  const [openItem, setOpenItem] = useState("0-0");
  return <><PageHero path="/faq" /><section className="internal-section faq-section">{faqGroups.map((group, groupIndex) => <div className="faq-group motion-reveal" key={group.title}><div><span>0{groupIndex + 1}</span><h2>{group.title}</h2></div><div>{group.items.map(([question, answer], itemIndex) => { const id = `${groupIndex}-${itemIndex}`; const open = openItem === id; return <article className={open ? "open" : ""} key={question}><button type="button" onClick={() => setOpenItem(open ? "" : id)} aria-expanded={open}><span>{question}</span><b>{open ? "−" : "+"}</b></button><div><p>{answer}</p></div></article>; })}</div></div>)}</section></>;
}

function InternalPage({ path }) {
  const Pages = { "/team": TeamPage, "/partners": PartnersPage, "/thesis": ThesisPage, "/newsroom": NewsroomPage, "/events": EventsPage, "/faq": FaqPage };
  const Page = Pages[path];
  const content = path.startsWith("/newsroom/") ? <NewsDetailPage path={path} /> : plannedPageMeta[path] ? <PlannedPage path={path} /> : Page ? <Page /> : <NotFoundPage />;
  return <SiteShell>{content}</SiteShell>;
}

function useSmoothMotion({ homepage }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const animations = [];
    if (homepage) {
      gsap.utils.toArray(".site-continuation .motion-heading, .site-continuation .motion-card").forEach((element, index) => {
        animations.push(gsap.fromTo(element, { autoAlpha: 0, y: 36 + (index % 3) * 10 }, { autoAlpha: 1, y: 0, duration: .8, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 87%", once: true } }));
      });
    }
    const spatialSections = homepage ? gsap.utils.toArray(".continuation-section") : [];
    spatialSections.forEach((section) => {
      const foreground = section.querySelector(":scope > *:not(.section-index):not(.public-scene-index)");
      if (!foreground) return;
      const drift = gsap.fromTo(foreground, { yPercent: 5 }, { yPercent: -3, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.45 } });
      animations.push(drift);
    });
    ScrollTrigger.refresh();
    return () => {
      animations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [homepage]);
}

export function App() {
  const progress = useRef(0);
  const [webglFailed, setWebglFailed] = useState(false);
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, "") || "/");
  const homepage = path === "/";
  useSmoothMotion({ homepage });

  useEffect(() => {
    let navigationTimer;
    const readPath = () => window.location.pathname.replace(/\/+$/, "") || "/";
    const syncFromHistory = () => setPath(readPath());
    const navigate = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      const completeNavigation = () => {
        window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
        setPath(readPath());
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.classList.remove("route-leaving");
        document.documentElement.classList.add("route-arriving");
        window.setTimeout(() => document.documentElement.classList.remove("route-arriving"), 650);
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        completeNavigation();
        return;
      }
      document.documentElement.classList.add("route-leaving");
      window.clearTimeout(navigationTimer);
      navigationTimer = window.setTimeout(completeNavigation, 420);
    };
    document.addEventListener("click", navigate);
    window.addEventListener("popstate", syncFromHistory);
    return () => {
      window.clearTimeout(navigationTimer);
      document.removeEventListener("click", navigate);
      window.removeEventListener("popstate", syncFromHistory);
    };
  }, []);

  useEffect(() => {
    if (!homepage) return undefined;

    const journey = ScrollTrigger.create({
      trigger: ".journey",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
        document.documentElement.style.setProperty("--journey-progress", self.progress);
      },
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const continuationSections = gsap.utils.toArray(".continuation-section");
    const continuationJourneys = reducedMotion ? [] : continuationSections.flatMap((section, index) => {
      const cameraTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 88%",
        end: "top 12%",
        onUpdate: (self) => {
          progress.current = 1 + index + self.progress;
          document.documentElement.style.setProperty("--journey-progress", Math.min(1, (1 + index + self.progress) / 7));
        },
      });
      const entrance = gsap.fromTo(section,
        { clipPath: "inset(7% 4% round 30px)", scale: .975 },
        { clipPath: "inset(0% 0% round 0px)", scale: 1, ease: "none", scrollTrigger: { trigger: section, start: "top 88%", end: "top 12%", scrub: .62 } },
      );
      return [cameraTrigger, entrance];
    });

    const revealCards = gsap.utils.toArray(".chapter-copy");
    const reveals = revealCards.map((card, index) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card.closest(".chapter"),
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      timeline.fromTo(
        card,
        { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 28 },
        { autoAlpha: 1, y: 0, duration: 0.16, ease: "none" },
      );

      if (index < revealCards.length - 1) {
        timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.54, ease: "none" });
        timeline.to(card, { autoAlpha: 0, y: -24, duration: 0.3, ease: "none" });
      } else {
        timeline.to(card, { autoAlpha: 1, y: 0, duration: 0.84, ease: "none" });
      }

      return timeline;
    });

    ScrollTrigger.refresh();
    return () => {
      reveals.forEach((animation) => animation.kill());
      continuationJourneys.forEach((animation) => { animation.scrollTrigger?.kill(); animation.kill(); });
      journey.kill();
    };
  }, [homepage]);

  if (path === "/apply") return <Suspense fallback={<RouteLoading />}><ApplicationPage /></Suspense>;
  if (isPhaseTwoPath(path)) return <Suspense fallback={<RouteLoading />}><PhaseTwoRoutes path={path} /></Suspense>;
  if (isPublicPath(path)) return <Suspense fallback={<RouteLoading />}><PublicRoutes path={path} /></Suspense>;
  if (isSchoolPath(path)) return <Suspense fallback={<RouteLoading />}><SchoolRoutes path={path} /></Suspense>;
  if (!homepage) return <InternalPage path={path} />;

  return (
    <main className="prototype-shell" id="main-content">
      <SkipLink />
      <Header />
      <div className="scene-layer" aria-hidden="true">
        <div className="scene-poster" />
        {!webglFailed ? (
          <SceneErrorBoundary onError={() => setWebglFailed(true)}>
            <Canvas
              shadows
              dpr={[1, 1.7]}
              camera={{ position: cameraKeys[0].position, fov: 42, near: 0.1, far: 100 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.setClearColor(palette.cream, 0);
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.12;
              }}
              onError={() => setWebglFailed(true)}
            ><Scene progress={progress} /></Canvas>
          </SceneErrorBoundary>
        ) : null}
      </div>
      <div className="journey"><AppContent /></div>
      <HomepageContinuation />
    </main>
  );
}
