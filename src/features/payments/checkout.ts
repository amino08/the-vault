/**
 * Payment architecture — Stripe checkout, milestones, deposits, refunds.
 * Implementation stubs for Phase 2+.
 */

import type { PaymentType } from "@/types";

export interface CreateCheckoutParams {
  commissionId: string;
  clientId: string;
  amountCents: number;
  currency?: string;
  paymentType: PaymentType;
  milestoneLabel?: string;
  description?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  sessionId: string;
  url: string | null;
}

export async function createCheckoutSession(
  _params: CreateCheckoutParams,
): Promise<CheckoutResult> {
  // TODO Phase 2: Implement Stripe Checkout Session creation
  throw new Error("Stripe checkout not yet implemented");
}

export interface RefundParams {
  paymentIntentId: string;
  amountCents?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
}

export async function processRefund(_params: RefundParams): Promise<void> {
  // TODO Phase 2: Implement partial/full refund handling
  throw new Error("Stripe refunds not yet implemented");
}

export const PAYMENT_MILESTONES = {
  designDeposit: {
    type: "design_deposit" as const,
    label: "Design Deposit",
    description: "Secures your commission slot and initiates the design process.",
  },
  productionFinal: {
    type: "production_final" as const,
    label: "Production Payment",
    description: "Final payment before production begins.",
  },
} as const;
