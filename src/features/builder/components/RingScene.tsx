"use client";

import { memo, useMemo, useRef } from "react";
import { GemstoneMesh } from "@/features/builder/components/GemstoneMesh";
import { RingModel } from "@/features/builder/components/RingModel";
import { ShowcaseCamera } from "@/features/builder/components/ShowcaseCamera";
import {
  HERO_TILT,
  SHOWCASE_POSITION,
  SHOWCASE_SCALE,
  STAND_ROTATION,
} from "@/features/builder/geometry/ring-showcase";
import type { RingBuilderConfig } from "@/features/builder/types";
import { getMetalPreset, getStonePreset } from "@/features/builder/constants";
import type * as THREE from "three";

export type RingSceneConfig = Pick<
  RingBuilderConfig,
  | "metal"
  | "stone"
  | "stoneEnabled"
  | "stoneSize"
  | "bandStyle"
  | "bandWidth"
  | "stoneShape"
  | "haloStyle"
  | "prongStyle"
  | "sideStoneStyle"
  | "engraving"
  | "engravingAngle"
  | "engravingFace"
  | "accentStones"
>;

interface RingSceneProps {
  config: RingSceneConfig;
}

function configsEqual(a: RingSceneConfig, b: RingSceneConfig): boolean {
  return (
    a.metal === b.metal &&
    a.stone === b.stone &&
    a.stoneEnabled === b.stoneEnabled &&
    a.stoneSize === b.stoneSize &&
    a.bandStyle === b.bandStyle &&
    a.bandWidth === b.bandWidth &&
    a.stoneShape === b.stoneShape &&
    a.haloStyle === b.haloStyle &&
    a.prongStyle === b.prongStyle &&
    a.sideStoneStyle === b.sideStoneStyle &&
    a.engraving === b.engraving &&
    a.engravingAngle === b.engravingAngle &&
    a.engravingFace === b.engravingFace &&
    a.accentStones === b.accentStones
  );
}

function propsEqual(prev: RingSceneProps, next: RingSceneProps): boolean {
  return configsEqual(prev.config, next.config);
}

export const RingScene = memo(function RingScene({ config }: RingSceneProps) {
  const showcaseRef = useRef<THREE.Group>(null);
  const metal = useMemo(() => getMetalPreset(config.metal), [config.metal]);
  const stone = useMemo(() => getStonePreset(config.stone), [config.stone]);

  const stoneSlot = useMemo(
    () => (
      <GemstoneMesh stone={stone} stoneShape={config.stoneShape} stoneSize={config.stoneSize} />
    ),
    [stone, config.stoneShape, config.stoneSize],
  );

  return (
    <>
      <group ref={showcaseRef} rotation={HERO_TILT} position={SHOWCASE_POSITION} scale={SHOWCASE_SCALE}>
        <group rotation={STAND_ROTATION}>
          <RingModel
            metal={metal}
            bandStyle={config.bandStyle}
            bandWidth={config.bandWidth}
            stoneEnabled={config.stoneEnabled}
            stone={stone}
            stoneShape={config.stoneShape}
            stoneSize={config.stoneSize}
            haloStyle={config.haloStyle}
            prongStyle={config.prongStyle}
            sideStoneStyle={config.sideStoneStyle}
            engraving={config.engraving}
            engravingAngle={config.engravingAngle}
            engravingFace={config.engravingFace}
            accentStones={config.accentStones}
            stoneSlot={stoneSlot}
          />
        </group>
      </group>

      <ShowcaseCamera
        targetRef={showcaseRef}
        stoneSize={config.stoneSize}
        stoneEnabled={config.stoneEnabled}
        bandStyle={config.bandStyle}
        bandWidth={config.bandWidth}
        haloStyle={config.haloStyle}
        prongStyle={config.prongStyle}
        sideStoneStyle={config.sideStoneStyle}
        stoneShape={config.stoneShape}
      />
    </>
  );
}, propsEqual);

export function pickRingSceneConfig(config: RingBuilderConfig): RingSceneConfig {
  return {
    metal: config.metal,
    stone: config.stone,
    stoneEnabled: config.stoneEnabled,
    stoneSize: config.stoneSize,
    bandStyle: config.bandStyle,
    bandWidth: config.bandWidth,
    stoneShape: config.stoneShape,
    haloStyle: config.haloStyle,
    prongStyle: config.prongStyle,
    sideStoneStyle: config.sideStoneStyle,
    engraving: config.engraving,
    engravingAngle: config.engravingAngle,
    engravingFace: config.engravingFace,
    accentStones: config.accentStones,
  };
}
