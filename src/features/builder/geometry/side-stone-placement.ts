import { SETTING_STONE_Z } from "@/features/builder/geometry/ring-constants";
import type { SideStoneStyleId, StoneShapeId } from "@/features/builder/types";

const BASE_GEM_SIZE = 0.095;

export type SideStoneGemShape = "round" | "baguette" | "pear" | "trillion";

export interface SideStoneLayout {
  position: [number, number, number];
  /** Extra rotation applied after GEM_TABLE_ROTATION. */
  rotation: [number, number, number];
  /** Scale multiplier on base gem size (0.095). */
  scale: number;
  shape: SideStoneGemShape;
}

function getCenterGirdleRadius(stoneShape: StoneShapeId): number {
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

function sideStoneRadius(style: SideStoneStyleId, centerStoneSize: number): number {
  const base =
    style === "three_stone_ring"
      ? BASE_GEM_SIZE * 0.62
      : style === "tapered_baguettes"
        ? BASE_GEM_SIZE * 0.38
        : style === "pear_side_stones"
          ? BASE_GEM_SIZE * 0.52
          : style === "trillion_side_stones"
            ? BASE_GEM_SIZE * 0.48
            : BASE_GEM_SIZE * 0.54;

  return base * centerStoneSize;
}

function flankOffset(
  style: SideStoneStyleId,
  centerShape: StoneShapeId,
  centerSize: number,
): number {
  const centerRadius = getCenterGirdleRadius(centerShape) * centerSize;
  const sideRadius = sideStoneRadius(style, centerSize);
  const gap = 0.012 * centerSize;
  return centerRadius + sideRadius + gap;
}

function pairLayouts(
  style: SideStoneStyleId,
  centerShape: StoneShapeId,
  centerSize: number,
  shape: SideStoneGemShape,
  scaleFactor: number,
  z = SETTING_STONE_Z,
  rotation: [number, number, number] = [0, 0, 0],
): SideStoneLayout[] {
  const offset = flankOffset(style, centerShape, centerSize);
  const scale = (sideStoneRadius(style, centerSize) / BASE_GEM_SIZE) * scaleFactor;

  return [
    { position: [-offset, 0, z], rotation, scale, shape },
    { position: [offset, 0, z], rotation, scale, shape },
  ];
}

export function getSideStoneLayouts(
  sideStoneStyle: SideStoneStyleId,
  centerStoneShape: StoneShapeId,
  centerStoneSize: number,
): SideStoneLayout[] {
  if (sideStoneStyle === "none") return [];

  switch (sideStoneStyle) {
    case "two_side_stones":
      return pairLayouts(sideStoneStyle, centerStoneShape, centerStoneSize, "round", 1);

    case "three_stone_ring":
      return pairLayouts(sideStoneStyle, centerStoneShape, centerStoneSize, "round", 1);

    case "tapered_baguettes":
      return pairLayouts(
        sideStoneStyle,
        centerStoneShape,
        centerStoneSize,
        "baguette",
        1,
        SETTING_STONE_Z - 0.004,
        [0, Math.PI / 2, 0],
      );

    case "pear_side_stones": {
      const offset = flankOffset(sideStoneStyle, centerStoneShape, centerStoneSize);
      const scale = sideStoneRadius(sideStoneStyle, centerStoneSize) / BASE_GEM_SIZE;
      return [
        {
          position: [-offset, 0, SETTING_STONE_Z],
          rotation: [0, 0, Math.PI / 2],
          scale,
          shape: "pear",
        },
        {
          position: [offset, 0, SETTING_STONE_Z],
          rotation: [0, 0, -Math.PI / 2],
          scale,
          shape: "pear",
        },
      ];
    }

    case "trillion_side_stones":
      return pairLayouts(
        sideStoneStyle,
        centerStoneShape,
        centerStoneSize,
        "trillion",
        1,
        SETTING_STONE_Z - 0.002,
      );

    default:
      return [];
  }
}
