/**
 * Centralized editorial image registry for The Vault.
 *
 * Replace `src: null` entries with paths under `/public/images/editorial/`
 * once photography is ready. Components consume this registry only —
 * do not scatter image paths across pages.
 *
 * TODO(asset): Add final photography to public/images/editorial/
 */

export type EditorialImageTheme =
  | "hero-presentation"
  | "hero-craftsmanship"
  | "process-consultation"
  | "process-design"
  | "process-cad"
  | "process-craftsmanship"
  | "process-delivery"
  | "create-atelier"
  | "collection-engagement"
  | "collection-anniversary"
  | "collection-legacy"
  | "collection-signet"
  | "collection-bespoke"
  | "milestone-engagement"
  | "milestone-legacy"
  | "milestone-achievement"
  | "marriage-commitment";

export interface EditorialImageAsset {
  id: string;
  /** null = render luxury CSS placeholder until asset is supplied */
  src: string | null;
  alt: string;
  theme: EditorialImageTheme;
  /** Photographer or art direction note for future shoots */
  shootNote?: string;
}

export const editorialImages = {
  hero: {
    id: "hero-main",
    // TODO(asset): Ring in luxury presentation box — hero, 16:10, warm studio light
    src: null,
    alt: "A bespoke ring resting in an open luxury presentation box on ivory silk",
    theme: "hero-presentation",
    shootNote: "Presentation box, soft directional light, cream and gold palette",
  },
  heroAccent: {
    id: "hero-accent",
    // TODO(asset): Diamond close-up or goldsmith hands at bench
    src: null,
    alt: "Close detail of a diamond held in gold tweezers under atelier lighting",
    theme: "hero-craftsmanship",
    shootNote: "Macro diamond or bench detail, shallow depth of field",
  },
  process: {
    consultation: {
      id: "process-consultation",
      src: null,
      alt: "Private consultation in a quiet salon with design sketches on the table",
      theme: "process-consultation",
      shootNote: "Intimate consultation setting, no faces required",
    },
    design: {
      id: "process-design",
      src: null,
      alt: "Hand-drawn jewelry sketches beside gemstone samples",
      theme: "process-design",
      shootNote: "Sketchbook, pencil renderings, stone trays",
    },
    cad: {
      id: "process-cad",
      src: null,
      alt: "CAD model of a ring on a designer's screen in the atelier",
      theme: "process-cad",
      shootNote: "Screen glow, ring wireframe or render on monitor",
    },
    craftsmanship: {
      id: "process-craftsmanship",
      src: null,
      alt: "Goldsmith shaping a ring at a traditional jeweler's bench",
      theme: "process-craftsmanship",
      shootNote: "Bench tools, flame or filing, hands only",
    },
    delivery: {
      id: "process-delivery",
      src: null,
      alt: "Finished ring presented in a velvet-lined commission case",
      theme: "process-delivery",
      shootNote: "Unboxing moment, velvet interior, soft light",
    },
  },
  createBanner: {
    id: "create-atelier",
    // TODO(asset): Gemstone trays or goldsmith workspace — wide banner crop
    src: null,
    alt: "Gemstone trays and jeweler's tools arranged on a warm atelier workbench",
    theme: "create-atelier",
    shootNote: "Wide crop, subtle — supports configurator, does not compete",
  },
  collection: {
    engagement: {
      id: "collection-engagement",
      src: null,
      alt: "Platinum engagement ring with a single emerald-cut diamond",
      theme: "collection-engagement",
    },
    anniversary: {
      id: "collection-anniversary",
      src: null,
      alt: "Eternity band with pavé diamonds in warm yellow gold",
      theme: "collection-anniversary",
    },
    legacy: {
      id: "collection-legacy",
      src: null,
      alt: "Heirloom signet ring passed between generations on linen",
      theme: "collection-legacy",
    },
    signet: {
      id: "collection-signet",
      src: null,
      alt: "Custom signet ring with engraved family crest in deep relief",
      theme: "collection-signet",
    },
    bespoke: {
      id: "collection-bespoke",
      src: null,
      alt: "One-of-a-kind sculptural ring with an unusual center stone",
      theme: "collection-bespoke",
    },
  },
  milestones: {
    engagement: {
      id: "milestone-engagement",
      src: null,
      alt: "Two hands meeting over a commission ring at a milestone moment",
      theme: "milestone-engagement",
    },
    legacy: {
      id: "milestone-legacy",
      src: null,
      alt: "An heirloom ring beside a handwritten letter on cream paper",
      theme: "milestone-legacy",
    },
    achievement: {
      id: "milestone-achievement",
      src: null,
      alt: "A bespoke piece marking a personal transformation, displayed on velvet",
      theme: "milestone-achievement",
    },
  },
  /** Full-width homepage editorial — Marriage & Commitment */
  marriageCommitment: {
    id: "marriage-commitment-hero",
    // TODO(asset): Add public/images/vault/marriage-commitment-hero.jpg
    src: null,
    alt: "A bespoke engagement ring at a private milestone moment — marriage and commitment",
    theme: "marriage-commitment",
    shootNote: "Full-width 21:9 crop, warm light, Enter Aevum palette, no stock feel",
  },
} as const satisfies Record<string, EditorialImageAsset | Record<string, EditorialImageAsset>>;
