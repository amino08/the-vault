"use client";

import { cn } from "@/lib/utils";
import { SIDE_STONE_STYLE_PRESETS } from "@/features/builder/style-presets";
import type { SideStoneStyleId } from "@/features/builder/types";

interface SideStoneStyleSelectorProps {
  value: SideStoneStyleId;
  disabled?: boolean;
  onChange: (sideStoneStyle: SideStoneStyleId) => void;
}

export function SideStoneStyleSelector({ value, disabled, onChange }: SideStoneStyleSelectorProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Center Setting</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Side Stones</p>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-3 transition-opacity",
          disabled && "pointer-events-none opacity-35",
        )}
      >
        {SIDE_STONE_STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset.id)}
            className={cn(
              "flex w-full flex-col items-start border px-4 py-3.5 text-left transition-all duration-300",
              value === preset.id
                ? "border-vault-gold/70 bg-vault-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]"
                : "border-white/[0.08] bg-vault-smoke/30 text-vault-pearl/70 hover:border-vault-gold/30",
            )}
          >
            <span
              className={cn(
                "text-sm",
                value === preset.id ? "text-vault-ivory" : "text-vault-pearl/80",
              )}
            >
              {preset.label}
            </span>
            {preset.description && (
              <span className="mt-1 text-[11px] text-vault-pearl/45">{preset.description}</span>
            )}
          </button>
        ))}
      </div>

      {disabled && (
        <p className="text-xs tracking-wide text-vault-pearl/45">
          Enable a center stone to choose side stones.
        </p>
      )}
    </section>
  );
}
