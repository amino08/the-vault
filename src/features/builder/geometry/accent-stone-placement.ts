import { RING_MAJOR_RADIUS, RING_TUBE_DEPTH } from "@/features/builder/geometry/ring-constants";
import { formatClockPosition } from "@/features/builder/geometry/ring-placement-utils";

/** Same crown track as half-eternity accent stones — proven visible on band. */
const ACCENT_RADIUS = RING_MAJOR_RADIUS + RING_TUBE_DEPTH * 0.35;

/** Popular shoulder / band positions when adding stones in order. */
const DEFAULT_ANGLES = [270, 90, 225, 135, 315, 45] as const;

export function defaultAccentAngle(index: number): number {
  return DEFAULT_ANGLES[index] ?? ((index * 60) % 360);
}

/** Accent stone on outer band crown (author space). */
export function getAccentStoneTransform(angleDeg: number): {
  position: [number, number, number];
} {
  const theta = (angleDeg * Math.PI) / 180;
  return {
    position: [
      Math.sin(theta) * ACCENT_RADIUS,
      0,
      Math.cos(theta) * ACCENT_RADIUS,
    ],
  };
}

export function formatAccentStoneLocation(angleDeg: number): string {
  return `Outside band · ${formatClockPosition(angleDeg)}`;
}

export function createAccentStoneId(): string {
  return `accent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const ACCENT_STONE_RENDER_SIZE = 0.019;
