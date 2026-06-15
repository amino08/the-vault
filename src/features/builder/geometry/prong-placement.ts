import { SETTING_STONE_Z } from "@/features/builder/geometry/ring-constants";
import type { ProngStyleId, StoneShapeId } from "@/features/builder/types";

const BASE_GEM_SIZE = 0.095;
const BASE_GRIP_RADIUS = 0.072;

export interface ProngLayout {
  position: [number, number, number];
  rotation: [number, number, number];
}

function getGirdleRadius(stoneShape: StoneShapeId): number {
  switch (stoneShape) {
    case "oval":
      return BASE_GEM_SIZE * 0.78 * 1.12;
    case "cushion":
      return BASE_GEM_SIZE * 0.76 * 1.08;
    case "emerald_cut":
      return BASE_GEM_SIZE * 0.52;
    case "radiant":
      return BASE_GEM_SIZE * 0.82;
    case "pear":
      return BASE_GEM_SIZE * 0.48;
    case "marquise":
      return BASE_GEM_SIZE * 0.72 * 1.55;
    case "princess":
      return BASE_GEM_SIZE * 0.65;
    case "asscher":
      return BASE_GEM_SIZE * 0.78;
    case "round_brilliant":
    default:
      return BASE_GEM_SIZE * 0.78;
  }
}

export function getSettingGripRadius(stoneShape: StoneShapeId, stoneSize: number): number {
  return getGirdleRadius(stoneShape) * stoneSize * (BASE_GRIP_RADIUS / (BASE_GEM_SIZE * 0.78));
}

function prongRotation(x: number, y: number): [number, number, number] {
  const tilt = 0.55;
  return [y >= 0 ? tilt : -tilt, 0, x >= 0 ? (y >= 0 ? tilt : -tilt) : y >= 0 ? -tilt : tilt];
}

function cornerProngs(radius: number, z: number): ProngLayout[] {
  return [
    { position: [radius, radius, z], rotation: prongRotation(radius, radius) },
    { position: [-radius, radius, z], rotation: prongRotation(-radius, radius) },
    { position: [radius, -radius, z], rotation: prongRotation(radius, -radius) },
    { position: [-radius, -radius, z], rotation: prongRotation(-radius, -radius) },
  ];
}

function ringProngs(count: number, radius: number, z: number): ProngLayout[] {
  const prongs: ProngLayout[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const y = Math.cos(angle) * radius;
    prongs.push({ position: [x, y, z], rotation: prongRotation(x, y) });
  }
  return prongs;
}

export function getProngLayouts(
  prongStyle: ProngStyleId,
  stoneShape: StoneShapeId,
  stoneSize: number,
): ProngLayout[] {
  if (prongStyle === "bezel" || prongStyle === "basket") return [];

  const radius = getSettingGripRadius(stoneShape, stoneSize);
  const z = SETTING_STONE_Z;

  if (prongStyle === "six_prong") {
    return ringProngs(6, radius, z);
  }

  if (prongStyle === "double_prong") {
    const prongs: ProngLayout[] = [];
    const offset = 0.012;
    for (const base of cornerProngs(radius, z)) {
      const [x, y] = base.position;
      const nx = x / radius;
      const ny = y / radius;
      prongs.push(base);
      prongs.push({
        position: [x + nx * offset, y + ny * offset, z],
        rotation: base.rotation,
      });
    }
    return prongs;
  }

  return cornerProngs(radius, z);
}

export function getBezelRadius(stoneShape: StoneShapeId, stoneSize: number): number {
  return getSettingGripRadius(stoneShape, stoneSize) * 1.06;
}
