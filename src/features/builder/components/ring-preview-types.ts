/** Shared handle type — kept separate from RingPreview to avoid webpack graph issues. */
export interface RingPreviewHandle {
  captureSnapshot: () => Promise<Blob | null>;
  isReady: () => boolean;
}
