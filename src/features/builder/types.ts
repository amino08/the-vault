import type { BandWidthMm } from "@/features/builder/geometry/band-width";
import { DEFAULT_BAND_WIDTH_MM } from "@/features/builder/geometry/band-width";

export { BAND_WIDTH_MM_OPTIONS, DEFAULT_BAND_WIDTH_MM, type BandWidthMm } from "@/features/builder/geometry/band-width";
export {
  formatBandWidth,
  isValidBandWidthMm,
  resolveBandWidthMm,
} from "@/features/builder/geometry/band-width";

export type MetalId = "yellow_gold" | "white_gold" | "rose_gold" | "platinum";

export type StoneId = "diamond" | "sapphire" | "ruby" | "emerald" | "black_diamond";

export type BandStyleId =
  | "classic_solitaire"
  | "cathedral"
  | "knife_edge"
  | "comfort_fit"
  | "half_eternity"
  | "split_shank"
  | "twisted_band"
  | "pave_band";

export type StoneShapeId =
  | "round_brilliant"
  | "oval"
  | "cushion"
  | "emerald_cut"
  | "radiant"
  | "pear"
  | "marquise"
  | "princess"
  | "asscher";

export type EngravingFace = "inside" | "outside";

export type HaloStyleId = "none" | "classic" | "hidden";

export type ProngStyleId = "four_prong" | "six_prong" | "double_prong" | "bezel" | "basket";

export type SideStoneStyleId =
  | "none"
  | "two_side_stones"
  | "three_stone_ring"
  | "tapered_baguettes"
  | "pear_side_stones"
  | "trillion_side_stones";

/** User-placed accent stone on the band (outside crown). */
export interface AccentStonePlacement {
  id: string;
  stone: StoneId;
  /** Degrees from 12 o'clock (crown), clockwise. */
  angle: number;
}

export const ACCENT_STONE_MAX = 6;

export const RING_SIZE_MIN = 4;
export const RING_SIZE_MAX = 14;
export const RING_SIZE_STEP = 0.5;
export const RING_SIZE_DEFAULT = 7;

export const RING_SIZES: number[] = Array.from(
  { length: Math.round((RING_SIZE_MAX - RING_SIZE_MIN) / RING_SIZE_STEP) + 1 },
  (_, i) => RING_SIZE_MIN + i * RING_SIZE_STEP,
);

export interface RingBuilderConfig {
  builder: "ring";
  version: "0.1.0";
  metal: MetalId;
  stone: StoneId;
  stoneEnabled: boolean;
  stoneSize: number;
  bandStyle: BandStyleId;
  stoneShape: StoneShapeId;
  /** US ring size, 4–14 in half-size steps. */
  ringSize: number;
  /** Band width across the finger in millimeters. */
  bandWidth: BandWidthMm;
  haloStyle: HaloStyleId;
  prongStyle: ProngStyleId;
  sideStoneStyle: SideStoneStyleId;
  engraving: string;
  /** Degrees from 12 o'clock (crown), clockwise. Default 180 = 6 o'clock. */
  engravingAngle: number;
  engravingFace: EngravingFace;
  accentStones: AccentStonePlacement[];
}

export const STONE_SIZE_MIN = 0.6;
export const STONE_SIZE_MAX = 1.8;
export const STONE_SIZE_DEFAULT = 1.0;
export const STONE_SIZE_STEP = 0.1;

export interface RingBuilderState extends RingBuilderConfig {
  title: string;
  story_type: string;
  story_narrative: string;
}

export const DEFAULT_RING_BUILDER_CONFIG: RingBuilderConfig = {
  builder: "ring",
  version: "0.1.0",
  metal: "yellow_gold",
  stone: "diamond",
  stoneEnabled: true,
  stoneSize: STONE_SIZE_DEFAULT,
  bandStyle: "classic_solitaire",
  stoneShape: "round_brilliant",
  ringSize: RING_SIZE_DEFAULT,
  bandWidth: DEFAULT_BAND_WIDTH_MM,
  haloStyle: "none",
  prongStyle: "four_prong",
  sideStoneStyle: "none",
  engraving: "",
  engravingAngle: 180,
  engravingFace: "inside",
  accentStones: [],
};

export function isRingBuilderConfig(value: unknown): value is RingBuilderConfig {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.builder === "ring" && typeof v.metal === "string";
}

export function resolveBandStyle(value: unknown): BandStyleId {
  const valid = [
    "classic_solitaire",
    "cathedral",
    "knife_edge",
    "comfort_fit",
    "half_eternity",
    "split_shank",
    "twisted_band",
    "pave_band",
  ] as const;
  return valid.includes(value as BandStyleId) ? (value as BandStyleId) : "classic_solitaire";
}

export function resolveStoneShape(value: unknown): StoneShapeId {
  const valid = [
    "round_brilliant",
    "oval",
    "cushion",
    "emerald_cut",
    "radiant",
    "pear",
    "marquise",
    "princess",
    "asscher",
  ] as const;
  return valid.includes(value as StoneShapeId) ? (value as StoneShapeId) : "round_brilliant";
}

export function resolveEngravingAngle(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 180;
  return ((value % 360) + 360) % 360;
}

export function resolveEngravingFace(value: unknown): EngravingFace {
  return value === "outside" ? "outside" : "inside";
}

export function resolveHaloStyle(value: unknown): HaloStyleId {
  return value === "classic" || value === "hidden" ? value : "none";
}

export function resolveProngStyle(value: unknown): ProngStyleId {
  const valid: ProngStyleId[] = ["four_prong", "six_prong", "double_prong", "bezel", "basket"];
  return valid.includes(value as ProngStyleId) ? (value as ProngStyleId) : "four_prong";
}

const VALID_SIDE_STONE_STYLES: SideStoneStyleId[] = [
  "none",
  "two_side_stones",
  "three_stone_ring",
  "tapered_baguettes",
  "pear_side_stones",
  "trillion_side_stones",
];

/** Backward-compatible resolver — ignores unknown legacy side-stone fields. */
export function resolveSideStoneStyle(value: unknown, record?: Record<string, unknown>): SideStoneStyleId {
  const candidate =
    value ??
    record?.side_stone_style ??
    record?.sideStoneStyle ??
    record?.sideStoneSetting;

  if (VALID_SIDE_STONE_STYLES.includes(candidate as SideStoneStyleId)) {
    return candidate as SideStoneStyleId;
  }

  return "none";
}

export function isValidRingSize(value: number): boolean {
  if (Number.isNaN(value) || value < RING_SIZE_MIN || value > RING_SIZE_MAX) return false;
  return Math.abs(value * 2 - Math.round(value * 2)) < 0.001;
}

export function resolveRingSize(value: unknown): number {
  if (typeof value !== "number" || !isValidRingSize(value)) return RING_SIZE_DEFAULT;
  return value;
}

export function formatRingSize(size: number): string {
  return Number.isInteger(size) ? `Size ${size}` : `Size ${size.toFixed(1)}`;
}

const VALID_STONE_IDS: StoneId[] = [
  "diamond",
  "sapphire",
  "ruby",
  "emerald",
  "black_diamond",
];

export function resolveAccentStones(value: unknown): AccentStonePlacement[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `accent-legacy-${index}`,
      stone: VALID_STONE_IDS.includes(item.stone as StoneId)
        ? (item.stone as StoneId)
        : "diamond",
      angle: resolveEngravingAngle(item.angle),
    }))
    .slice(0, ACCENT_STONE_MAX);
}
