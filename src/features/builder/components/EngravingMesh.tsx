"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getEngravingTransform } from "@/features/builder/geometry/engraving-placement";
import type { EngravingFace } from "@/features/builder/types";

interface EngravingMeshProps {
  text: string;
  angle: number;
  face: EngravingFace;
}

function createEngravingTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const width = 1024;
  const height = 256;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, width, height);

  const label = text.trim().toUpperCase();
  const fontSize = Math.min(96, Math.floor(720 / Math.max(label.length, 3)));
  ctx.font = `600 ${fontSize}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Debossed look — dark core with light edge for contrast on gold
  ctx.fillStyle = "rgba(12, 10, 8, 0.92)";
  ctx.fillText(label, width / 2 + 1, height / 2 + 1);
  ctx.fillStyle = "rgba(26, 21, 16, 0.95)";
  ctx.fillText(label, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function EngravingMesh({ text, angle, face }: EngravingMeshProps) {
  const trimmed = text.trim();
  const transform = useMemo(
    () => (trimmed ? getEngravingTransform(angle, face, trimmed.length) : null),
    [trimmed, angle, face],
  );

  const texture = useMemo(() => {
    if (!trimmed) return null;
    const tex = createEngravingTexture(trimmed);
    return tex;
  }, [trimmed]);

  if (!trimmed || !transform || !texture) return null;

  const { position, rotation, width, height } = transform;

  return (
    <mesh position={position} rotation={rotation} renderOrder={12}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.98}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
