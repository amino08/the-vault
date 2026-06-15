"use client";

import { cn } from "@/lib/utils";
import { METAL_PRESETS } from "@/features/builder/constants";
import type { MetalId } from "@/features/builder/types";

interface MaterialSelectorProps {
  value: MetalId;
  onChange: (metal: MetalId) => void;
}

export function MaterialSelector({ value, onChange }: MaterialSelectorProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Metal Selection</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Precious Metal</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {METAL_PRESETS.map((metal) => (
          <button
            key={metal.id}
            type="button"
            onClick={() => onChange(metal.id)}
            className={cn(
              "group flex items-center gap-4 border px-5 py-4 text-left transition-all duration-300",
              value === metal.id
                ? "border-vault-gold/70 bg-vault-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]"
                : "border-white/[0.08] bg-vault-smoke/30 text-vault-pearl/70 hover:border-vault-gold/30 hover:bg-vault-smoke/50",
            )}
          >
            <span
              className={cn(
                "h-5 w-5 shrink-0 rounded-full border shadow-inner transition-transform duration-300 group-hover:scale-105",
                value === metal.id ? "border-vault-gold/50" : "border-white/15",
              )}
              style={{ backgroundColor: metal.color }}
            />
            <span className={cn("text-sm", value === metal.id ? "text-vault-ivory" : "text-vault-pearl/80")}>
              {metal.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
