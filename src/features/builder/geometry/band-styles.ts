import * as THREE from "three";
import type { BandStyleId } from "@/features/builder/types";
import type { BandWidthMm } from "@/features/builder/geometry/band-width";
import {
  DEFAULT_BAND_WIDTH_MM,
  bandWidthMmToScene,
} from "@/features/builder/geometry/band-width";
import {
  RING_MAJOR_RADIUS,
  RING_TUBE_DEPTH,
  createComfortFitBandGeometry,
} from "@/features/builder/geometry/ring-geometry";

function latheProfile(profile: THREE.Vector2[], segments = 160): THREE.BufferGeometry {
  const geometry = new THREE.LatheGeometry(profile, segments);
  geometry.computeVertexNormals();
  return geometry;
}

function buildProfile(
  majorRadius: number,
  bandWidth: number,
  tubeDepth: number,
  shape: "classic" | "knife" | "comfort",
): THREE.Vector2[] {
  const hw = bandWidth / 2;
  const inner = majorRadius - tubeDepth * 0.5;
  const outer = majorRadius + tubeDepth * 0.72;

  if (shape === "knife") {
    const narrow = hw * 0.72;
    return [
      new THREE.Vector2(inner, -narrow),
      new THREE.Vector2(majorRadius - tubeDepth * 0.08, -narrow * 0.35),
      new THREE.Vector2(outer + tubeDepth * 0.06, 0),
      new THREE.Vector2(majorRadius - tubeDepth * 0.08, narrow * 0.35),
      new THREE.Vector2(inner, narrow),
    ];
  }

  if (shape === "comfort") {
    return [
      new THREE.Vector2(inner, -hw),
      new THREE.Vector2(inner + 0.008, -hw * 0.82),
      new THREE.Vector2(majorRadius - tubeDepth * 0.18, -hw * 0.42),
      new THREE.Vector2(outer, 0),
      new THREE.Vector2(majorRadius - tubeDepth * 0.18, hw * 0.42),
      new THREE.Vector2(inner + 0.008, hw * 0.82),
      new THREE.Vector2(inner, hw),
    ];
  }

  return [
    new THREE.Vector2(inner, -hw * 0.94),
    new THREE.Vector2(inner + 0.004, -hw * 0.72),
    new THREE.Vector2(majorRadius - tubeDepth * 0.22, -hw * 0.38),
    new THREE.Vector2(majorRadius + tubeDepth * 0.08, -hw * 0.12),
    new THREE.Vector2(outer, 0),
    new THREE.Vector2(majorRadius + tubeDepth * 0.08, hw * 0.12),
    new THREE.Vector2(majorRadius - tubeDepth * 0.22, hw * 0.38),
    new THREE.Vector2(inner + 0.004, hw * 0.72),
    new THREE.Vector2(inner, hw * 0.94),
  ];
}

function thinBandProfile(bandWidthScene: number, scale = 0.78): THREE.Vector2[] {
  return buildProfile(
    RING_MAJOR_RADIUS,
    bandWidthScene * scale,
    RING_TUBE_DEPTH * scale,
    "classic",
  );
}

export interface BandGeometryResult {
  /** Primary band mesh(es). Multiple for split / twisted styles. */
  bands: THREE.BufferGeometry[];
  /** Optional per-band transforms [position, rotation]. */
  bandTransforms?: Array<{
    position?: [number, number, number];
    rotation?: [number, number, number];
  }>;
}

export function createBandGeometry(
  style: BandStyleId,
  bandWidthMm: BandWidthMm = DEFAULT_BAND_WIDTH_MM,
): BandGeometryResult {
  const bandWidthScene = bandWidthMmToScene(bandWidthMm);

  switch (style) {
    case "knife_edge":
      return {
        bands: [
          latheProfile(
            buildProfile(RING_MAJOR_RADIUS, bandWidthScene, RING_TUBE_DEPTH, "knife"),
          ),
        ],
      };
    case "comfort_fit":
      return {
        bands: [
          latheProfile(
            buildProfile(RING_MAJOR_RADIUS, bandWidthScene, RING_TUBE_DEPTH, "comfort"),
          ),
        ],
      };
    case "split_shank":
      return {
        bands: [latheProfile(thinBandProfile(bandWidthScene, 0.72)), latheProfile(thinBandProfile(bandWidthScene, 0.72))],
        bandTransforms: [
          { position: [-0.028, 0, 0], rotation: [0, 0, 0.12] },
          { position: [0.028, 0, 0], rotation: [0, 0, -0.12] },
        ],
      };
    case "twisted_band":
      return {
        bands: [latheProfile(thinBandProfile(bandWidthScene, 0.82)), latheProfile(thinBandProfile(bandWidthScene, 0.82))],
        bandTransforms: [
          { rotation: [0, 0, 0] },
          { rotation: [0, 0.42, 0.18] },
        ],
      };
    case "classic_solitaire":
    case "cathedral":
    case "half_eternity":
    case "pave_band":
    default:
      return {
        bands: [createComfortFitBandGeometry(RING_MAJOR_RADIUS, bandWidthScene, RING_TUBE_DEPTH)],
      };
  }
}

/** Positions for accent stones along half the band (author space, XZ plane). */
export function getHalfEternityStonePositions(count = 9): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 0.25 + (i / (count - 1)) * Math.PI * 1.35;
    const r = RING_MAJOR_RADIUS + RING_TUBE_DEPTH * 0.35;
    positions.push([Math.sin(angle) * r, 0, Math.cos(angle) * r]);
  }
  return positions;
}

/** Positions for pavé micro-stones around the band outer surface. */
export function getPaveStonePositions(count = 18): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = RING_MAJOR_RADIUS + RING_TUBE_DEPTH * 0.55;
    positions.push([Math.sin(angle) * r, 0, Math.cos(angle) * r]);
  }
  return positions;
}
