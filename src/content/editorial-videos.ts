/**
 * Hero and editorial video paths — single registry for media URLs.
 *
 * Place uploaded files at:
 *   public/videos/vault/video.mov
 *
 * Optional (recommended for Chrome/Firefox/Android):
 *   public/videos/vault/video.mp4  (H.264)
 *
 * Convert without deleting the original .mov:
 *   ffmpeg -i public/videos/vault/video.mov -c:v libx264 -crf 20 -pix_fmt yuv420p -an public/videos/vault/video.mp4
 *
 * .mov (QuickTime) plays natively in Safari; other browsers prefer MP4.
 */

export const vaultVideos = {
  hero: {
    mov: "/videos/vault/video.mov",
    /** Add when converted — listed first in <video> for broader browser support */
    mp4: "/videos/vault/video.mp4",
    poster: null as string | null,
  },
} as const;
