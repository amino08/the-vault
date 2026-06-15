"use client";

import { useMemo } from "react";
import { LuxuryGemMaterial } from "@/features/builder/components/LuxuryMaterials";
import { getHaloStoneLayout } from "@/features/builder/geometry/halo-placement";
import type { StonePreset } from "@/features/builder/constants";
import type { HaloStyleId, StoneShapeId } from "@/features/builder/types";

interface HaloMeshProps {
  haloStyle: HaloStyleId;
  stoneShape: StoneShapeId;
  stoneSize: number;
  stone: StonePreset;
}

export function HaloMesh({ haloStyle, stoneShape, stoneSize, stone }: HaloMeshProps) {
  const layout = useMemo(
    () => getHaloStoneLayout(haloStyle, stoneShape, stoneSize),
    [haloStyle, stoneShape, stoneSize],
  );

  if (layout.length === 0) return null;

  const isDiamond = stone.id === "diamond" || stone.id === "black_diamond";

  return (
    <>
      {layout.map((haloStone, index) => (
        <mesh key={`halo-${index}`} position={haloStone.position} castShadow renderOrder={6}>
          <octahedronGeometry args={[haloStone.size, 0]} />
          <LuxuryGemMaterial
            color={stone.color}
            emissive={stone.emissive}
            metalness={stone.metalness}
            roughness={Math.max(stone.roughness - 0.01, 0.01)}
            transmission={stone.transmission ?? 0}
            isDiamond={isDiamond}
          />
        </mesh>
      ))}
    </>
  );
}
