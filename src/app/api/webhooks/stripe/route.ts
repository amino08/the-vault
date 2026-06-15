import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";

/**
 * Stripe webhook handler — structure ready for Phase 2.
 * Events: checkout.session.completed, payment_intent.succeeded, charge.refunded
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: Update commission_payments, advance commission status
      break;
    case "payment_intent.succeeded":
      // TODO: Mark payment succeeded
      break;
    case "charge.refunded":
      // TODO: Update refund status on commission_payments
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
