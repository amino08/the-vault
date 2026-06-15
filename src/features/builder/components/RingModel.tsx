"use client";

import { memo, useMemo, type ReactNode } from "react";
import { LuxuryMetalMaterial, LuxuryGemMaterial } from "@/features/builder/components/LuxuryMaterials";
import { EngravingMesh } from "@/features/builder/components/EngravingMesh";
import { HaloMesh } from "@/features/builder/components/HaloMesh";
import { SettingProngs } from "@/features/builder/components/SettingProngs";
import { SideStoneMesh } from "@/features/builder/components/SideStoneMesh";
import {
  createBandGeometry,
  getHalfEternityStonePositions,
  getPaveStonePositions,
} from "@/features/builder/geometry/band-styles";
import {
  SETTING_MOUNT,
  createShoulderGeometry,
} from "@/features/builder/geometry/ring-geometry";
import { getStonePreset, type MetalPreset, type StonePreset } from "@/features/builder/constants";
import { getAccentStoneTransform, ACCENT_STONE_RENDER_SIZE } from "@/features/builder/geometry/accent-stone-placement";
import type {
  AccentStonePlacement,
  BandStyleId,
  BandWidthMm,
  EngravingFace,
  HaloStyleId,
  ProngStyleId,
  SideStoneStyleId,
  StoneId,
  StoneShapeId,
} from "@/features/builder/types";

interface RingModelProps {
  metal: MetalPreset;
  bandStyle: BandStyleId;
  bandWidth: BandWidthMm;
  stoneEnabled: boolean;
  stone: StonePreset;
  stoneShape: StoneShapeId;
  stoneSize: number;
  haloStyle: HaloStyleId;
  prongStyle: ProngStyleId;
  sideStoneStyle: SideStoneStyleId;
  stoneSlot: ReactNode;
  engraving?: string;
  engravingAngle?: number;
  engravingFace?: EngravingFace;
  accentStones?: AccentStonePlacement[];
}

function AccentStone({
  position,
  stoneId,
  size = ACCENT_STONE_RENDER_SIZE,
}: {
  position: [number, number, number];
  stoneId: StoneId;
  size?: number;
}) {
  const preset = getStonePreset(stoneId);
  const isDiamond = stoneId === "diamond" || stoneId === "black_diamond";
  return (
    <mesh position={position} castShadow renderOrder={5}>
      <octahedronGeometry args={[size, 0]} />
      <LuxuryGemMaterial
        color={preset.color}
        emissive={preset.emissive}
        metalness={preset.metalness}
        roughness={Math.max(preset.roughness - 0.01, 0.01)}
        transmission={preset.transmission ?? 0}
        isDiamond={isDiamond}
      />
    </mesh>
  );
}

function CathedralArcs({ metal }: { metal: MetalPreset }) {
  const metalProps = {
    color: metal.color,
    metalness: metal.metalness,
    roughness: Math.max(metal.roughness - 0.02, 0.035),
  };

  return (
    <>
      {[ -0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0, 0.018]} rotation={[0.55, 0, x > 0 ? -0.35 : 0.35]} castShadow>
          <boxGeometry args={[0.014, 0.11, 0.1]} />
          <LuxuryMetalMaterial {...metalProps} />
        </mesh>
      ))}
    </>
  );
}

export const RingModel = memo(function RingModel({
  metal,
  bandStyle,
  bandWidth,
  stoneEnabled,
  stone,
  stoneShape,
  stoneSize,
  haloStyle,
  prongStyle,
  sideStoneStyle,
  stoneSlot,
  engraving,
  engravingAngle = 180,
  engravingFace = "inside",
  accentStones = [],
}: RingModelProps) {
  const bandData = useMemo(() => createBandGeometry(bandStyle, bandWidth), [bandStyle, bandWidth]);
  const shoulderGeometry = useMemo(() => createShoulderGeometry(), []);
  const halfEternityPositions = useMemo(() => getHalfEternityStonePositions(), []);
  const pavePositions = useMemo(() => getPaveStonePositions(), []);

  const metalProps = {
    color: metal.color,
    metalness: metal.metalness,
    roughness: Math.max(metal.roughness - 0.02, 0.035),
  };

  return (
    <group>
      {bandData.bands.map((geometry, index) => {
        const transform = bandData.bandTransforms?.[index];
        return (
          <mesh
            key={`band-${index}`}
            geometry={geometry}
            position={transform?.position ?? [0, 0, 0]}
            rotation={transform?.rotation ?? [0, 0, 0]}
            castShadow
            receiveShadow
          >
            <LuxuryMetalMaterial {...metalProps} />
          </mesh>
        );
      })}

      {bandStyle === "half_eternity" &&
        halfEternityPositions.map((pos, i) => (
          <AccentStone key={`eternity-${i}`} position={pos} stoneId="diamond" size={0.011} />
        ))}

      {bandStyle === "pave_band" &&
        pavePositions.map((pos, i) => (
          <AccentStone key={`pave-${i}`} position={pos} stoneId="diamond" size={0.007} />
        ))}

      {engraving?.trim() && (
        <EngravingMesh text={engraving} angle={engravingAngle} face={engravingFace} />
      )}

      {accentStones.map((placement) => {
        const { position } = getAccentStoneTransform(placement.angle);
        return (
          <AccentStone
            key={placement.id}
            position={position}
            stoneId={placement.stone}
          />
        );
      })}

      {stoneEnabled && (
        <group position={SETTING_MOUNT}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
            <mesh
              key={angle}
              geometry={shoulderGeometry}
              rotation={[Math.PI / 2, angle, 0]}
              position={[Math.sin(angle) * 0.055, Math.cos(angle) * 0.055, 0.004]}
              castShadow
            >
              <LuxuryMetalMaterial {...metalProps} />
            </mesh>
          ))}

          {bandStyle === "cathedral" && <CathedralArcs metal={metal} />}

          <mesh castShadow position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.088, 0.1, 0.034, 32]} />
            <LuxuryMetalMaterial {...metalProps} />
          </mesh>

          <mesh
            castShadow
            position={[0, 0, 0.028]}
            rotation={[Math.PI / 2, 0, 0]}
            renderOrder={1}
          >
            <torusGeometry args={[0.082, 0.006, 12, 48]} />
            <LuxuryMetalMaterial {...metalProps} envMapIntensity={2.4} />
          </mesh>

          <mesh castShadow position={[0, 0, 0.039]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.072, 0.078, 0.012, 32]} />
            <LuxuryMetalMaterial {...metalProps} />
          </mesh>

          {haloStyle !== "none" && (
            <HaloMesh
              haloStyle={haloStyle}
              stoneShape={stoneShape}
              stoneSize={stoneSize}
              stone={stone}
            />
          )}

          <SideStoneMesh
            sideStoneStyle={sideStoneStyle}
            centerStoneShape={stoneShape}
            centerStoneSize={stoneSize}
            stone={stone}
          />

          {stoneSlot}

          <SettingProngs
            prongStyle={prongStyle}
            stoneShape={stoneShape}
            stoneSize={stoneSize}
            metal={metal}
          />
        </group>
      )}
    </group>
  );
});
