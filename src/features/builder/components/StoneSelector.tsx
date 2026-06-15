"use client";

import { cn } from "@/lib/utils";
import { STONE_PRESETS } from "@/features/builder/constants";
import {
  STONE_SIZE_MAX,
  STONE_SIZE_MIN,
  STONE_SIZE_STEP,
  type StoneId,
} from "@/features/builder/types";
import { Label } from "@/components/ui/label";

interface StoneSelectorProps {
  value: StoneId;
  enabled: boolean;
  stoneSize: number;
  onStoneChange: (stone: StoneId) => void;
  onEnabledChange: (enabled: boolean) => void;
  onStoneSizeChange: (size: number) => void;
}

export function StoneSelector({
  value,
  enabled,
  stoneSize,
  onStoneChange,
  onEnabledChange,
  onStoneSizeChange,
}: StoneSelectorProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Center Stone</p>
          <p className="mt-1 font-serif text-lg text-vault-ivory">Gemstone</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-xs uppercase tracking-wider text-vault-pearl/60">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="h-3.5 w-3.5 accent-vault-gold"
          />
          Include stone
        </label>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-3 transition-all duration-500",
          !enabled && "pointer-events-none opacity-35",
        )}
      >
        {STONE_PRESETS.map((stone) => (
          <button
            key={stone.id}
            type="button"
            disabled={!enabled}
            onClick={() => onStoneChange(stone.id)}
            className={cn(
              "group flex w-full items-center justify-start gap-3 border px-4 py-3.5 text-left transition-all duration-300",
              value === stone.id
                ? "border-vault-gold/70 bg-vault-gold/[0.08] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]"
                : "border-white/[0.08] bg-vault-smoke/30 text-vault-pearl/70 hover:border-vault-gold/30",
            )}
          >
            <span
              className={cn(
                "h-4 w-4 shrink-0 rounded-full border shadow-inner transition-transform duration-300 group-hover:scale-105",
                value === stone.id ? "border-vault-gold/50" : "border-white/15",
              )}
              style={{ backgroundColor: stone.color }}
            />
            <span
              className={cn(
                "min-w-0 flex-1 text-left text-sm leading-snug",
                value === stone.id ? "text-vault-ivory" : "text-vault-pearl/80",
              )}
            >
              {stone.label}
            </span>
          </button>
        ))}
      </div>

      {!enabled && (
        <p className="text-xs tracking-wide text-vault-pearl/45">Band-only configuration — no center stone.</p>
      )}

      <StoneSizeSlider
        value={stoneSize}
        disabled={!enabled}
        onChange={onStoneSizeChange}
      />
    </section>
  );
}

function StoneSizeSlider({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled: boolean;
  onChange: (size: number) => void;
}) {
  return (
    <div
      className={cn(
        "space-y-3 border-t border-white/[0.06] pt-5 transition-opacity",
        disabled && "pointer-events-none opacity-35",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="stone_size" className="text-sm text-vault-ivory">
          Stone Size
        </Label>
        <span className="text-sm tabular-nums text-vault-gold">{value.toFixed(1)}×</span>
      </div>
      <input
        id="stone_size"
        type="range"
        min={STONE_SIZE_MIN}
        max={STONE_SIZE_MAX}
        step={STONE_SIZE_STEP}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-vault-smoke accent-vault-gold disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-vault-pearl/40">
        <span>{STONE_SIZE_MIN}×</span>
        <span>1.0×</span>
        <span>{STONE_SIZE_MAX}×</span>
      </div>
    </div>
  );
}
