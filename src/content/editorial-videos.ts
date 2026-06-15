/**
 * Hero and editorial video paths — single registry for media URLs.
 *
 * Primary hero asset:
 *   public/videos/vault/video.mp4  → /videos/vault/video.mp4
 *
 * Legacy fallback (optional):
 *   public/videos/vault/video.mov
 */

export const vaultVideos = {
  hero: {
    mp4: "/videos/vault/video.mp4",
    mov: "/videos/vault/video.mov",
    poster: null as string | null,
  },
} as const;
