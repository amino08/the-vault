import { SETTING_STONE_Z } from "@/features/builder/geometry/ring-constants";
import type { HaloStyleId, StoneShapeId } from "@/features/builder/types";

const BASE_GEM_SIZE = 0.095;
const HALO_STONE_COUNT = 14;

/** Approximate girdle radius in setting-local units before stoneSize scale. */
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

export interface HaloStoneLayout {
  position: [number, number, number];
  size: number;
}

export function getHaloStoneLayout(
  haloStyle: HaloStyleId,
  stoneShape: StoneShapeId,
  stoneSize: number,
): HaloStoneLayout[] {
  if (haloStyle === "none") return [];

  const girdleRadius = getGirdleRadius(stoneShape) * stoneSize;
  const isClassic = haloStyle === "classic";

  const ringRadius = girdleRadius * (isClassic ? 1.18 : 1.06);
  const z = SETTING_STONE_Z + (isClassic ? 0.012 : -0.018);
  const stoneRadius = isClassic ? 0.009 : 0.008;

  const stones: HaloStoneLayout[] = [];
  for (let i = 0; i < HALO_STONE_COUNT; i++) {
    const angle = (i / HALO_STONE_COUNT) * Math.PI * 2;
    stones.push({
      position: [Math.sin(angle) * ringRadius, Math.cos(angle) * ringRadius, z],
      size: stoneRadius,
    });
  }

  return stones;
}

export function getHaloStyleLabel(haloStyle: HaloStyleId): string {
  switch (haloStyle) {
    case "classic":
      return "Classic Halo";
    case "hidden":
      return "Hidden Halo";
    case "none":
    default:
      return "No Halo";
  }
}
