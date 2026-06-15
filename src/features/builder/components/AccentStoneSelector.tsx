"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { STONE_PRESETS } from "@/features/builder/constants";
import {
  ENGRAVING_RING_DIAGRAM,
  angleFromDiagramPoint,
  diagramPointFromAngle,
} from "@/features/builder/geometry/engraving-placement";
import {
  createAccentStoneId,
  defaultAccentAngle,
  formatAccentStoneLocation,
} from "@/features/builder/geometry/accent-stone-placement";
import {
  ACCENT_STONE_MAX,
  type AccentStonePlacement,
  type StoneId,
} from "@/features/builder/types";

const DIAGRAM_TRACK_R = ENGRAVING_RING_DIAGRAM.outerR - 2;

interface AccentStoneSelectorProps {
  stones: AccentStonePlacement[];
  onChange: (stones: AccentStonePlacement[]) => void;
}

export function AccentStoneSelector({ stones, onChange }: AccentStoneSelectorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(stones[0]?.id ?? null);

  const selected = stones.find((s) => s.id === selectedId) ?? stones[0] ?? null;
  const canAdd = stones.length < ACCENT_STONE_MAX;

  const updateAngleFromClient = useCallback(
    (clientX: number, clientY: number) => {
      if (!selected) return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = (ENGRAVING_RING_DIAGRAM.center * 2) / rect.width;
      const scaleY = (ENGRAVING_RING_DIAGRAM.center * 2) / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      const angle = Math.round(angleFromDiagramPoint(x, y));
      onChange(stones.map((s) => (s.id === selected.id ? { ...s, angle } : s)));
    },
    [onChange, selected, stones],
  );

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    updateAngleFromClient(event.clientX, event.clientY);
  };

  const handlePointerUp = () => setDragging(false);

  const addStone = () => {
    if (!canAdd) return;
    const placement: AccentStonePlacement = {
      id: createAccentStoneId(),
      stone: "diamond",
      angle: defaultAccentAngle(stones.length),
    };
    onChange([...stones, placement]);
    setSelectedId(placement.id);
  };

  const removeStone = (id: string) => {
    const next = stones.filter((s) => s.id !== id);
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  const updateStone = (id: string, patch: Partial<AccentStonePlacement>) => {
    onChange(stones.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Embellishment</p>
          <p className="mt-1 font-serif text-lg text-vault-ivory">Accent Stones</p>
        </div>
        <button
          type="button"
          disabled={!canAdd}
          onClick={addStone}
          className={cn(
            "border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors",
            canAdd
              ? "border-vault-gold/70 text-vault-ivory hover:bg-vault-gold/[0.08]"
              : "cursor-not-allowed border-white/[0.06] text-vault-pearl/30",
          )}
        >
          + Add stone
        </button>
      </div>

      <p className="text-[11px] tracking-wide text-vault-pearl/45">
        Up to {ACCENT_STONE_MAX} accent stones on the band · {stones.length}/{ACCENT_STONE_MAX} placed
      </p>

      {stones.length > 0 && (
        <div className="space-y-2">
          {stones.map((placement, index) => {
            const preset = STONE_PRESETS.find((s) => s.id === placement.stone)!;
            const isActive = selected?.id === placement.id;
            return (
              <div
                key={placement.id}
                className={cn(
                  "border p-3 transition-colors",
                  isActive
                    ? "border-vault-gold/50 bg-vault-gold/[0.06]"
                    : "border-white/[0.08] bg-vault-smoke/20",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedId(placement.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border border-white/15"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm text-vault-ivory">Stone {index + 1}</span>
                    <span className="truncate text-[11px] text-vault-pearl/45">
                      {formatAccentStoneLocation(placement.angle)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStone(placement.id)}
                    className="shrink-0 text-[11px] uppercase tracking-wider text-vault-pearl/45 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                {isActive && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
                    {STONE_PRESETS.map((stone) => (
                      <button
                        key={stone.id}
                        type="button"
                        onClick={() => updateStone(placement.id, { stone: stone.id as StoneId })}
                        className={cn(
                          "flex items-center gap-2 border px-2.5 py-2 text-left text-xs transition-colors",
                          placement.stone === stone.id
                            ? "border-vault-gold/60 bg-vault-gold/[0.08] text-vault-ivory"
                            : "border-white/[0.08] text-vault-pearl/65 hover:border-vault-gold/30",
                        )}
                      >
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: stone.color }}
                        />
                        {stone.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {stones.length === 0 && (
        <p className="rounded-sm border border-dashed border-white/[0.08] px-4 py-6 text-center text-sm text-vault-pearl/45">
          Add accent stones to personalize shoulders or the band — popular for birthstones and milestones.
        </p>
      )}

      {selected && (
        <div className="space-y-3 border-t border-white/[0.06] pt-5">
          <p className="text-sm text-vault-ivory">
            Placement for Stone {stones.findIndex((s) => s.id === selected.id) + 1}
          </p>
          <div className="rounded-sm border border-white/[0.08] bg-vault-smoke/20 p-3">
            <svg
              ref={svgRef}
              viewBox="0 0 200 200"
              className="mx-auto block w-full max-w-[220px] cursor-crosshair touch-none select-none"
              onPointerDown={(event) => {
                setDragging(true);
                svgRef.current?.setPointerCapture(event.pointerId);
                updateAngleFromClient(event.clientX, event.clientY);
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <circle
                cx={ENGRAVING_RING_DIAGRAM.center}
                cy={ENGRAVING_RING_DIAGRAM.center}
                r={ENGRAVING_RING_DIAGRAM.outerR}
                fill="none"
                stroke="rgba(201,169,98,0.35)"
                strokeWidth="10"
              />
              <circle
                cx={ENGRAVING_RING_DIAGRAM.center}
                cy={ENGRAVING_RING_DIAGRAM.center}
                r={ENGRAVING_RING_DIAGRAM.innerR}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <circle cx={100} cy={28} r={5} fill="rgba(201,169,98,0.55)" />
              <text x={100} y={18} textAnchor="middle" fill="rgba(201,169,98,0.6)" fontSize="8">
                CENTER
              </text>
              {stones.map((placement, index) => {
                const point = diagramPointFromAngle(placement.angle, DIAGRAM_TRACK_R);
                const preset = STONE_PRESETS.find((s) => s.id === placement.stone)!;
                const isActive = placement.id === selected.id;
                return (
                  <g
                    key={placement.id}
                    transform={`translate(${point.x} ${point.y})`}
                    className="pointer-events-none"
                  >
                    <circle
                      r={isActive ? 10 : 7}
                      fill={preset.color}
                      stroke={isActive ? "#C9A962" : "#070707"}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    <text
                      y="3"
                      textAnchor="middle"
                      fill={isActive ? "#070707" : "#fff"}
                      fontSize="7"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 text-center text-[11px] text-vault-pearl/45">
              Drag or tap around the ring to position the selected stone
            </p>
          </div>
          <p className="text-sm text-vault-gold">{formatAccentStoneLocation(selected.angle)}</p>
        </div>
      )}
    </section>
  );
}
