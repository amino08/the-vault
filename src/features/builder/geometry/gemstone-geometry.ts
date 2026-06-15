import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { StoneShapeId } from "@/features/builder/types";

/** Round-brilliant cut approximation with table, crown, girdle, and pavilion. */
export function createBrilliantCutGeometry(size = 0.095): THREE.BufferGeometry {
  const segments = 32;

  const table = new THREE.CylinderGeometry(size * 0.26, size * 0.26, size * 0.022, segments);
  table.translate(0, size * 0.44, 0);

  const crown = new THREE.CylinderGeometry(size * 0.26, size * 0.78, size * 0.2, segments);
  crown.translate(0, size * 0.31, 0);

  const girdle = new THREE.TorusGeometry(size * 0.78, size * 0.014, 10, segments);
  girdle.rotateX(Math.PI / 2);

  const pavilion = new THREE.CylinderGeometry(size * 0.78, 0.002, size * 0.36, segments);
  pavilion.translate(0, -size * 0.16, 0);

  const merged = mergeGeometries([table, crown, girdle, pavilion], true);
  if (!merged) {
    return new THREE.IcosahedronGeometry(size, 2);
  }

  merged.computeVertexNormals();
  return merged;
}

function finalizeGem(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  geometry.computeVertexNormals();
  return geometry;
}

function createOvalGeometry(size: number): THREE.BufferGeometry {
  const gem = new THREE.SphereGeometry(size * 0.78, 32, 24);
  gem.scale(1.28, 1, 0.82);
  gem.translate(0, size * 0.06, 0);
  return finalizeGem(gem);
}

function createCushionGeometry(size: number): THREE.BufferGeometry {
  const gem = new THREE.SphereGeometry(size * 0.76, 16, 16);
  gem.scale(1.12, 0.92, 1.12);
  gem.translate(0, size * 0.04, 0);
  return finalizeGem(gem);
}

function createEmeraldCutGeometry(size: number): THREE.BufferGeometry {
  const table = new THREE.BoxGeometry(size * 1.05, size * 0.04, size * 0.72);
  table.translate(0, size * 0.38, 0);
  const crown = new THREE.BoxGeometry(size * 1.05, size * 0.18, size * 0.72);
  crown.translate(0, size * 0.24, 0);
  const pavilion = new THREE.BoxGeometry(size * 0.95, size * 0.32, size * 0.62);
  pavilion.translate(0, -size * 0.08, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? new THREE.BoxGeometry(size, size, size * 0.6));
}

function createRadiantGeometry(size: number): THREE.BufferGeometry {
  const table = new THREE.CylinderGeometry(size * 0.32, size * 0.32, size * 0.03, 8);
  table.translate(0, size * 0.4, 0);
  const crown = new THREE.CylinderGeometry(size * 0.32, size * 0.82, size * 0.18, 8);
  crown.translate(0, size * 0.28, 0);
  const pavilion = new THREE.CylinderGeometry(size * 0.82, 0.004, size * 0.34, 8);
  pavilion.translate(0, -size * 0.12, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? createBrilliantCutGeometry(size));
}

function createPearGeometry(size: number): THREE.BufferGeometry {
  const profile = [
    new THREE.Vector2(0.001, -size * 0.42),
    new THREE.Vector2(size * 0.38, -size * 0.08),
    new THREE.Vector2(size * 0.62, size * 0.18),
    new THREE.Vector2(size * 0.48, size * 0.42),
    new THREE.Vector2(0.001, size * 0.46),
  ];
  const gem = new THREE.LatheGeometry(profile, 32);
  return finalizeGem(gem);
}

function createMarquiseGeometry(size: number): THREE.BufferGeometry {
  const gem = new THREE.SphereGeometry(size * 0.72, 32, 16);
  gem.scale(1.85, 0.72, 0.72);
  gem.translate(0, size * 0.04, 0);
  return finalizeGem(gem);
}

function createPrincessGeometry(size: number): THREE.BufferGeometry {
  const table = new THREE.BoxGeometry(size * 0.92, size * 0.04, size * 0.92);
  table.translate(0, size * 0.38, 0);
  const crown = new THREE.BoxGeometry(size * 0.92, size * 0.2, size * 0.92);
  crown.translate(0, size * 0.24, 0);
  const pavilion = new THREE.CylinderGeometry(size * 0.65, 0.004, size * 0.34, 4);
  pavilion.rotateY(Math.PI / 4);
  pavilion.translate(0, -size * 0.1, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? new THREE.BoxGeometry(size * 0.9, size * 0.9, size * 0.9));
}

function createAsscherGeometry(size: number): THREE.BufferGeometry {
  const table = new THREE.CylinderGeometry(size * 0.42, size * 0.42, size * 0.035, 8);
  table.translate(0, size * 0.36, 0);
  const crown = new THREE.CylinderGeometry(size * 0.42, size * 0.78, size * 0.16, 8);
  crown.translate(0, size * 0.24, 0);
  const pavilion = new THREE.CylinderGeometry(size * 0.78, 0.004, size * 0.3, 8);
  pavilion.translate(0, -size * 0.1, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? createBrilliantCutGeometry(size));
}

/** Tapered baguette — wider at girdle, narrow at culet. */
export function createBaguetteGeometry(size = 0.095): THREE.BufferGeometry {
  const table = new THREE.BoxGeometry(size * 0.22, size * 0.035, size * 1.05);
  table.translate(0, size * 0.32, 0);
  const crown = new THREE.BoxGeometry(size * 0.28, size * 0.14, size * 1.12);
  crown.translate(0, size * 0.2, 0);
  const pavilion = new THREE.BoxGeometry(size * 0.12, size * 0.28, size * 0.72);
  pavilion.translate(0, -size * 0.06, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? new THREE.BoxGeometry(size * 0.2, size * 0.4, size));
}

/** Triangular trillion cut. */
export function createTrillionGeometry(size = 0.095): THREE.BufferGeometry {
  const table = new THREE.CylinderGeometry(size * 0.38, size * 0.38, size * 0.03, 3);
  table.translate(0, size * 0.36, 0);
  const crown = new THREE.CylinderGeometry(size * 0.38, size * 0.72, size * 0.16, 3);
  crown.translate(0, size * 0.24, 0);
  const pavilion = new THREE.CylinderGeometry(size * 0.72, 0.004, size * 0.32, 3);
  pavilion.translate(0, -size * 0.08, 0);
  const merged = mergeGeometries([table, crown, pavilion], true);
  return finalizeGem(merged ?? new THREE.CylinderGeometry(size * 0.5, 0.004, size * 0.4, 3));
}

/** Side-stone silhouette factory (setting-local, girdle at y ≈ 0). */
export function createSideStoneGeometry(
  shape: "round" | "baguette" | "pear" | "trillion",
  size = 0.095,
): THREE.BufferGeometry {
  switch (shape) {
    case "baguette":
      return createBaguetteGeometry(size);
    case "pear":
      return createPearGeometry(size);
    case "trillion":
      return createTrillionGeometry(size);
    case "round":
    default:
      return createBrilliantCutGeometry(size);
  }
}

/** Factory for all supported center-stone silhouettes (girdle plane at y ≈ 0). */
export function createGemstoneGeometry(shape: StoneShapeId, size = 0.095): THREE.BufferGeometry {
  switch (shape) {
    case "round_brilliant":
      return createBrilliantCutGeometry(size);
    case "oval":
      return createOvalGeometry(size);
    case "cushion":
      return createCushionGeometry(size);
    case "emerald_cut":
      return createEmeraldCutGeometry(size);
    case "radiant":
      return createRadiantGeometry(size);
    case "pear":
      return createPearGeometry(size);
    case "marquise":
      return createMarquiseGeometry(size);
    case "princess":
      return createPrincessGeometry(size);
    case "asscher":
      return createAsscherGeometry(size);
    default:
      return createBrilliantCutGeometry(size);
  }
}
