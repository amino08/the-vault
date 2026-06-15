"use client";

import { memo, useMemo } from "react";
import * as THREE from "three";

interface LuxuryMetalMaterialProps {
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity?: number;
}

export const LuxuryMetalMaterial = memo(function LuxuryMetalMaterial({
  color,
  metalness,
  roughness,
  envMapIntensity = 2.1,
}: LuxuryMetalMaterialProps) {
  const sheenColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={envMapIntensity}
      clearcoat={0.12}
      clearcoatRoughness={0.18}
      reflectivity={1}
      sheen={0.35}
      sheenRoughness={0.45}
      sheenColor={sheenColor}
    />
  );
});

interface LuxuryGemMaterialProps {
  color: string;
  emissive?: string;
  metalness: number;
  roughness: number;
  transmission?: number;
  isDiamond?: boolean;
}

export const LuxuryGemMaterial = memo(function LuxuryGemMaterial({
  color,
  emissive,
  metalness,
  roughness,
  transmission = 0,
  isDiamond = false,
}: LuxuryGemMaterialProps) {
  const attenuationColor = useMemo(() => new THREE.Color(color), [color]);
  const specularColor = useMemo(() => new THREE.Color("#ffffff"), []);

  return (
    <meshPhysicalMaterial
      color={color}
      emissive={emissive ?? color}
      emissiveIntensity={isDiamond ? 0.04 : emissive ? 0.22 : 0.08}
      metalness={metalness}
      roughness={roughness}
      transmission={transmission}
      thickness={0.65}
      ior={isDiamond ? 2.417 : 1.77}
      clearcoat={1}
      clearcoatRoughness={0.015}
      envMapIntensity={isDiamond ? 2.6 : 2.1}
      reflectivity={1}
      attenuationColor={attenuationColor}
      attenuationDistance={isDiamond ? 0.8 : 0.35}
      specularIntensity={1.2}
      specularColor={specularColor}
    />
  );
});
