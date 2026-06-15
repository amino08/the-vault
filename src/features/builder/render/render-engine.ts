/**
 * Render Engine — export config snapshots and trigger server-side renders.
 * Phase 4: Connect to headless Three.js or external render farm.
 */

import type { BuilderMaterialState } from "@/features/builder/materials/material-system";
import type { BuilderStoneState } from "@/features/builder/stones/stone-system";
import type { BuilderEngravingState } from "@/features/builder/engraving/engraving-system";

export type BuilderType = "pendant" | "ring" | "bracelet" | "necklace";

export interface BuilderConfig {
  builderType: BuilderType;
  version: string;
  material: BuilderMaterialState;
  stones: BuilderStoneState;
  engraving: BuilderEngravingState;
  customParams: Record<string, unknown>;
}

export const BUILDER_VERSION = "0.1.0";

export function createEmptyBuilderConfig(type: BuilderType): BuilderConfig {
  return {
    builderType: type,
    version: BUILDER_VERSION,
    material: { metal: "yellow_gold", finish: "polished" },
    stones: { slots: {} },
    engraving: { engravings: [] },
    customParams: {},
  };
}

export async function exportRenderSnapshot(_config: BuilderConfig): Promise<Blob | null> {
  // TODO Phase 4: Capture canvas / generate preview image
  return null;
}
