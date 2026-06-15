"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { captureCanvasSnapshot } from "@/features/builder/render/capture-canvas-snapshot";

interface RingPreviewCaptureBridgeProps {
  registerCapture: (capture: (() => Promise<Blob | null>) | null) => void;
}

/** Registers an imperative PNG capture function for the parent preview shell. */
export function RingPreviewCaptureBridge({ registerCapture }: RingPreviewCaptureBridgeProps) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const capture = () => captureCanvasSnapshot(gl, scene, camera);
    registerCapture(capture);
    return () => registerCapture(null);
  }, [registerCapture, gl, scene, camera]);

  return null;
}
