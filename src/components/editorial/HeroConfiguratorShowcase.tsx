"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
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
      <span className="sr-only">Preparing atelier view</span>
    </div>
  );
}

const RingPreview = dynamic(
  () => import("@/features/builder/components/RingPreview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  },
);

const HERO_STONES: StoneId[] = ["diamond", "sapphire", "ruby", "emerald"];
const HERO_BANDS: BandStyleId[] = ["classic_solitaire", "cathedral", "pave_band"];
const HERO_HALOS: HaloStyleId[] = ["none", "classic", "hidden"];
const HERO_PRONGS: ProngStyleId[] = ["four_prong", "six_prong", "bezel"];
const HERO_SIDE_STONES: SideStoneStyleId[] = ["none", "two_side_stones", "three_stone_ring"];

function CueChip<T extends string>({
  option,
  active,
  onSelect,
}: {
  option: { id: T; label: string; swatch?: string };
  active: boolean;
  onSelect: (id: T) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={option.label}
      title={option.label}
      onClick={() => onSelect(option.id)}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center border px-2 transition-colors",
        option.swatch ? "gap-1.5" : "px-2.5 text-[10px] tracking-wide",
        active
          ? "border-vault-gold/50 bg-vault-gold/10 text-vault-ink"
          : "border-vault-forest/10 bg-vault-ivory/80 text-vault-muted hover:border-vault-gold/35",
      )}
    >
      {option.swatch ? (
        <span
          className="h-3 w-3 shrink-0 rounded-full border border-vault-forest/10"
          style={{ backgroundColor: option.swatch }}
          aria-hidden
        />
      ) : (
        <span className="truncate">{option.label}</span>
      )}
    </button>
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
    label: b.label.split(" ")[0],
  }));

  const haloOptions = HALO_STYLE_PRESETS.filter((h) => HERO_HALOS.includes(h.id)).map((h) => ({
    id: h.id,
    label: h.label.replace(" Halo", "").replace("No", "None"),
  }));

  const prongOptions = PRONG_STYLE_PRESETS.filter((p) => HERO_PRONGS.includes(p.id)).map((p) => ({
    id: p.id,
    label: p.label,
  }));

  const sideStoneOptions = SIDE_STONE_STYLE_PRESETS.filter((s) =>
    HERO_SIDE_STONES.includes(s.id),
  ).map((s) => ({ id: s.id, label: s.label.split(" ")[0] }));

  return (
    <div className="hero-showroom">
      <div className="hero-showroom-stage">
        <RingPreview config={config} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="hero-showroom-cues" aria-label="Customize your ring">
        <div className="hero-showroom-cue-row">
          {metalOptions.map((o) => (
            <CueChip key={o.id} option={o} active={config.metal === o.id} onSelect={(id) => patch({ metal: id })} />
          ))}
          {stoneOptions.map((o) => (
            <CueChip key={o.id} option={o} active={config.stone === o.id} onSelect={(id) => patch({ stone: id })} />
          ))}
        </div>
        <div className="hero-showroom-cue-row">
          {haloOptions.map((o) => (
            <CueChip key={o.id} option={o} active={config.haloStyle === o.id} onSelect={(id) => patch({ haloStyle: id })} />
          ))}
          {bandOptions.map((o) => (
            <CueChip key={o.id} option={o} active={config.bandStyle === o.id} onSelect={(id) => patch({ bandStyle: id })} />
          ))}
          {prongOptions.map((o) => (
            <CueChip key={o.id} option={o} active={config.prongStyle === o.id} onSelect={(id) => patch({ prongStyle: id })} />
          ))}
          {sideStoneOptions.map((o) => (
            <CueChip
              key={o.id}
              option={o}
              active={config.sideStoneStyle === o.id}
              onSelect={(id) => patch({ sideStoneStyle: id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
