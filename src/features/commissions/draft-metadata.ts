import type { Commission, CommissionMetadata } from "@/types";
import { DESIGN_DEPOSIT_CENTS } from "@/config/aevum-checkout";

export function getCommissionMetadata(commission: Commission): CommissionMetadata {
  return (commission.metadata ?? {}) as CommissionMetadata;
}

export function isCommissionDraft(commission: Commission): boolean {
  return getCommissionMetadata(commission).is_draft === true;
}

export function isCommissionSubmitted(commission: Commission): boolean {
  return !isCommissionDraft(commission);
}

export function getDraftSavedAt(commission: Commission): string | null {
  const savedAt = getCommissionMetadata(commission).draft_saved_at;
  return typeof savedAt === "string" ? savedAt : commission.updated_at;
}

export function buildDraftMetadata(existing: CommissionMetadata = {}): CommissionMetadata {
  return {
    ...existing,
    is_draft: true,
    draft_saved_at: new Date().toISOString(),
  };
}

export function buildSubmittedMetadata(
  checkoutUrl: string,
  existing: CommissionMetadata = {},
): CommissionMetadata {
  return {
    ...existing,
    is_draft: false,
    submitted_at: new Date().toISOString(),
    deposit_amount_cents: existing.deposit_amount_cents ?? DESIGN_DEPOSIT_CENTS,
    checkout_handoff_url: checkoutUrl,
  };
}
