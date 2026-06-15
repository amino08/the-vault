"use client";

import { forwardRef, Suspense, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { pickRingSceneConfig, RingScene } from "@/features/builder/components/RingScene";
import { RingPreviewCaptureBridge } from "@/features/builder/components/RingPreviewCaptureBridge";
import { StudioEnvironment } from "@/features/builder/components/StudioEnvironment";
import { CAMERA_FOV } from "@/features/builder/geometry/ring-showcase";
import type { RingBuilderConfig } from "@/features/builder/types";
import type { RingPreviewHandle } from "@/features/builder/components/ring-preview-types";

export type { RingPreviewHandle } from "@/features/builder/components/ring-preview-types";

interface RingPreviewProps {
  config: RingBuilderConfig;
  className?: string;
}

const MAX_DPR = 2;

const GL_CONFIG = {
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance" as WebGLPowerPreference,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.32,
};

/** Client-only 3D preview — single module loaded via dynamic import from RingConfigurator. */
const RingPreview = forwardRef<RingPreviewHandle, RingPreviewProps>(function RingPreview(
  { config, className },
  ref,
) {
  const captureFnRef = useRef<(() => Promise<Blob | null>) | null>(null);

  const registerCapture = useCallback((capture: (() => Promise<Blob | null>) | null) => {
    captureFnRef.current = capture;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      captureSnapshot: async () => {
        if (!captureFnRef.current) return null;
        return captureFnRef.current();
      },
      isReady: () => captureFnRef.current !== null,
    }),
    [],
  );

  const dpr = useMemo(
    () => Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, MAX_DPR),
    [],
  );

  const sceneConfig = useMemo(
    () => pickRingSceneConfig(config),
    // Granular deps avoid re-picking when unrelated builder fields change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable scene subset
    [
      config.metal,
      config.stone,
      config.stoneEnabled,
      config.stoneSize,
      config.bandStyle,
      config.bandWidth,
      config.stoneShape,
      config.haloStyle,
      config.prongStyle,
      config.sideStoneStyle,
      config.engraving,
      config.engravingAngle,
      config.engravingFace,
      config.accentStones,
    ],
  );

  const onCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.setClearColor(0x070707, 1);
    gl.shadowMap.type = THREE.PCFShadowMap;
    gl.shadowMap.enabled = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.32;
  }, []);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#070707]", className)}>
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 42%, #1a1712 0%, #0e0d0b 45%, #070707 100%)",
        }}
      />

      <div className="relative z-[1] h-full w-full">
        <Canvas
          shadows
          dpr={dpr}
          frameloop="always"
          camera={{ position: [0, 0.3, 2.6], fov: CAMERA_FOV, near: 0.02, far: 50 }}
          gl={GL_CONFIG}
          onCreated={onCreated}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <StudioEnvironment />
          <Suspense fallback={null}>
            <RingScene config={sceneConfig} />
            <RingPreviewCaptureBridge registerCapture={registerCapture} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
});

export default RingPreview;
