/** Band width in millimeters — no Three.js, safe for server UI. */

export const BAND_WIDTH_MM_OPTIONS = [
  1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8,
] as const;

export type BandWidthMm = (typeof BAND_WIDTH_MM_OPTIONS)[number];

export const DEFAULT_BAND_WIDTH_MM: BandWidthMm = 2.5;

/** Current default band (2.5mm) maps to this author-space lathe profile height. */
export const REF_BAND_WIDTH_MM = 2.5;
export const REF_BAND_WIDTH_SCENE = 0.102;

export function isValidBandWidthMm(value: number): value is BandWidthMm {
  return BAND_WIDTH_MM_OPTIONS.some((option) => Math.abs(option - value) < 0.001);
}

export function resolveBandWidthMm(value: unknown): BandWidthMm {
  if (typeof value === "number" && isValidBandWidthMm(value)) return value;
  return DEFAULT_BAND_WIDTH_MM;
}

export function formatBandWidth(mm: number): string {
  return `${mm.toFixed(1)}mm`;
}

/** Convert selected mm to author-space lathe profile width (Y extent in band profile). */
export function bandWidthMmToScene(mm: number): number {
  return (mm / REF_BAND_WIDTH_MM) * REF_BAND_WIDTH_SCENE;
}

export function getBandTopYFromSceneWidth(bandWidthScene: number): number {
  return (bandWidthScene / 2) * 0.94;
}
