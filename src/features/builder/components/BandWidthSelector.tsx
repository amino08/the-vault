"use client";

import { BAND_WIDTH_MM_OPTIONS, formatBandWidth } from "@/features/builder/types";
import type { BandWidthMm } from "@/features/builder/types";
import { Label } from "@/components/ui/label";

interface BandWidthSelectorProps {
  value: BandWidthMm;
  onChange: (bandWidth: BandWidthMm) => void;
}

export function BandWidthSelector({ value, onChange }: BandWidthSelectorProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Fit & Sizing</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Band Width</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="band_width" className="text-sm text-vault-ivory">
          Band Width
        </Label>
        <select
          id="band_width"
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) as BandWidthMm)}
          className="flex h-12 w-full rounded-sm border border-white/[0.08] bg-vault-smoke/40 px-4 text-sm text-vault-ivory transition-colors focus-visible:border-vault-gold/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vault-gold/30"
        >
          {BAND_WIDTH_MM_OPTIONS.map((width) => (
            <option key={width} value={width}>
              {formatBandWidth(width)}
            </option>
          ))}
        </select>
        <p className="text-[11px] tracking-wide text-vault-pearl/45">
          Width across the finger — updates the live band profile
        </p>
      </div>
    </section>
  );
}
