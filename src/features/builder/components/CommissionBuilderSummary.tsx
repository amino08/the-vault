"use client";

import { getMetalPreset, getStonePreset } from "@/features/builder/constants";
import { getBandStylePreset, getHaloStylePreset, getProngStylePreset, getSideStoneStylePreset, getStoneShapePreset } from "@/features/builder/style-presets";
import { formatAccentStoneLocation } from "@/features/builder/geometry/accent-stone-placement";
import { formatEngravingLocation } from "@/features/builder/geometry/engraving-placement";
import {
  isRingBuilderConfig,
  resolveAccentStones,
  resolveBandStyle,
  resolveBandWidthMm,
  resolveHaloStyle,
  resolveProngStyle,
  resolveSideStoneStyle,
  resolveEngravingAngle,
  resolveEngravingFace,
  resolveRingSize,
  resolveStoneShape,
  formatRingSize,
  formatBandWidth,
} from "@/features/builder/types";

interface CommissionBuilderSummaryProps {
  builderConfig: Record<string, unknown>;
}

export function CommissionBuilderSummary({ builderConfig }: CommissionBuilderSummaryProps) {
  if (!isRingBuilderConfig(builderConfig)) return null;

  const metal = getMetalPreset(builderConfig.metal);
  const stone = getStonePreset(builderConfig.stone);
  const bandStyle = getBandStylePreset(resolveBandStyle(builderConfig.bandStyle));
  const stoneShape = getStoneShapePreset(resolveStoneShape(builderConfig.stoneShape));
  const haloStyle = getHaloStylePreset(resolveHaloStyle(builderConfig.haloStyle));
  const prongStyle = getProngStylePreset(resolveProngStyle(builderConfig.prongStyle));
  const sideStoneStyle = getSideStoneStylePreset(
    resolveSideStoneStyle(builderConfig.sideStoneStyle, builderConfig),
  );
  const accentStones = resolveAccentStones(builderConfig.accentStones);

  return (
    <div className="mb-8 border border-white/5 bg-vault-charcoal p-8">
      <p className="mb-4 text-xs uppercase tracking-luxury text-vault-gold">Ring Configuration</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-vault-pearl/50">Metal</dt>
          <dd className="text-sm text-vault-ivory">{metal.label}</dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Band Style</dt>
          <dd className="text-sm text-vault-ivory">{bandStyle.label}</dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Ring Size</dt>
          <dd className="text-sm text-vault-ivory">
            {formatRingSize(resolveRingSize(builderConfig.ringSize))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Band Width</dt>
          <dd className="text-sm text-vault-ivory">
            {formatBandWidth(resolveBandWidthMm(builderConfig.bandWidth))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Halo Setting</dt>
          <dd className="text-sm text-vault-ivory">
            {builderConfig.stoneEnabled ? haloStyle.label : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Prong Style</dt>
          <dd className="text-sm text-vault-ivory">
            {builderConfig.stoneEnabled ? prongStyle.label : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Side Stones</dt>
          <dd className="text-sm text-vault-ivory">
            {builderConfig.stoneEnabled ? sideStoneStyle.label : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-vault-pearl/50">Stone</dt>
          <dd className="text-sm text-vault-ivory">
            {builderConfig.stoneEnabled ? stone.label : "None"}
          </dd>
        </div>
        {builderConfig.stoneEnabled && (
          <>
            <div>
              <dt className="text-xs text-vault-pearl/50">Stone Shape</dt>
              <dd className="text-sm text-vault-ivory">{stoneShape.label}</dd>
            </div>
            <div>
              <dt className="text-xs text-vault-pearl/50">Stone Size</dt>
              <dd className="text-sm text-vault-ivory">
                {(typeof builderConfig.stoneSize === "number" ? builderConfig.stoneSize : 1).toFixed(1)}×
              </dd>
            </div>
          </>
        )}
        {accentStones.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-vault-pearl/50">Accent Stones</dt>
            <dd className="mt-1 space-y-1 text-sm text-vault-ivory">
              {accentStones.map((placement, index) => {
                const accent = getStonePreset(placement.stone);
                return (
                  <p key={placement.id}>
                    {index + 1}. {accent.label} — {formatAccentStoneLocation(placement.angle)}
                  </p>
                );
              })}
            </dd>
          </div>
        )}
        {builderConfig.engraving.trim() && (
          <>
            <div className="sm:col-span-2">
              <dt className="text-xs text-vault-pearl/50">Engraving</dt>
              <dd className="font-serif text-sm italic text-vault-ivory">
                &ldquo;{builderConfig.engraving}&rdquo;
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-vault-pearl/50">Engraving Location</dt>
              <dd className="text-sm text-vault-ivory">
                {formatEngravingLocation(
                  resolveEngravingAngle(builderConfig.engravingAngle),
                  resolveEngravingFace(builderConfig.engravingFace),
                )}
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
