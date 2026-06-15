"use client";

/**
 * 3D Viewer — React Three Fiber foundation.
 * Full implementation in Phase 4 (Jewelry Builder).
 */

import dynamic from "next/dynamic";

const CanvasPlaceholder = dynamic(
  () => import("@/features/builder/viewer/canvas-placeholder").then((m) => m.CanvasPlaceholder),
  { ssr: false, loading: () => <ViewerSkeleton /> },
);

function ViewerSkeleton() {
  return (
    <div className="flex aspect-square w-full items-center justify-center border border-white/10 bg-vault-smoke">
      <p className="text-xs uppercase tracking-luxury text-vault-pearl/40">Loading 3D Viewer</p>
    </div>
  );
}

export function Viewer3D() {
  return (
    <div className="relative w-full">
      <CanvasPlaceholder />
    </div>
  );
}
