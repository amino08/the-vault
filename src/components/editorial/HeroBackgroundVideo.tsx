"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { vaultVideos } from "@/content/editorial-videos";

interface HeroBackgroundVideoProps {
  className?: string;
}

/**
 * Luxury hero background — autoplay muted loop.
 * Falls back to cream radial if sources fail (missing file or unsupported codec).
 *
 * Browser note: .mov works in Safari; add video.mp4 (H.264) for Chrome/Firefox/Edge.
 */
export function HeroBackgroundVideo({ className }: HeroBackgroundVideoProps) {
  const [useFallback, setUseFallback] = useState(false);

  const handleError = useCallback(() => {
    setUseFallback(true);
  }, []);

  if (useFallback) {
    return (
      <div
        className={cn("hero-video-fallback absolute inset-0", className)}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      <video
        className="hero-video-media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={handleError}
      >
        <source src={vaultVideos.hero.mp4} type="video/mp4" />
        <source src={vaultVideos.hero.mov} type="video/quicktime" />
      </video>
    </div>
  );
}
