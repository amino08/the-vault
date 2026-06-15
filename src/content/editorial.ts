import type { EditorialImageAsset } from "@/content/editorial-images";
import { editorialImages } from "@/content/editorial-images";

export const editorialHero = {
  eyebrow: "Enter Aevum · Custom Commission Platform",
  headline: "Commissioned For Your Story.\nCrafted For Generations.",
  subheadline:
    "Design a one-of-a-kind piece built around your milestones, relationships, achievements, and legacy.",
  supportCopy:
    "Configure metal, stones, halo, band, and prongs in real time — then begin your private commission when the story is clear. Nothing here exists until you create it.",
} as const;

export const vaultPurpose = {
  eyebrow: "Why The Vault exists",
  title: "Meaningful jewelry for moments that deserve permanence",
  body: "Enter Aevum created The Vault for clients who want more than a purchase — they want a piece that holds weight. Every commission is private, narrative-led, and built to outlast the moment it celebrates.",
} as const;

export type ProcessStage = {
  step: number;
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  image: EditorialImageAsset;
};

export const processStages: ProcessStage[] = [
  {
    step: 1,
    eyebrow: "Consultation",
    title: "Your story, in confidence",
    body: "We begin with a private conversation — the person, the moment, the symbolism. Not a sales call. A design intake shaped around what the piece needs to carry forward.",
    image: editorialImages.process.consultation,
  },
  {
    step: 2,
    eyebrow: "Design",
    title: "Form follows meaning",
    body: "Metal, proportion, stone character, and setting language are chosen to serve the narrative. Sketches and direction precede any digital model — the story leads, always.",
    image: editorialImages.process.design,
  },
  {
    step: 3,
    eyebrow: "CAD Development",
    title: "The piece becomes visible",
    body: "You review proportions, materials, and presence in our atelier configurator — a living reference for scale and character before anything is cast or set.",
    note: "The 3D preview is a design reference, not the final manufacturing CAD.",
    image: editorialImages.process.cad,
  },
  {
    step: 4,
    eyebrow: "Craftsmanship",
    title: "Bench work with intention",
    body: "Our goldsmiths refine geometry, setting height, prong profile, and wearability — details that only matter when a piece is worn daily or kept for generations.",
    image: editorialImages.process.craftsmanship,
  },
  {
    step: 5,
    eyebrow: "Delivery",
    title: "A modern heirloom, presented",
    body: "The finished commission arrives with care documentation and your private records. Built to be worn, gifted, or handed down — with the story intact.",
    image: editorialImages.process.delivery,
  },
];

export type CollectionCategory =
  | "Engagement"
  | "Anniversary"
  | "Legacy"
  | "Signet"
  | "Bespoke Creations";

export type CollectionPiece = {
  id: string;
  category: CollectionCategory;
  title: string;
  story: string;
  image: EditorialImageAsset;
};

export const vaultCollection: CollectionPiece[] = [
  {
    id: "solstice-vow",
    category: "Engagement",
    title: "The Solstice Vow",
    story: "Platinum and emerald-cut diamond — commissioned for a proposal twenty years in the making.",
    image: editorialImages.collection.engagement,
  },
  {
    id: "twenty-rings",
    category: "Anniversary",
    title: "Twenty Rings",
    story: "A continuous pavé band — one diamond for each year, reset once for the next chapter.",
    image: editorialImages.collection.anniversary,
  },
  {
    id: "crest-line",
    category: "Legacy",
    title: "The Crest Line",
    story: "Three generations, one crest — reimagined in 18k gold for a daughter's thirtieth.",
    image: editorialImages.collection.legacy,
  },
  {
    id: "north-signet",
    category: "Signet",
    title: "North Signet",
    story: "Deep-relief engraving of a family monogram, worn daily since the founder's retirement.",
    image: editorialImages.collection.signet,
  },
  {
    id: "threshold-ring",
    category: "Bespoke Creations",
    title: "Threshold",
    story: "A sculptural center stone marking 100 pounds lost — the client's word, not ours, on the inside band.",
    image: editorialImages.collection.bespoke,
  },
];

export const milestoneStories = [
  {
    title: "Marriage & commitment",
    body: "An engagement is not an transaction. It is a vow made visible — proportion, stone, and setting chosen to echo a relationship's particular language.",
    image: editorialImages.milestones.engagement,
  },
  {
    title: "Legacy & lineage",
    body: "Some commissions reframe a family crest. Others translate a grandmother's ring into a form a granddaughter will actually wear. The thread continues.",
    image: editorialImages.milestones.legacy,
  },
  {
    title: "Achievement & transformation",
    body: "Weight lost, companies built, battles won quietly — milestones that deserve more than a certificate. A piece that says: this happened, and it mattered.",
    image: editorialImages.milestones.achievement,
  },
] as const;

export const createAtmosphere = {
  eyebrow: "Private Atelier",
  line: "Every commission begins at the bench — configure yours when the story is ready.",
  image: editorialImages.createBanner,
} as const;

export const editorialQuote = {
  text: "We do not sell jewelry. We immortalize chapters.",
  attribution: "The Vault by Enter Aevum",
} as const;
