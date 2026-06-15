import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}

export const PAYMENT_TYPES = {
  DESIGN_DEPOSIT: "design_deposit",
  MILESTONE: "milestone",
  PRODUCTION_FINAL: "production_final",
  ADJUSTMENT: "adjustment",
  REFUND: "refund",
} as const;
