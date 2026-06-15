"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

function PlaceholderMesh() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <torusGeometry args={[1, 0.35, 32, 64]} />
      <meshStandardMaterial color="#C9A962" metalness={0.9} roughness={0.15} />
    </mesh>
  );
}

export function CanvasPlaceholder() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="aspect-square w-full bg-vault-black">
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <PlaceholderMesh />
      <OrbitControls enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  );
}
