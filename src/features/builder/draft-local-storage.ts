import type { RingBuilderConfig } from "@/features/builder/types";

export const PENDING_RING_DRAFT_KEY = "the-vault:ring-draft-pending";
export const PENDING_RING_DRAFT_RESTORE_FLAG = "the-vault:ring-draft-restore";

export interface PendingRingDraft {
  builder: RingBuilderConfig;
  title: string;
  storyType: string;
  storyNarrative: string;
  draftId?: string;
  savedAt: string;
}

export function readPendingRingDraft(): PendingRingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_RING_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingRingDraft;
  } catch {
    return null;
  }
}

export function writePendingRingDraft(draft: PendingRingDraft): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_RING_DRAFT_KEY, JSON.stringify(draft));
}

export function clearPendingRingDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_RING_DRAFT_KEY);
  window.localStorage.removeItem(PENDING_RING_DRAFT_RESTORE_FLAG);
}

export function markPendingRingDraftRestore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_RING_DRAFT_RESTORE_FLAG, "1");
}

export function shouldRestorePendingRingDraft(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PENDING_RING_DRAFT_RESTORE_FLAG) === "1";
}
