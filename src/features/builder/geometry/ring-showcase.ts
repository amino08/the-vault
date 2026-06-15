/**
 * LOCKED SOLITAIRE SHOWCASE ORIENTATION
 * ------------------------------------
 * Coordinate pipeline (do not reorder):
 *
 * 1. AUTHOR SPACE (ring-geometry.ts)
 * 2. STAND ROTATION (RingScene inner group)
 * 3. HERO TILT (RingScene outer group)
 *
 * Camera distance/target are computed at runtime from the full bounding box (ShowcaseCamera).
 */

/** Stands flat-authored band upright (local +Z becomes world +Y). */
export const STAND_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

/** Luxury 3/4 hero pitch/yaw after stand rotation. */
export const HERO_TILT: [number, number, number] = [0.14, 0.38, 0];

export const SHOWCASE_SCALE = 1;
export const SHOWCASE_POSITION: [number, number, number] = [0, 0, 0];

/** Tight product lens — paired with bounding-box framing. */
export const CAMERA_FOV = 26;

/** Target fill of preview height (70–80%). */
export const CAMERA_FILL_RATIO = 0.75;

/** Hero camera direction from orbit target (normalized at runtime). */
export const CAMERA_OFFSET: [number, number, number] = [0, 0.3, 2.6];

export const ORBIT_MIN_DISTANCE = 1.5;
export const ORBIT_MAX_DISTANCE = 4.5;

/** Gem table alignment in author space — table faces +Z (setting stack axis). */
export const GEM_TABLE_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0];

/** @deprecated Camera is framed via ShowcaseCamera + bounding box. */
export const SHOWCASE_ROTATION: [number, number, number] = STAND_ROTATION;

/** @deprecated */
export const CAMERA_AZIMUTH = 0.38;

/** @deprecated */
export const CAMERA_ELEVATION = 0.28;

/** @deprecated */
export const CAMERA_POSITION: [number, number, number] = [0, 0.3, 2.6];

/** @deprecated */
export const ORBIT_TARGET: [number, number, number] = [0, 0.35, 0];
