import type { InvestmentEstimate } from "@/features/builder/pricing/investment-estimate";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatInvestmentCents(cents: number): string {
  return usdFormatter.format(cents / 100);
}

export function formatInvestmentRange(estimate: InvestmentEstimate): string {
  return `${formatInvestmentCents(estimate.lowCents)} – ${formatInvestmentCents(estimate.highCents)}`;
}

export function formatStoredInvestmentRange(
  lowCents: number | null | undefined,
  highCents: number | null | undefined,
): string | null {
  if (lowCents == null || highCents == null) return null;
  return formatInvestmentRange({ lowCents, highCents });
}
