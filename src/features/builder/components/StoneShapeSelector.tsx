"use client";

import { cn } from "@/lib/utils";
import { STONE_SHAPE_PRESETS } from "@/features/builder/style-presets";
import type { StoneShapeId } from "@/features/builder/types";

interface StoneShapeSelectorProps {
  value: StoneShapeId;
  disabled?: boolean;
  onChange: (shape: StoneShapeId) => void;
}

export function StoneShapeSelector({ value, disabled, onChange }: StoneShapeSelectorProps) {
  return (
    <section
      className={cn(
        "space-y-5 border-t border-white/[0.06] pt-5 transition-opacity",
        disabled && "pointer-events-none opacity-35",
      )}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Stone Shape</p>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Cut & Silhouette</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {STONE_SHAPE_PRESETS.map((shape) => (
          <button
            key={shape.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(shape.id)}
            className={cn(
              "group flex w-full items-center justify-start border px-4 py-3 text-left transition-all duration-300",
              value === shape.id
                ? "border-vault-gold/70 bg-vault-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]"
                : "border-white/[0.08] bg-vault-smoke/30 text-vault-pearl/70 hover:border-vault-gold/30",
            )}
          >
            <span className={cn("text-sm", value === shape.id ? "text-vault-ivory" : "text-vault-pearl/80")}>
              {shape.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
