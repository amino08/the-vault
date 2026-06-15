/**
 * Material System — metals, finishes, and PBR properties.
 * Extend for gold karats, platinum, rose gold, etc.
 */

export type MetalType = "yellow_gold" | "white_gold" | "rose_gold" | "platinum" | "silver";

export interface MaterialDefinition {
  id: MetalType;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
}

export const MATERIALS: Record<MetalType, MaterialDefinition> = {
  yellow_gold: {
    id: "yellow_gold",
    label: "Yellow Gold",
    color: "#C9A962",
    metalness: 0.95,
    roughness: 0.12,
  },
  white_gold: {
    id: "white_gold",
    label: "White Gold",
    color: "#E8E8E0",
    metalness: 0.95,
    roughness: 0.1,
  },
  rose_gold: {
    id: "rose_gold",
    label: "Rose Gold",
    color: "#B76E79",
    metalness: 0.95,
    roughness: 0.14,
  },
  platinum: {
    id: "platinum",
    label: "Platinum",
    color: "#E5E4E2",
    metalness: 0.98,
    roughness: 0.08,
  },
  silver: {
    id: "silver",
    label: "Sterling Silver",
    color: "#C0C0C0",
    metalness: 0.9,
    roughness: 0.15,
  },
};

export interface BuilderMaterialState {
  metal: MetalType;
  finish: "polished" | "brushed" | "matte";
}

export const defaultMaterialState: BuilderMaterialState = {
  metal: "yellow_gold",
  finish: "polished",
};
