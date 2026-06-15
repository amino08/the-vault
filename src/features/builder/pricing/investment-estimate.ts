import type {
  BandStyleId,
  BandWidthMm,
  HaloStyleId,
  MetalId,
  RingBuilderConfig,
  SideStoneStyleId,
  StoneId,
} from "@/features/builder/types";

export interface InvestmentEstimate {
  lowCents: number;
  highCents: number;
}

export const INVESTMENT_ESTIMATE_DISCLAIMER =
  "Estimated investment only. Final pricing provided after consultation and stone sourcing.";

/** Bespoke atelier base — design, bench labor, standard solitaire-ready mounting. */
const BASE_ATELIER_CENTS: InvestmentEstimate = { lowCents: 280_000, highCents: 360_000 };

/** Band-only commissions (no center stone). */
const BASE_BAND_ONLY_CENTS: InvestmentEstimate = { lowCents: 200_000, highCents: 280_000 };

/** Center-stone allowance at 1.0× scale (diamond reference). */
const CENTER_STONE_DIAMOND_CENTS: InvestmentEstimate = { lowCents: 140_000, highCents: 220_000 };

type DeltaTable<T extends string> = Record<T, InvestmentEstimate>;

const METAL_DELTAS: DeltaTable<MetalId> = {
  yellow_gold: { lowCents: 0, highCents: 0 },
  white_gold: { lowCents: 20_000, highCents: 30_000 },
  rose_gold: { lowCents: 10_000, highCents: 20_000 },
  platinum: { lowCents: 80_000, highCents: 120_000 },
};

const STONE_TYPE_DELTAS: DeltaTable<StoneId> = {
  diamond: { lowCents: 0, highCents: 0 },
  sapphire: { lowCents: -60_000, highCents: -40_000 },
  ruby: { lowCents: -50_000, highCents: -30_000 },
  emerald: { lowCents: -40_000, highCents: -20_000 },
  black_diamond: { lowCents: 20_000, highCents: 40_000 },
};

const BAND_STYLE_DELTAS: DeltaTable<BandStyleId> = {
  classic_solitaire: { lowCents: 0, highCents: 0 },
  cathedral: { lowCents: 15_000, highCents: 25_000 },
  knife_edge: { lowCents: 10_000, highCents: 17_500 },
  comfort_fit: { lowCents: 5_000, highCents: 10_000 },
  half_eternity: { lowCents: 60_000, highCents: 90_000 },
  split_shank: { lowCents: 20_000, highCents: 35_000 },
  twisted_band: { lowCents: 17_500, highCents: 30_000 },
  pave_band: { lowCents: 80_000, highCents: 120_000 },
};

const BAND_WIDTH_DELTAS: Record<BandWidthMm, InvestmentEstimate> = {
  1.5: { lowCents: -10_000, highCents: -15_000 },
  2: { lowCents: -5_000, highCents: -7_500 },
  2.5: { lowCents: 0, highCents: 0 },
  3: { lowCents: 5_000, highCents: 7_500 },
  3.5: { lowCents: 10_000, highCents: 15_000 },
  4: { lowCents: 15_000, highCents: 22_500 },
  5: { lowCents: 25_000, highCents: 37_500 },
  6: { lowCents: 35_000, highCents: 52_500 },
  7: { lowCents: 45_000, highCents: 67_500 },
  8: { lowCents: 55_000, highCents: 82_500 },
};

const HALO_DELTAS: DeltaTable<HaloStyleId> = {
  none: { lowCents: 0, highCents: 0 },
  classic: { lowCents: 40_000, highCents: 65_000 },
  hidden: { lowCents: 30_000, highCents: 50_000 },
};

const SIDE_STONE_DELTAS: DeltaTable<SideStoneStyleId> = {
  none: { lowCents: 0, highCents: 0 },
  two_side_stones: { lowCents: 60_000, highCents: 95_000 },
  three_stone_ring: { lowCents: 90_000, highCents: 140_000 },
  tapered_baguettes: { lowCents: 75_000, highCents: 110_000 },
  pear_side_stones: { lowCents: 85_000, highCents: 125_000 },
  trillion_side_stones: { lowCents: 80_000, highCents: 120_000 },
};

const ACCENT_STONE_DELTAS: DeltaTable<StoneId> = {
  diamond: { lowCents: 25_000, highCents: 40_000 },
  sapphire: { lowCents: 18_000, highCents: 28_000 },
  ruby: { lowCents: 20_000, highCents: 32_000 },
  emerald: { lowCents: 19_000, highCents: 30_000 },
  black_diamond: { lowCents: 28_000, highCents: 45_000 },
};

const STONE_SIZE_REFERENCE = 1.0;

function addDelta(total: InvestmentEstimate, delta: InvestmentEstimate): InvestmentEstimate {
  return {
    lowCents: total.lowCents + delta.lowCents,
    highCents: total.highCents + delta.highCents,
  };
}

/** ± per 0.1 carat-equivalent from reference size 1.0× */
function stoneSizeDelta(stoneSize: number): InvestmentEstimate {
  const steps = (stoneSize - STONE_SIZE_REFERENCE) / 0.1;
  return {
    lowCents: Math.round(steps * 40_000),
    highCents: Math.round(steps * 60_000),
  };
}

function roundToNearestHundredDollars(cents: number): number {
  return Math.round(cents / 10_000) * 10_000;
}

function finalizeEstimate(total: InvestmentEstimate): InvestmentEstimate {
  const lowCents = roundToNearestHundredDollars(Math.max(total.lowCents, 150_000));
  const highCents = roundToNearestHundredDollars(Math.max(total.highCents, lowCents + 50_000));
  return { lowCents, highCents };
}

/**
 * Rule-based luxury investment range.
 * Default config (yellow gold, diamond 1.0×, classic solitaire, 2.5 mm) ≈ $4,200 – $5,800.
 */
export function estimateRingInvestment(config: RingBuilderConfig): InvestmentEstimate {
  let total: InvestmentEstimate = config.stoneEnabled
    ? { ...BASE_ATELIER_CENTS }
    : { ...BASE_BAND_ONLY_CENTS };

  total = addDelta(total, METAL_DELTAS[config.metal]);
  total = addDelta(total, BAND_STYLE_DELTAS[config.bandStyle]);
  total = addDelta(total, BAND_WIDTH_DELTAS[config.bandWidth]);

  if (config.stoneEnabled) {
    total = addDelta(total, CENTER_STONE_DIAMOND_CENTS);
    total = addDelta(total, STONE_TYPE_DELTAS[config.stone]);
    total = addDelta(total, stoneSizeDelta(config.stoneSize));
    total = addDelta(total, HALO_DELTAS[config.haloStyle]);
    total = addDelta(total, SIDE_STONE_DELTAS[config.sideStoneStyle]);
  }

  for (const accent of config.accentStones) {
    total = addDelta(total, ACCENT_STONE_DELTAS[accent.stone]);
  }

  return finalizeEstimate(total);
}
