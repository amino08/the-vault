"use client";

import { LuxuryMetalMaterial } from "@/features/builder/components/LuxuryMaterials";
import {
  getBezelRadius,
  getProngLayouts,
  type ProngLayout,
} from "@/features/builder/geometry/prong-placement";
import { SETTING_STONE_Z } from "@/features/builder/geometry/ring-constants";
import type { MetalPreset } from "@/features/builder/constants";
import type { ProngStyleId, StoneShapeId } from "@/features/builder/types";

interface SettingProngsProps {
  prongStyle: ProngStyleId;
  stoneShape: StoneShapeId;
  stoneSize: number;
  metal: MetalPreset;
}

function Prong({
  layout,
  metal,
  slim = false,
}: {
  layout: ProngLayout;
  metal: MetalPreset;
  slim?: boolean;
}) {
  const shaft = slim ? 0.008 : 0.011;
  const tip = slim ? 0.01 : 0.014;

  return (
    <group position={layout.position} rotation={layout.rotation}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[shaft, shaft + 0.004, slim ? 0.085 : 0.1, 12]} />
        <LuxuryMetalMaterial
          color={metal.color}
          metalness={metal.metalness}
          roughness={metal.roughness}
        />
      </mesh>
      <mesh position={[0, 0, 0.05]} castShadow>
        <sphereGeometry args={[tip, 12, 12]} />
        <LuxuryMetalMaterial
          color={metal.color}
          metalness={metal.metalness}
          roughness={Math.max(metal.roughness - 0.02, 0.04)}
        />
      </mesh>
    </group>
  );
}

export function SettingProngs({ prongStyle, stoneShape, stoneSize, metal }: SettingProngsProps) {
  const metalProps = {
    color: metal.color,
    metalness: metal.metalness,
    roughness: Math.max(metal.roughness - 0.02, 0.035),
  };

  const prongs = getProngLayouts(prongStyle, stoneShape, stoneSize);
  const bezelRadius = getBezelRadius(stoneShape, stoneSize);

  if (prongStyle === "bezel") {
    return (
      <>
        <mesh castShadow position={[0, 0, 0.024]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[bezelRadius * 0.92, bezelRadius, 0.028, 32]} />
          <LuxuryMetalMaterial {...metalProps} />
        </mesh>
        <mesh castShadow position={[0, 0, SETTING_STONE_Z + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[bezelRadius, 0.007, 12, 48]} />
          <LuxuryMetalMaterial {...metalProps} envMapIntensity={2.3} />
        </mesh>
      </>
    );
  }

  if (prongStyle === "basket") {
    return (
      <>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
          <mesh
            key={angle}
            castShadow
            position={[Math.sin(angle) * 0.06, Math.cos(angle) * 0.06, 0.02]}
            rotation={[Math.PI / 2, angle, 0]}
          >
            <cylinderGeometry args={[0.004, 0.005, 0.07, 10]} />
            <LuxuryMetalMaterial {...metalProps} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.062, 0.004, 10, 40]} />
          <LuxuryMetalMaterial {...metalProps} envMapIntensity={2.2} />
        </mesh>
        <mesh castShadow position={[0, 0, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.003, 10, 32]} />
          <LuxuryMetalMaterial {...metalProps} envMapIntensity={2.1} />
        </mesh>
      </>
    );
  }

  return (
    <>
      {prongs.map((layout, index) => (
        <Prong
          key={`prong-${index}`}
          layout={layout}
          metal={metal}
          slim={prongStyle === "double_prong"}
        />
      ))}
    </>
  );
}
