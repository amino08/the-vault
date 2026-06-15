import type { Camera, Scene, WebGLRenderer } from "three";

const MAX_DIMENSION = 1024;

function resizeCanvasToBlob(source: HTMLCanvasElement, maxDimension: number): Promise<Blob | null> {
  const { width, height } = source;
  if (width === 0 || height === 0) return Promise.resolve(null);

  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const output = document.createElement("canvas");
  output.width = targetWidth;
  output.height = targetHeight;

  const ctx = output.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve) => {
    output.toBlob((blob) => resolve(blob), "image/png");
  });
}

/** Render the current scene and export the WebGL canvas as a PNG blob. */
export async function captureCanvasSnapshot(
  gl: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  maxDimension = MAX_DIMENSION,
): Promise<Blob | null> {
  gl.render(scene, camera);
  return resizeCanvasToBlob(gl.domElement, maxDimension);
}
