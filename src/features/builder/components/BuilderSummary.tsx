"use client";

import { getMetalPreset, getStonePreset } from "@/features/builder/constants";
import { getBandStylePreset, getHaloStylePreset, getProngStylePreset, getSideStoneStylePreset, getStoneShapePreset } from "@/features/builder/style-presets";
import { formatAccentStoneLocation } from "@/features/builder/geometry/accent-stone-placement";
import { formatEngravingLocation } from "@/features/builder/geometry/engraving-placement";
import type { RingBuilderConfig } from "@/features/builder/types";
import { formatRingSize } from "@/features/builder/types";
import { formatBandWidth } from "@/features/builder/types";
import { STORY_TYPE_LABELS, type StoryType } from "@/config/commission-status";
import type { InvestmentEstimate } from "@/features/builder/pricing/investment-estimate";
import { formatInvestmentRange } from "@/features/builder/pricing/format-investment";

interface BuilderSummaryProps {
  config: RingBuilderConfig;
  title: string;
  storyType: string;
  investmentEstimate: InvestmentEstimate;
}

export function BuilderSummary({ config, title, storyType, investmentEstimate }: BuilderSummaryProps) {
  const metal = getMetalPreset(config.metal);
  const stone = getStonePreset(config.stone);
  const bandStyle = getBandStylePreset(config.bandStyle);
  const stoneShape = getStoneShapePreset(config.stoneShape);
  const haloStyle = getHaloStylePreset(config.haloStyle);
  const prongStyle = getProngStylePreset(config.prongStyle);
  const sideStoneStyle = getSideStoneStylePreset(config.sideStoneStyle);

  const rows: { label: string; value: string }[] = [
    { label: "Estimated Investment", value: formatInvestmentRange(investmentEstimate) },
    { label: "Commission", value: "Bespoke Ring" },
    { label: "Metal", value: metal.label },
    { label: "Band Style", value: bandStyle.label },
    { label: "Ring Size", value: formatRingSize(config.ringSize) },
    { label: "Band Width", value: formatBandWidth(config.bandWidth) },
    {
      label: "Halo Setting",
      value: config.stoneEnabled ? haloStyle.label : "—",
    },
    {
      label: "Prong Style",
      value: config.stoneEnabled ? prongStyle.label : "—",
    },
    {
      label: "Side Stones",
      value: config.stoneEnabled ? sideStoneStyle.label : "—",
    },
    {
      label: "Center Stone",
      value: config.stoneEnabled ? stone.label : "None — band only",
    },
    {
      label: "Stone Shape",
      value: config.stoneEnabled ? stoneShape.label : "—",
    },
    {
      label: "Stone Size",
      value: config.stoneEnabled ? `${config.stoneSize.toFixed(1)}×` : "—",
    },
    {
      label: "Accent Stones",
      value:
        config.accentStones.length > 0
          ? `${config.accentStones.length} stone${config.accentStones.length > 1 ? "s" : ""}`
          : "None",
    },
    ...(config.accentStones.length > 0
      ? config.accentStones.map((placement, index) => {
          const accent = getStonePreset(placement.stone);
          return {
            label: `Accent ${index + 1}`,
            value: `${accent.label} · ${formatAccentStoneLocation(placement.angle)}`,
          };
        })
      : []),
    {
      label: "Engraving",
      value: config.engraving.trim() ? config.engraving : "Not specified",
    },
    ...(config.engraving.trim()
      ? [
          {
            label: "Engraving Location",
            value: formatEngravingLocation(config.engravingAngle, config.engravingFace),
          },
        ]
      : []),
    { label: "Story Type", value: STORY_TYPE_LABELS[storyType as StoryType] ?? storyType },
    { label: "Working Title", value: title.trim() || "Pending" },
  ];

  return (
    <aside className="border border-vault-gold/25 bg-gradient-to-b from-vault-charcoal/90 to-vault-black/80 p-8 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]">
      <div className="mb-6 border-b border-vault-gold/15 pb-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Executive Summary</p>
        <p className="mt-2 font-serif text-xl text-vault-ivory">Your Configuration</p>
      </div>
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0">
            <dt className="text-[11px] uppercase tracking-wider text-vault-pearl/45">{row.label}</dt>
            <dd className="text-right text-sm font-medium text-vault-ivory">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
