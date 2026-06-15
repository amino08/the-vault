import * as THREE from "three";

export interface FrameCameraOptions {
  /** Fraction of viewport height the object should occupy (0.70–0.80). */
  fillRatio?: number;
  /** Extra margin around the bounding sphere. */
  padding?: number;
  /** Camera offset direction from target (will be normalized). */
  offsetDirection?: THREE.Vector3;
  /** Fixed orbit zoom limits. */
  minDistance?: number;
  maxDistance?: number;
}

export interface FrameCameraResult {
  target: THREE.Vector3;
  distance: number;
  minDistance: number;
  maxDistance: number;
}

const _box = new THREE.Box3();
const _center = new THREE.Vector3();
const _sphere = new THREE.Sphere();
const _dir = new THREE.Vector3();

function computeFrameMetrics(
  object: THREE.Object3D,
  viewport: { width: number; height: number },
  camera: THREE.PerspectiveCamera,
  options: FrameCameraOptions,
): Omit<FrameCameraResult, "target"> & { center: THREE.Vector3 } | null {
  const {
    fillRatio = 0.75,
    padding = 1.16,
    minDistance = 1.5,
    maxDistance = 4.5,
  } = options;

  object.updateWorldMatrix(true, true);
  _box.setFromObject(object);
  if (_box.isEmpty()) return null;

  _box.getCenter(_center);
  _box.getBoundingSphere(_sphere);

  const radius = Math.max(_sphere.radius, 0.001);
  const aspect = viewport.width / Math.max(viewport.height, 1);
  const vFovRad = THREE.MathUtils.degToRad(camera.fov);
  const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

  const distanceForHeight = (radius * padding) / (Math.tan(vFovRad / 2) * fillRatio);
  const distanceForWidth = (radius * padding) / (Math.tan(hFovRad / 2) * fillRatio);
  const distance = Math.max(distanceForHeight, distanceForWidth);

  return {
    center: _center.clone(),
    distance,
    minDistance,
    maxDistance,
  };
}

/** Orbit limits only — does not move the camera (safe during user interaction). */
export function computeOrbitLimits(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  viewport: { width: number; height: number },
  options: FrameCameraOptions = {},
): FrameCameraResult | null {
  const metrics = computeFrameMetrics(object, viewport, camera, options);
  if (!metrics) return null;

  return {
    target: metrics.center,
    distance: metrics.distance,
    minDistance: metrics.minDistance,
    maxDistance: metrics.maxDistance,
  };
}

/**
 * One-time initial camera placement for the showcase.
 * After mount, prefer computeOrbitLimits to avoid fighting OrbitControls.
 */
export function frameBoundingVolume(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  viewport: { width: number; height: number },
  options: FrameCameraOptions = {},
): FrameCameraResult | null {
  const {
    offsetDirection = new THREE.Vector3(0, 0.3, 2.6),
  } = options;

  const metrics = computeFrameMetrics(object, viewport, camera, options);
  if (!metrics) return null;

  _dir.copy(offsetDirection).normalize();
  camera.position.copy(metrics.center).addScaledVector(_dir, metrics.distance);
  camera.near = Math.max(metrics.distance / 200, 0.02);
  camera.far = Math.max(metrics.distance * 20, 30);
  camera.lookAt(metrics.center);
  camera.updateProjectionMatrix();

  return {
    target: metrics.center,
    distance: metrics.distance,
    minDistance: metrics.minDistance,
    maxDistance: metrics.maxDistance,
  };
}
