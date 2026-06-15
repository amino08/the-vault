"use client";

import { cn } from "@/lib/utils";
import { BAND_STYLE_PRESETS } from "@/features/builder/style-presets";
import type { BandStyleId } from "@/features/builder/types";

interface BandStyleSelectorProps {
  value: BandStyleId;
  onChange: (style: BandStyleId) => void;
}

export function BandStyleSelector({ value, onChange }: BandStyleSelectorProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Band Style</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Ring Profile</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BAND_STYLE_PRESETS.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "group flex w-full flex-col items-start justify-start gap-1 border px-4 py-3.5 text-left transition-all duration-300",
              value === style.id
                ? "border-vault-gold/70 bg-vault-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]"
                : "border-white/[0.08] bg-vault-smoke/30 text-vault-pearl/70 hover:border-vault-gold/30",
            )}
          >
            <span className={cn("text-sm font-medium", value === style.id ? "text-vault-ivory" : "text-vault-pearl/80")}>
              {style.label}
            </span>
            {style.description && (
              <span className="text-[11px] leading-snug text-vault-pearl/45">{style.description}</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
