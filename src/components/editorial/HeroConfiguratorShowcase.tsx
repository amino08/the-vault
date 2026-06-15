"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { METAL_PRESETS, STONE_PRESETS } from "@/features/builder/constants";
import {
  BAND_STYLE_PRESETS,
  HALO_STYLE_PRESETS,
  PRONG_STYLE_PRESETS,
  SIDE_STONE_STYLE_PRESETS,
} from "@/features/builder/style-presets";
import {
  DEFAULT_RING_BUILDER_CONFIG,
  type BandStyleId,
  type HaloStyleId,
  type MetalId,
  type ProngStyleId,
  type RingBuilderConfig,
  type SideStoneStyleId,
  type StoneId,
} from "@/features/builder/types";

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#070707]">
      <p className="text-[10px] uppercase tracking-[0.28em] text-vault-pearl/35">
        Preparing atelier view
      </p>
    </div>
  );
}

/** Same safe dynamic pattern as RingConfigurator — single client boundary, no nested imports. */
const RingPreview = dynamic(
  () => import("@/features/builder/components/RingPreview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  },
);

const HERO_STONES: StoneId[] = ["diamond", "sapphire", "ruby", "emerald"];
const HERO_BANDS: BandStyleId[] = [
  "classic_solitaire",
  "cathedral",
  "pave_band",
  "half_eternity",
];
const HERO_HALOS: HaloStyleId[] = ["none", "classic", "hidden"];
const HERO_PRONGS: ProngStyleId[] = ["four_prong", "six_prong", "bezel"];
const HERO_SIDE_STONES: SideStoneStyleId[] = ["none", "two_side_stones", "three_stone_ring"];

interface CueRowProps<T extends string> {
  label: string;
  value: T;
  options: { id: T; label: string; swatch?: string }[];
  onChange: (id: T) => void;
}

function CueRow<T extends string>({ label, value, options, onChange }: CueRowProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.22em] text-vault-muted-light">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition-colors",
                active
                  ? "border-vault-forest/30 bg-vault-forest/10 text-vault-ink"
                  : "border-vault-forest/10 bg-vault-ivory text-vault-muted hover:border-vault-gold/35 hover:text-vault-ink",
              )}
            >
              {option.swatch && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-vault-forest/15"
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroConfiguratorShowcase() {
  const [config, setConfig] = useState<RingBuilderConfig>(DEFAULT_RING_BUILDER_CONFIG);

  const patch = useCallback((partial: Partial<RingBuilderConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const metalOptions = METAL_PRESETS.map((m) => ({
    id: m.id as MetalId,
    label: m.label,
    swatch: m.color,
  }));

  const stoneOptions = STONE_PRESETS.filter((s) => HERO_STONES.includes(s.id)).map((s) => ({
    id: s.id,
    label: s.label,
    swatch: s.color,
  }));

  const bandOptions = BAND_STYLE_PRESETS.filter((b) => HERO_BANDS.includes(b.id)).map((b) => ({
    id: b.id,
    label: b.label,
  }));

  const haloOptions = HALO_STYLE_PRESETS.filter((h) => HERO_HALOS.includes(h.id)).map((h) => ({
    id: h.id,
    label: h.label,
  }));

  const prongOptions = PRONG_STYLE_PRESETS.filter((p) => HERO_PRONGS.includes(p.id)).map((p) => ({
    id: p.id,
    label: p.label,
  }));

  const sideStoneOptions = SIDE_STONE_STYLE_PRESETS.filter((s) =>
    HERO_SIDE_STONES.includes(s.id),
  ).map((s) => ({ id: s.id, label: s.label }));

  return (
    <div className="hero-showroom">
      <div className="hero-showroom-header">
        <p className="brand-eyebrow-gold text-[10px] tracking-[0.28em]">Live Atelier Preview</p>
        <p className="mt-1 text-xs text-vault-muted">
          Customize metal, stones, and setting — see your commission take shape
        </p>
      </div>

      <div className="hero-showroom-stage">
        <RingPreview config={config} className="absolute inset-0 h-full w-full" />
        <div className="hero-showroom-live-badge" aria-hidden>
          Live
        </div>
      </div>

      <div className="hero-showroom-cues">
        <CueRow label="Metal" value={config.metal} options={metalOptions} onChange={(id) => patch({ metal: id })} />
        <CueRow label="Center Stone" value={config.stone} options={stoneOptions} onChange={(id) => patch({ stone: id })} />
        <CueRow label="Halo" value={config.haloStyle} options={haloOptions} onChange={(id) => patch({ haloStyle: id })} />
        <CueRow
          label="Side Stones"
          value={config.sideStoneStyle}
          options={sideStoneOptions}
          onChange={(id) => patch({ sideStoneStyle: id })}
        />
        <CueRow label="Band Style" value={config.bandStyle} options={bandOptions} onChange={(id) => patch({ bandStyle: id })} />
        <CueRow label="Prongs" value={config.prongStyle} options={prongOptions} onChange={(id) => patch({ prongStyle: id })} />
      </div>

      <Link href={routes.create} className="hero-showroom-link">
        Open full configurator
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
