/** Pure numeric ring dimensions — safe to import from server/client UI (no Three.js). */

export const RING_MAJOR_RADIUS = 0.63;
export const RING_BAND_WIDTH = 0.102;
export const RING_TUBE_DEPTH = 0.054;
export const RING_OUTER_RADIUS = RING_MAJOR_RADIUS + RING_TUBE_DEPTH * 0.72;

/** Top of band cross-section (profile Y max). */
export const BAND_TOP_Y = (RING_BAND_WIDTH / 2) * 0.94;

/**
 * Crown mount on the +Z outer surface of the band (author space).
 * X/Y must be 0 so the setting sits on the ring top center after STAND_ROTATION.
 */
export const SETTING_MOUNT: [number, number, number] = [0, 0, RING_OUTER_RADIUS];

/** Girdle seat along setting stack (+Z in author space). */
export const SETTING_STONE_Z = 0.05;
