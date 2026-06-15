"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { vaultVideos } from "@/content/editorial-videos";

/**
 * Marriage & Commitment campaign video — bright editorial, no heavy overlay.
 */
export function MarriageCommitmentVideo() {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="marriage-commitment-video-fallback" aria-hidden>
        <p className="text-xs uppercase tracking-[0.2em] text-vault-muted-light">
          Video unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="marriage-commitment-video">
      <video
        className={cn("marriage-commitment-video-media")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={handleError}
      >
        <source src={vaultVideos.marriageCommitment.mp4} type="video/mp4" />
        <source src={vaultVideos.marriageCommitment.mov} type="video/quicktime" />
      </video>
    </div>
  );
}
