"use client";

import { RING_SIZES, formatRingSize } from "@/features/builder/types";
import { Label } from "@/components/ui/label";

interface RingSizeSelectorProps {
  value: number;
  onChange: (ringSize: number) => void;
}

export function RingSizeSelector({ value, onChange }: RingSizeSelectorProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Fit & Sizing</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Ring Size</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ring_size" className="text-sm text-vault-ivory">
          US Ring Size
        </Label>
        <select
          id="ring_size"
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value))}
          className="flex h-12 w-full rounded-sm border border-white/[0.08] bg-vault-smoke/40 px-4 text-sm text-vault-ivory transition-colors focus-visible:border-vault-gold/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vault-gold/30"
        >
          {RING_SIZES.map((size) => (
            <option key={size} value={size}>
              {formatRingSize(size)}
            </option>
          ))}
        </select>
        <p className="text-[11px] tracking-wide text-vault-pearl/45">
          Sizes 4–14 in half-size increments
        </p>
      </div>
    </section>
  );
}
