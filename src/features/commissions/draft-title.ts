import { getMetalPreset, getStonePreset } from "@/features/builder/constants";
import { getBandStylePreset } from "@/features/builder/style-presets";
import type { RingBuilderConfig } from "@/features/builder/types";

export function generateDraftTitle(config: RingBuilderConfig): string {
  const metal = getMetalPreset(config.metal).label;
  const band = getBandStylePreset(config.bandStyle).label;
  const stone = config.stoneEnabled
    ? getStonePreset(config.stone).label
    : "Band Only";
  return `${metal} · ${stone} · ${band}`;
}
