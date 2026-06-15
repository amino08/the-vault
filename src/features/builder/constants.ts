import type { MetalId, StoneId } from "@/features/builder/types";

export interface MetalPreset {
  id: MetalId;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
}

export interface StonePreset {
  id: StoneId;
  label: string;
  color: string;
  emissive?: string;
  metalness: number;
  roughness: number;
  transmission?: number;
}

export const METAL_PRESETS: MetalPreset[] = [
  {
    id: "yellow_gold",
    label: "Yellow Gold",
    color: "#D4AF5A",
    metalness: 0.97,
    roughness: 0.11,
  },
  {
    id: "white_gold",
    label: "White Gold",
    color: "#ECEAE4",
    metalness: 0.98,
    roughness: 0.07,
  },
  {
    id: "rose_gold",
    label: "Rose Gold",
    color: "#C4867A",
    metalness: 0.96,
    roughness: 0.13,
  },
  {
    id: "platinum",
    label: "Platinum",
    color: "#E8E6E1",
    metalness: 0.99,
    roughness: 0.06,
  },
];

export const STONE_PRESETS: StonePreset[] = [
  {
    id: "diamond",
    label: "Diamond",
    color: "#FAFCFF",
    metalness: 0.05,
    roughness: 0.02,
    transmission: 0.92,
  },
  {
    id: "sapphire",
    label: "Sapphire",
    color: "#1D4ED8",
    emissive: "#1e3a8a",
    metalness: 0.15,
    roughness: 0.04,
    transmission: 0.72,
  },
  {
    id: "ruby",
    label: "Ruby",
    color: "#BE123C",
    emissive: "#881337",
    metalness: 0.15,
    roughness: 0.04,
    transmission: 0.65,
  },
  {
    id: "emerald",
    label: "Emerald",
    color: "#059669",
    emissive: "#065f46",
    metalness: 0.15,
    roughness: 0.05,
    transmission: 0.58,
  },
  {
    id: "black_diamond",
    label: "Black Diamond",
    color: "#141414",
    emissive: "#0a0a0a",
    metalness: 0.75,
    roughness: 0.12,
    transmission: 0.15,
  },
];

export function getMetalPreset(id: MetalId): MetalPreset {
  return METAL_PRESETS.find((m) => m.id === id) ?? METAL_PRESETS[0];
}

export function getStonePreset(id: StoneId): StonePreset {
  return STONE_PRESETS.find((s) => s.id === id) ?? STONE_PRESETS[0];
}

export const BUILDER_VERSION = "0.1.0";
