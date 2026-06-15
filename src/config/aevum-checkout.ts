/** Default design deposit — $250.00 */
export const DESIGN_DEPOSIT_CENTS = 25_000;

export const DEFAULT_AEVUM_ORIGIN = "https://aevumdigital.co";

export interface AevumCheckoutParams {
  commissionId: string;
  referenceNumber: string;
  customerEmail?: string;
  amountCents?: number;
}

export function getAevumCheckoutOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_AEVUM_CHECKOUT_URL?.trim();
  if (!configured) return DEFAULT_AEVUM_ORIGIN;

  try {
    const parsed = new URL(configured.includes("://") ? configured : `https://${configured}`);
    return parsed.origin;
  } catch {
    const sanitized = configured.replace(/\/+$/, "");
    return sanitized || DEFAULT_AEVUM_ORIGIN;
  }
}

export function getAevumFallbackUrl(): string {
  return getAevumCheckoutOrigin();
}

export function isValidCheckoutUrl(value: string | null | undefined): value is string {
  if (!value || value === "pending") return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Never throws — returns fallback origin on any invalid input. */
export function buildAevumCheckoutUrl(params: Partial<AevumCheckoutParams>): string {
  try {
    const origin = getAevumCheckoutOrigin();
    const url = new URL("/checkout", `${origin}/`);
    const amount = params.amountCents ?? DESIGN_DEPOSIT_CENTS;

    url.searchParams.set("source", "the-vault");
    url.searchParams.set("type", "custom-jewelry-commission");

    if (params.commissionId) {
      url.searchParams.set("commission_id", params.commissionId);
    }

    if (params.referenceNumber) {
      url.searchParams.set("ref", params.referenceNumber);
    }

    url.searchParams.set("amount", String(amount));

    if (params.customerEmail) {
      url.searchParams.set("customer_email", params.customerEmail);
    }

    return url.toString();
  } catch (error) {
    console.error("[buildAevumCheckoutUrl]", error);
    return getAevumFallbackUrl();
  }
}

export function resolveCommissionCheckoutUrl(
  commission: { id: string; reference_number: string; metadata?: Record<string, unknown> },
  customerEmail?: string,
): string {
  const stored = commission.metadata?.checkout_handoff_url;
  if (typeof stored === "string" && isValidCheckoutUrl(stored)) {
    return stored;
  }

  return buildAevumCheckoutUrl({
    commissionId: commission.id,
    referenceNumber: commission.reference_number,
    customerEmail,
    amountCents: DESIGN_DEPOSIT_CENTS,
  });
}
