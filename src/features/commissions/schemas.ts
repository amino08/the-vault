import { z } from "zod";
import { PIECE_TYPES, STORY_TYPES } from "@/config/commission-status";

const metalIds = ["yellow_gold", "white_gold", "rose_gold", "platinum"] as const;
const stoneIds = ["diamond", "sapphire", "ruby", "emerald", "black_diamond"] as const;
const bandStyleIds = [
  "classic_solitaire",
  "cathedral",
  "knife_edge",
  "comfort_fit",
  "half_eternity",
  "split_shank",
  "twisted_band",
  "pave_band",
] as const;
const stoneShapeIds = [
  "round_brilliant",
  "oval",
  "cushion",
  "emerald_cut",
  "radiant",
  "pear",
  "marquise",
  "princess",
  "asscher",
] as const;

const bandWidthMmValues = [1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8] as const;

export const ringBuilderConfigSchema = z.object({
  builder: z.literal("ring"),
  version: z.literal("0.1.0"),
  metal: z.enum(metalIds),
  stone: z.enum(stoneIds),
  stoneEnabled: z.boolean(),
  stoneSize: z.number().min(0.6).max(1.8),
  bandStyle: z.enum(bandStyleIds),
  stoneShape: z.enum(stoneShapeIds),
  ringSize: z
    .number()
    .min(4)
    .max(14)
    .refine((v) => Math.abs(v * 2 - Math.round(v * 2)) < 0.001, {
      message: "Ring size must be in half-size steps",
    })
    .default(7),
  bandWidth: z
    .number()
    .refine((v) => bandWidthMmValues.some((option) => Math.abs(option - v) < 0.001), {
      message: "Invalid band width",
    })
    .default(2.5),
  haloStyle: z.enum(["none", "classic", "hidden"]).default("none"),
  prongStyle: z
    .enum(["four_prong", "six_prong", "double_prong", "bezel", "basket"])
    .default("four_prong"),
  sideStoneStyle: z
    .enum([
      "none",
      "two_side_stones",
      "three_stone_ring",
      "tapered_baguettes",
      "pear_side_stones",
      "trillion_side_stones",
    ])
    .default("none"),
  engraving: z.string().max(24),
  engravingAngle: z.number().min(0).max(360).default(180),
  engravingFace: z.enum(["inside", "outside"]).default("inside"),
  accentStones: z
    .array(
      z.object({
        id: z.string(),
        stone: z.enum(stoneIds),
        angle: z.number().min(0).max(360),
      }),
    )
    .max(6)
    .default([]),
});

export const createCommissionSchema = z
  .object({
    title: z.string().min(3, "Title is required"),
    story_type: z.enum(STORY_TYPES),
    piece_type: z.enum(PIECE_TYPES),
    story_narrative: z.string().min(20, "Tell us more about your story"),
    builder_config: ringBuilderConfigSchema.optional(),
  })
  .refine((data) => data.piece_type !== "ring" || data.builder_config !== undefined, {
    message: "Ring configuration is required",
    path: ["builder_config"],
  });

export const createRingCommissionSchema = z.object({
  title: z.string().min(3, "Title is required"),
  story_type: z.enum(STORY_TYPES),
  piece_type: z.literal("ring"),
  story_narrative: z.string().min(20, "Tell us more about your story"),
  builder_config: ringBuilderConfigSchema,
});

export type CreateCommissionInput = z.infer<typeof createCommissionSchema>;
export type CreateRingCommissionInput = z.infer<typeof createRingCommissionSchema>;
export type RingBuilderConfigInput = z.infer<typeof ringBuilderConfigSchema>;

export const saveDesignDraftSchema = z.object({
  draft_id: z.string().uuid().optional(),
  title: z.string().max(120).optional(),
  story_type: z.enum(STORY_TYPES).optional(),
  story_narrative: z.string().max(5000).optional(),
  builder_config: ringBuilderConfigSchema,
});

export const beginCommissionSchema = createRingCommissionSchema.extend({
  draft_id: z.string().uuid().optional(),
});

export type SaveDesignDraftInput = z.infer<typeof saveDesignDraftSchema>;
export type BeginCommissionInput = z.infer<typeof beginCommissionSchema>;
