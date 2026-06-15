/**
 * Editorial video paths — single registry for media URLs.
 *
 * Marriage & Commitment campaign:
 *   public/videos/vault/video.mp4  → /videos/vault/video.mp4
 */

export const vaultVideos = {
  marriageCommitment: {
    mp4: "/videos/vault/video.mp4",
    mov: "/videos/vault/video.mov",
  },
  /** @deprecated Use marriageCommitment — kept for reference */
  hero: {
    mp4: "/videos/vault/video.mp4",
    mov: "/videos/vault/video.mov",
  },
} as const;
