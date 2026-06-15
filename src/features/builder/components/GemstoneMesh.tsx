"use client";

import { memo, useMemo } from "react";
import { LuxuryGemMaterial } from "@/features/builder/components/LuxuryMaterials";
import { createGemstoneGeometry } from "@/features/builder/geometry/gemstone-geometry";
import { SETTING_STONE_Z } from "@/features/builder/geometry/ring-constants";
import { GEM_TABLE_ROTATION } from "@/features/builder/geometry/ring-showcase";
import type { StonePreset } from "@/features/builder/constants";
import type { StoneShapeId } from "@/features/builder/types";

interface GemstoneMeshProps {
  stone: StonePreset;
  stoneShape: StoneShapeId;
  stoneSize: number;
}

export const GemstoneMesh = memo(function GemstoneMesh({
  stone,
  stoneShape,
  stoneSize,
}: GemstoneMeshProps) {
  const geometry = useMemo(() => createGemstoneGeometry(stoneShape, 0.095), [stoneShape]);
  const isDiamond = stone.id === "diamond" || stone.id === "black_diamond";

  return (
    <group position={[0, 0, SETTING_STONE_Z]}>
      <mesh
        geometry={geometry}
        castShadow
        rotation={GEM_TABLE_ROTATION}
        scale={stoneSize}
        renderOrder={10}
      >
        <LuxuryGemMaterial
          color={stone.color}
          emissive={stone.emissive}
          metalness={stone.metalness}
          roughness={Math.max(stone.roughness - 0.03, 0.01)}
          transmission={stone.transmission ?? 0}
          isDiamond={isDiamond}
        />
      </mesh>
    </group>
  );
});
