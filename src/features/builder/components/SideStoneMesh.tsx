"use client";

import { useMemo } from "react";
import { LuxuryGemMaterial } from "@/features/builder/components/LuxuryMaterials";
import { createSideStoneGeometry } from "@/features/builder/geometry/gemstone-geometry";
import { getSideStoneLayouts } from "@/features/builder/geometry/side-stone-placement";
import { GEM_TABLE_ROTATION } from "@/features/builder/geometry/ring-showcase";
import type { StonePreset } from "@/features/builder/constants";
import type { SideStoneStyleId, StoneShapeId } from "@/features/builder/types";

interface SideStoneMeshProps {
  sideStoneStyle: SideStoneStyleId;
  centerStoneShape: StoneShapeId;
  centerStoneSize: number;
  stone: StonePreset;
}

export function SideStoneMesh({
  sideStoneStyle,
  centerStoneShape,
  centerStoneSize,
  stone,
}: SideStoneMeshProps) {
  const layouts = useMemo(
    () => getSideStoneLayouts(sideStoneStyle, centerStoneShape, centerStoneSize),
    [sideStoneStyle, centerStoneShape, centerStoneSize],
  );

  const geometries = useMemo(() => {
    const cache = new Map<string, ReturnType<typeof createSideStoneGeometry>>();
    return layouts.map((layout) => {
      const key = `${layout.shape}-${layout.scale.toFixed(3)}`;
      if (!cache.has(key)) {
        cache.set(key, createSideStoneGeometry(layout.shape, 0.095 * layout.scale));
      }
      return cache.get(key)!;
    });
  }, [layouts]);

  if (layouts.length === 0) return null;

  const isDiamond = stone.id === "diamond" || stone.id === "black_diamond";

  return (
    <>
      {layouts.map((layout, index) => (
        <mesh
          key={`side-stone-${index}`}
          geometry={geometries[index]}
          position={layout.position}
          rotation={[
            GEM_TABLE_ROTATION[0] + layout.rotation[0],
            GEM_TABLE_ROTATION[1] + layout.rotation[1],
            GEM_TABLE_ROTATION[2] + layout.rotation[2],
          ]}
          castShadow
          renderOrder={4}
        >
          <LuxuryGemMaterial
            color={stone.color}
            emissive={stone.emissive}
            metalness={stone.metalness}
            roughness={Math.max(stone.roughness - 0.02, 0.01)}
            transmission={stone.transmission ?? 0}
            isDiamond={isDiamond}
          />
        </mesh>
      ))}
    </>
  );
}
