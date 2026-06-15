import {
  RING_MAJOR_RADIUS,
  RING_OUTER_RADIUS,
  RING_TUBE_DEPTH,
} from "@/features/builder/geometry/ring-constants";
import type { EngravingFace } from "@/features/builder/types";
import { formatClockPosition } from "@/features/builder/geometry/ring-placement-utils";

const INNER_RADIUS = RING_MAJOR_RADIUS - RING_TUBE_DEPTH * 0.38;
const OUTER_RADIUS = RING_OUTER_RADIUS;
const SURFACE_OFFSET = 0.006;

/** Angle in degrees from 12 o'clock (crown / +Z), clockwise when viewed from above. */
export function getEngravingTransform(
  angleDeg: number,
  face: EngravingFace,
  textLength = 8,
): {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
} {
  const theta = (angleDeg * Math.PI) / 180;
  const radius =
    face === "inside"
      ? INNER_RADIUS - SURFACE_OFFSET
      : OUTER_RADIUS + SURFACE_OFFSET;

  const x = Math.sin(theta) * radius;
  const z = Math.cos(theta) * radius;

  // Plane lies on band surface; Y rotation faces along the radial normal.
  const yaw = face === "inside" ? theta + Math.PI : theta;

  const width = Math.min(0.42, 0.05 + textLength * 0.024);
  const height = 0.048;

  return {
    position: [x, 0, z],
    rotation: [0, yaw, 0],
    width,
    height,
  };
}

export function formatEngravingLocation(angleDeg: number, face: EngravingFace): string {
  const faceLabel = face === "inside" ? "Inside band" : "Outside band";
  return `${faceLabel} · ${formatClockPosition(angleDeg)}`;
}

export { formatClockPosition } from "@/features/builder/geometry/ring-placement-utils";

export const ENGRAVING_RING_DIAGRAM = {
  center: 100,
  outerR: 72,
  innerR: 52,
} as const;

export function angleFromDiagramPoint(x: number, y: number): number {
  const { center } = ENGRAVING_RING_DIAGRAM;
  const dx = x - center;
  const dy = y - center;
  const rad = Math.atan2(dx, -dy);
  return ((rad * 180) / Math.PI + 360) % 360;
}

export function diagramPointFromAngle(angleDeg: number, radius: number): { x: number; y: number } {
  const { center } = ENGRAVING_RING_DIAGRAM;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: center + Math.sin(rad) * radius,
    y: center - Math.cos(rad) * radius,
  };
}

export function diagramRadiusForFace(face: EngravingFace): number {
  return face === "inside"
    ? (ENGRAVING_RING_DIAGRAM.innerR + ENGRAVING_RING_DIAGRAM.outerR) / 2 - 4
    : ENGRAVING_RING_DIAGRAM.outerR - 2;
}
