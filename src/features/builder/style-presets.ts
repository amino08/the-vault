import type { BandStyleId, HaloStyleId, ProngStyleId, SideStoneStyleId, StoneShapeId } from "@/features/builder/types";

export interface StylePreset<T extends string> {
  id: T;
  label: string;
  description?: string;
}

export const BAND_STYLE_PRESETS: StylePreset<BandStyleId>[] = [
  { id: "classic_solitaire", label: "Classic Solitaire", description: "Timeless tapered band" },
  { id: "cathedral", label: "Cathedral", description: "Raised arch shoulders" },
  { id: "knife_edge", label: "Knife Edge", description: "Sharp, refined profile" },
  { id: "comfort_fit", label: "Comfort Fit", description: "Rounded interior profile" },
  { id: "half_eternity", label: "Half Eternity", description: "Accent stones along the band" },
  { id: "split_shank", label: "Split Shank", description: "Dual band at the crown" },
  { id: "twisted_band", label: "Twisted Band", description: "Interwoven dual shank" },
  { id: "pave_band", label: "Pavé Band", description: "Micro-set surface stones" },
];

export const HALO_STYLE_PRESETS: StylePreset<HaloStyleId>[] = [
  { id: "none", label: "No Halo", description: "Center stone only" },
  { id: "classic", label: "Classic Halo", description: "Stones encircle the center table" },
  { id: "hidden", label: "Hidden Halo", description: "Stones beneath the center setting" },
];

export const PRONG_STYLE_PRESETS: StylePreset<ProngStyleId>[] = [
  { id: "four_prong", label: "4 Prong", description: "Classic four-corner setting" },
  { id: "six_prong", label: "6 Prong", description: "Secure six-point crown" },
  { id: "double_prong", label: "Double Prong", description: "Paired prongs at each corner" },
  { id: "bezel", label: "Bezel", description: "Smooth metal rim around the stone" },
  { id: "basket", label: "Basket", description: "Open wire basket under the stone" },
];

export const SIDE_STONE_STYLE_PRESETS: StylePreset<SideStoneStyleId>[] = [
  { id: "none", label: "None", description: "Center stone only" },
  { id: "two_side_stones", label: "Two Side Stones", description: "Matching pair flanking the center" },
  { id: "three_stone_ring", label: "Three Stone Ring", description: "Center with slightly smaller side stones" },
  { id: "tapered_baguettes", label: "Tapered Baguettes", description: "Rectangular baguettes at the shoulders" },
  { id: "pear_side_stones", label: "Pear Side Stones", description: "Pear cuts facing the center stone" },
  { id: "trillion_side_stones", label: "Trillion Side Stones", description: "Triangular stones at each shoulder" },
];

export const STONE_SHAPE_PRESETS: StylePreset<StoneShapeId>[] = [
  { id: "round_brilliant", label: "Round Brilliant" },
  { id: "oval", label: "Oval" },
  { id: "cushion", label: "Cushion" },
  { id: "emerald_cut", label: "Emerald Cut" },
  { id: "radiant", label: "Radiant" },
  { id: "pear", label: "Pear" },
  { id: "marquise", label: "Marquise" },
  { id: "princess", label: "Princess" },
  { id: "asscher", label: "Asscher" },
];

export function getBandStylePreset(id: BandStyleId | string | undefined): StylePreset<BandStyleId> {
  return BAND_STYLE_PRESETS.find((b) => b.id === id) ?? BAND_STYLE_PRESETS[0];
}

export function getStoneShapePreset(id: StoneShapeId | string | undefined): StylePreset<StoneShapeId> {
  return STONE_SHAPE_PRESETS.find((s) => s.id === id) ?? STONE_SHAPE_PRESETS[0];
}

export function getHaloStylePreset(id: HaloStyleId | string | undefined): StylePreset<HaloStyleId> {
  return HALO_STYLE_PRESETS.find((h) => h.id === id) ?? HALO_STYLE_PRESETS[0];
}

export function getProngStylePreset(id: ProngStyleId | string | undefined): StylePreset<ProngStyleId> {
  return PRONG_STYLE_PRESETS.find((p) => p.id === id) ?? PRONG_STYLE_PRESETS[0];
}

export function getSideStoneStylePreset(
  id: SideStoneStyleId | string | undefined,
): StylePreset<SideStoneStyleId> {
  return SIDE_STONE_STYLE_PRESETS.find((s) => s.id === id) ?? SIDE_STONE_STYLE_PRESETS[0];
}

export const DEFAULT_BAND_STYLE: BandStyleId = "classic_solitaire";
export const DEFAULT_STONE_SHAPE: StoneShapeId = "round_brilliant";
