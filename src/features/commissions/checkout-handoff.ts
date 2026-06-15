import {
  buildAevumCheckoutUrl,
  getAevumFallbackUrl,
  isValidCheckoutUrl,
} from "@/config/aevum-checkout";

export function redirectToCheckoutSafely(checkoutUrl: string | null | undefined): boolean {
  const target = isValidCheckoutUrl(checkoutUrl) ? checkoutUrl : getAevumFallbackUrl();

  try {
    window.location.assign(target);
    return true;
  } catch (error) {
    console.error("[redirectToCheckoutSafely]", error);
    try {
      window.location.assign(getAevumFallbackUrl());
      return true;
    } catch (fallbackError) {
      console.error("[redirectToCheckoutSafely] fallback failed", fallbackError);
      return false;
    }
  }
}

export function getSafeCheckoutUrl(checkoutUrl: string | null | undefined): string {
  if (isValidCheckoutUrl(checkoutUrl)) return checkoutUrl;
  return buildAevumCheckoutUrl({});
}
