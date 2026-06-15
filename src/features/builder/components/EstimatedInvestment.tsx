"use client";

import { cn } from "@/lib/utils";
import {
  INVESTMENT_ESTIMATE_DISCLAIMER,
  type InvestmentEstimate,
} from "@/features/builder/pricing/investment-estimate";
import { formatInvestmentRange } from "@/features/builder/pricing/format-investment";

interface EstimatedInvestmentProps {
  estimate: InvestmentEstimate;
  className?: string;
  variant?: "panel" | "inline" | "compact";
}

export function EstimatedInvestment({
  estimate,
  className,
  variant = "panel",
}: EstimatedInvestmentProps) {
  const range = formatInvestmentRange(estimate);

  if (variant === "inline") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Estimated Investment</p>
        <p className="font-serif text-xl text-vault-ivory">{range}</p>
        <p className="text-[11px] leading-relaxed text-vault-pearl/45">{INVESTMENT_ESTIMATE_DISCLAIMER}</p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="text-[11px] uppercase tracking-wider text-vault-pearl/45">Estimated Investment</p>
        <p className="font-serif text-lg text-vault-gold">{range}</p>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "border border-vault-gold/30 bg-gradient-to-b from-vault-charcoal/95 to-vault-black/90 p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Estimated Investment</p>
      <p className="mt-3 font-serif text-3xl font-light tracking-tight text-vault-ivory">{range}</p>
      <p className="mt-4 border-t border-vault-gold/10 pt-4 text-[11px] leading-relaxed text-vault-pearl/45">
        {INVESTMENT_ESTIMATE_DISCLAIMER}
      </p>
    </aside>
  );
}

interface StoredInvestmentEstimateProps {
  lowCents: number | null;
  highCents: number | null;
  className?: string;
}

export function StoredInvestmentEstimate({
  lowCents,
  highCents,
  className,
}: StoredInvestmentEstimateProps) {
  if (lowCents == null || highCents == null) return null;

  return (
    <EstimatedInvestment
      className={className}
      estimate={{ lowCents, highCents }}
      variant="panel"
    />
  );
}
