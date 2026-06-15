import * as THREE from "three";
import {
  BAND_TOP_Y,
  RING_BAND_WIDTH,
  RING_MAJOR_RADIUS,
  RING_OUTER_RADIUS,
  RING_TUBE_DEPTH,
  SETTING_MOUNT,
  SETTING_STONE_Z,
} from "@/features/builder/geometry/ring-constants";

export {
  BAND_TOP_Y,
  RING_BAND_WIDTH,
  RING_MAJOR_RADIUS,
  RING_OUTER_RADIUS,
  RING_TUBE_DEPTH,
  SETTING_MOUNT,
  SETTING_STONE_Z,
};

/** Comfort-fit band profile revolved into a realistic solitaire band. */
export function createComfortFitBandGeometry(
  majorRadius = RING_MAJOR_RADIUS,
  bandWidth = RING_BAND_WIDTH,
  tubeDepth = RING_TUBE_DEPTH,
): THREE.BufferGeometry {
  const hw = bandWidth / 2;
  const inner = majorRadius - tubeDepth * 0.5;
  const outer = majorRadius + tubeDepth * 0.72;

  const profile = [
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

  const geometry = new THREE.LatheGeometry(profile, 160);
  geometry.computeVertexNormals();
  return geometry;
}

/** Shoulder bridges connecting band to the setting basket. */
export function createShoulderGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.04, 0.02, 0.09, 0.055);
  shape.lineTo(0.11, 0.048);
  shape.quadraticCurveTo(0.05, 0.015, 0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
    steps: 1,
  });
  geometry.center();
  return geometry;
}
