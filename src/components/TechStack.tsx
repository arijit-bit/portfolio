import * as THREE from "three";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));
const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  position: [number, number, number];
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

const SphereGeo = memo(function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  position,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;

    const safeDelta = Math.min(0.08, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiplyScalar(-42 * safeDelta * scale);
    impulse.y *= 3;

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.8}
      angularDamping={0.18}
      friction={0.2}
      position={position}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh scale={scale} geometry={sphereGeometry} material={material} rotation={[0.3, 1, 1]} />
    </RigidBody>
  );
});

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

const Pointer = memo(function Pointer({
  vec = new THREE.Vector3(),
  isActive,
}: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;

    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.18
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
});

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const isMobile = useMemo(() => window.innerWidth <= 900, []);

  const materials = useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });

    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.22,
          metalness: 0.35,
          roughness: 1,
          clearcoat: 0.05,
        })
    );
  }, []);

  const spheres = useMemo(() => {
    const spread = isMobile ? 14 : 18;
    const total = isMobile ? 12 : 18;

    return [...Array(total)].map((_, index) => ({
      scale: [0.7, 1, 0.8, 1, 1][index % 5],
      material: materials[index % materials.length],
      position: [
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloatSpread(spread) - 12,
        THREE.MathUtils.randFloatSpread(spread) - 8,
      ] as [number, number, number],
    }));
  }, [isMobile, materials]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    setShouldRender((prev) => prev || entry.isIntersecting);
    setIsActive(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "240px 0px",
      threshold: 0.15,
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2> My Techstack</h2>

      {shouldRender && (
        <Canvas
          dpr={[1, isMobile ? 1 : 1.5]}
          frameloop={isActive ? "always" : "demand"}
          gl={{
            alpha: true,
            stencil: false,
            depth: false,
            antialias: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => {
            state.gl.toneMappingExposure = 1.2;
          }}
          performance={{ min: 0.6 }}
          className="tech-canvas"
          style={{ position: "relative", zIndex: 2 }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[0, 5, -4]} intensity={1.65} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo key={i} {...props} isActive={isActive} />
            ))}
          </Physics>
        </Canvas>
      )}
    </div>
  );
};

export default TechStack;
