/**
 * Engraving System — text, fonts, and placement on piece surfaces.
 */

export type EngravingFont = "serif" | "sans" | "script";

export interface EngravingDefinition {
  text: string;
  font: EngravingFont;
  surface: "inner" | "outer" | "back";
  depth: number;
}

export interface BuilderEngravingState {
  engravings: EngravingDefinition[];
}

export const defaultEngravingState: BuilderEngravingState = {
  engravings: [],
};

export const ENGRAVING_FONTS: Record<EngravingFont, string> = {
  serif: "Playfair Display",
  sans: "Geist Sans",
  script: "Cormorant Garamond",
};
