"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  computeOrbitLimits,
  frameBoundingVolume,
} from "@/features/builder/geometry/camera-framing";
import {
  CAMERA_FILL_RATIO,
  CAMERA_FOV,
  CAMERA_OFFSET,
  ORBIT_MAX_DISTANCE,
  ORBIT_MIN_DISTANCE,
} from "@/features/builder/geometry/ring-showcase";

interface ShowcaseCameraProps {
  targetRef: React.RefObject<THREE.Group | null>;
  stoneSize: number;
  stoneEnabled: boolean;
  bandStyle: string;
  bandWidth: number;
  haloStyle: string;
  prongStyle: string;
  sideStoneStyle: string;
  stoneShape: string;
}

const FRAME_OPTIONS = {
  fillRatio: CAMERA_FILL_RATIO,
  padding: 1.16,
  minDistance: ORBIT_MIN_DISTANCE,
  maxDistance: ORBIT_MAX_DISTANCE,
} as const;

export function ShowcaseCamera({
  targetRef,
  stoneSize,
  stoneEnabled,
  bandStyle,
  bandWidth,
  haloStyle,
  prongStyle,
  sideStoneStyle,
  stoneShape,
}: ShowcaseCameraProps) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const initialFramedRef = useRef(false);
  const userInteractedRef = useRef(false);
  const resizeTimerRef = useRef<number | null>(null);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const offsetDirection = useMemo(
    () => new THREE.Vector3(...CAMERA_OFFSET).normalize(),
    [],
  );

  const structureKey = useMemo(
    () =>
      [stoneEnabled, bandStyle, bandWidth, haloStyle, prongStyle, sideStoneStyle, stoneShape].join(
        "|",
      ),
    [stoneEnabled, bandStyle, bandWidth, haloStyle, prongStyle, sideStoneStyle, stoneShape],
  );

  const stoneSizeKey = useMemo(() => stoneSize.toFixed(1), [stoneSize]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const markInteraction = () => {
      userInteractedRef.current = true;
    };

    controls.addEventListener("start", markInteraction);
    return () => controls.removeEventListener("start", markInteraction);
  }, []);

  useLayoutEffect(() => {
    const group = targetRef.current;
    const controls = controlsRef.current;
    if (!group || !controls) return;

    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.fov !== CAMERA_FOV) {
      perspective.fov = CAMERA_FOV;
      perspective.updateProjectionMatrix();
    }

    const frame = computeOrbitLimits(perspective, group, sizeRef.current, {
      ...FRAME_OPTIONS,
      offsetDirection,
    });
    if (!frame) return;

    controls.minDistance = frame.minDistance;
    controls.maxDistance = frame.maxDistance;

    if (!initialFramedRef.current) {
      frameBoundingVolume(perspective, group, sizeRef.current, {
        ...FRAME_OPTIONS,
        offsetDirection,
      });
      controls.target.copy(frame.target);
      controls.update();
      initialFramedRef.current = true;
    }
  }, [camera, structureKey, offsetDirection, targetRef]);

  useLayoutEffect(() => {
    const group = targetRef.current;
    const controls = controlsRef.current;
    if (!group || !controls || !initialFramedRef.current) return;

    const frame = computeOrbitLimits(camera as THREE.PerspectiveCamera, group, sizeRef.current, {
      ...FRAME_OPTIONS,
      offsetDirection,
    });
    if (!frame) return;

    controls.minDistance = frame.minDistance;
    controls.maxDistance = frame.maxDistance;
  }, [camera, stoneSizeKey, offsetDirection, targetRef]);

  useLayoutEffect(() => {
    const group = targetRef.current;
    if (!group || !initialFramedRef.current) return;

    if (resizeTimerRef.current !== null) {
      window.clearTimeout(resizeTimerRef.current);
    }

    resizeTimerRef.current = window.setTimeout(() => {
      const controls = controlsRef.current;
      if (!controls) return;

      const frame = computeOrbitLimits(
        camera as THREE.PerspectiveCamera,
        group,
        sizeRef.current,
        {
          ...FRAME_OPTIONS,
          offsetDirection,
        },
      );
      if (!frame) return;

      controls.minDistance = frame.minDistance;
      controls.maxDistance = frame.maxDistance;
    }, 150);

    return () => {
      if (resizeTimerRef.current !== null) {
        window.clearTimeout(resizeTimerRef.current);
      }
    };
  }, [camera, offsetDirection, targetRef, size.width, size.height]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom
      enableDamping
      dampingFactor={0.08}
      autoRotate
      autoRotateSpeed={0.35}
      minPolarAngle={Math.PI / 5.5}
      maxPolarAngle={Math.PI / 1.92}
    />
  );
}
