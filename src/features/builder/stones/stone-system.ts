/**
 * Stone System — gem types, cuts, and placement slots.
 */

export type StoneCut = "round" | "princess" | "emerald" | "oval" | "custom";
export type StoneType = "diamond" | "sapphire" | "ruby" | "emerald" | "moissanite" | "custom";

export interface StoneDefinition {
  id: string;
  type: StoneType;
  cut: StoneCut;
  carat?: number;
  color?: string;
}

export interface StoneSlot {
  id: string;
  label: string;
  position: [number, number, number];
  maxStones: number;
}

export const defaultStoneSlots: StoneSlot[] = [
  { id: "center", label: "Center Stone", position: [0, 0, 0], maxStones: 1 },
  { id: "accent", label: "Accent Stones", position: [0, 0.5, 0], maxStones: 12 },
];

export interface BuilderStoneState {
  slots: Record<string, StoneDefinition[]>;
}

export const defaultStoneState: BuilderStoneState = {
  slots: {},
};
