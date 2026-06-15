"use client";

import { memo } from "react";
import { ContactShadows, Environment } from "@react-three/drei";

/** Stable studio lighting — no reflector pass, single shadow caster, memoized. */
export const StudioEnvironment = memo(function StudioEnvironment() {
  return (
    <>
      <color attach="background" args={["#070707"]} />

      <Environment preset="studio" background={false} environmentIntensity={1.2} />

      <ambientLight intensity={0.45} color="#fff6eb" />
      <hemisphereLight args={["#fff0dc", "#0a0a0a", 0.35]} />

      <directionalLight
        position={[4.5, 8, 5]}
        intensity={2.2}
        color="#fff9f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={16}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />

      <directionalLight position={[-5, 3.5, 2.5]} intensity={0.75} color="#C9A962" />
      <directionalLight position={[1.5, 1, 4]} intensity={0.4} color="#dce4ef" />
      <directionalLight position={[-1, 2.5, -6]} intensity={0.95} color="#ffffff" />
      <pointLight position={[3, 1.5, -2]} intensity={0.5} color="#C9A962" distance={10} decay={2} />

      <spotLight
        position={[0.3, 6.5, 1.2]}
        angle={0.38}
        penumbra={1}
        intensity={1.6}
        color="#fffef5"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#050505" roughness={0.96} metalness={0.08} />
      </mesh>

      <ContactShadows
        position={[0, -1.04, 0]}
        opacity={0.32}
        scale={6}
        blur={2.5}
        far={2.5}
        resolution={512}
        frames={1}
        color="#000000"
      />
    </>
  );
});
