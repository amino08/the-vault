"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ENGRAVING_RING_DIAGRAM,
  angleFromDiagramPoint,
  diagramPointFromAngle,
  diagramRadiusForFace,
  formatEngravingLocation,
} from "@/features/builder/geometry/engraving-placement";
import type { EngravingFace } from "@/features/builder/types";
import { Label } from "@/components/ui/label";

interface EngravingSelectorProps {
  value: string;
  angle: number;
  face: EngravingFace;
  onTextChange: (text: string) => void;
  onAngleChange: (angle: number) => void;
  onFaceChange: (face: EngravingFace) => void;
}

export function EngravingSelector({
  value,
  angle,
  face,
  onTextChange,
  onAngleChange,
  onFaceChange,
}: EngravingSelectorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const trackRadius = diagramRadiusForFace(face);
  const marker = diagramPointFromAngle(angle, trackRadius);
  const hasText = value.trim().length > 0;

  const updateAngleFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = ENGRAVING_RING_DIAGRAM.center * 2 / rect.width;
      const scaleY = ENGRAVING_RING_DIAGRAM.center * 2 / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      onAngleChange(Math.round(angleFromDiagramPoint(x, y)));
    },
    [onAngleChange],
  );

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    updateAngleFromClient(event.clientX, event.clientY);
  };

  const handlePointerUp = () => setDragging(false);

  return (
    <section className="space-y-5">
      <div>
        <Label htmlFor="engraving" className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">
          Personalisation
        </Label>
        <p className="mt-1 font-serif text-lg text-vault-ivory">Engraving</p>
      </div>

      <input
        id="engraving"
        type="text"
        maxLength={24}
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Initials, date, or word of meaning"
        className="flex h-12 w-full rounded-sm border border-white/[0.08] bg-vault-smoke/40 px-5 text-sm text-vault-ivory placeholder:text-vault-pearl/35 transition-colors focus-visible:border-vault-gold/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-vault-gold/30"
      />
      <p className="text-[11px] tracking-wide text-vault-pearl/40">{value.length}/24 characters</p>

      <div className="space-y-3 border-t border-white/[0.06] pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-vault-ivory">Engraving location</p>
          <div className="flex gap-2">
            {(["inside", "outside"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onFaceChange(option)}
                className={cn(
                  "border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors",
                  face === option
                    ? "border-vault-gold/70 bg-vault-gold/[0.08] text-vault-ivory"
                    : "border-white/[0.08] text-vault-pearl/55 hover:border-vault-gold/30",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "relative rounded-sm border border-white/[0.08] bg-vault-smoke/20 p-3 transition-opacity",
            !hasText && "pointer-events-none opacity-40",
          )}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 200 200"
            className="mx-auto block w-full max-w-[220px] touch-none select-none"
            onPointerDown={(event) => {
              if (!hasText) return;
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
            {/* 12 o'clock stone marker */}
            <circle cx={100} cy={28} r={5} fill="rgba(201,169,98,0.55)" />
            <text x={100} y={18} textAnchor="middle" fill="rgba(201,169,98,0.6)" fontSize="8">
              STONE
            </text>
            {/* Draggable engraving marker */}
            <g transform={`translate(${marker.x} ${marker.y})`} className="pointer-events-none">
              <circle r="9" fill="rgba(201,169,98,0.9)" stroke="#070707" strokeWidth="2" />
              <text
                y="3"
                textAnchor="middle"
                fill="#070707"
                fontSize="8"
                fontWeight="bold"
                pointerEvents="none"
              >
                A
              </text>
            </g>
          </svg>
          <p className="mt-2 text-center text-[11px] text-vault-pearl/45">
            Drag or tap around the ring to set placement
          </p>
        </div>

        <p className="text-sm text-vault-gold">
          {hasText ? formatEngravingLocation(angle, face) : "Enter text to place engraving"}
        </p>
      </div>
    </section>
  );
}
