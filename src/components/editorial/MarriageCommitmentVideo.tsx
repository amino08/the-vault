"use client";

import { useCallback, useState } from "react";
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
        <span className="sr-only">Video unavailable</span>
      </div>
    );
  }

  return (
    <div className="marriage-commitment-video">
      <video
        className="marriage-commitment-video-media"
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
