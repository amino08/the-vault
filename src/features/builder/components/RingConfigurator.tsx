"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  beginCommissionInquiry,
  saveDesignDraft,
} from "@/features/commissions/actions";
import { redirectToCheckoutSafely } from "@/features/commissions/checkout-handoff";
import {
  createRingCommissionSchema,
  type CreateRingCommissionInput,
} from "@/features/commissions/schemas";
import { STORY_TYPES, STORY_TYPE_LABELS, type StoryType } from "@/config/commission-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterialSelector } from "@/features/builder/components/MaterialSelector";
import { StoneSelector } from "@/features/builder/components/StoneSelector";
import { AccentStoneSelector } from "@/features/builder/components/AccentStoneSelector";
import { EngravingSelector } from "@/features/builder/components/EngravingSelector";
import { BandStyleSelector } from "@/features/builder/components/BandStyleSelector";
import { RingSizeSelector } from "@/features/builder/components/RingSizeSelector";
import { BandWidthSelector } from "@/features/builder/components/BandWidthSelector";
import { HaloSettingSelector } from "@/features/builder/components/HaloSettingSelector";
import { ProngStyleSelector } from "@/features/builder/components/ProngStyleSelector";
import { SideStoneStyleSelector } from "@/features/builder/components/SideStoneStyleSelector";
import { StoneShapeSelector } from "@/features/builder/components/StoneShapeSelector";
import { BuilderSummary } from "@/features/builder/components/BuilderSummary";
import { EstimatedInvestment } from "@/features/builder/components/EstimatedInvestment";
import { SaveDraftAuthPrompt } from "@/features/builder/components/SaveDraftAuthPrompt";
import type { RingPreviewHandle } from "@/features/builder/components/ring-preview-types";
import { estimateRingInvestment } from "@/features/builder/pricing/investment-estimate";
import {
  clearPendingRingDraft,
  markPendingRingDraftRestore,
  readPendingRingDraft,
  shouldRestorePendingRingDraft,
  writePendingRingDraft,
} from "@/features/builder/draft-local-storage";
import { isRingBuilderConfig } from "@/features/builder/types";
import type { Commission } from "@/types";
import {
  DEFAULT_RING_BUILDER_CONFIG,
  type BandStyleId,
  type BandWidthMm,
  type HaloStyleId,
  type MetalId,
  type ProngStyleId,
  type SideStoneStyleId,
  type RingBuilderConfig,
  type StoneId,
  type StoneShapeId,
} from "@/features/builder/types";

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#070707]">
      <p className="text-[10px] uppercase tracking-[0.28em] text-vault-pearl/35">Preparing atelier view</p>
    </div>
  );
}

function downloadPreviewBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

const RingPreview = dynamic(
  () => import("@/features/builder/components/RingPreview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  },
);

interface RingConfiguratorProps {
  isAuthenticated: boolean;
  userEmail?: string | null;
  initialDraft?: Commission | null;
  restorePending?: boolean;
}

export function RingConfigurator({
  isAuthenticated,
  initialDraft = null,
  restorePending = false,
}: RingConfiguratorProps) {
  const [pending, startTransition] = useTransition();
  const [savingDraft, startDraftTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [capturingPreview, setCapturingPreview] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [draftId, setDraftId] = useState<string | undefined>(initialDraft?.id);
  const [builder, setBuilder] = useState<RingBuilderConfig>(DEFAULT_RING_BUILDER_CONFIG);
  const previewRef = useRef<RingPreviewHandle>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRingCommissionInput>({
    resolver: zodResolver(createRingCommissionSchema),
    defaultValues: {
      story_type: "milestone",
      piece_type: "ring",
      title: "",
      story_narrative: "",
      builder_config: DEFAULT_RING_BUILDER_CONFIG,
    },
  });

  const title = watch("title");
  const storyType = watch("story_type");
  const storyNarrative = watch("story_narrative");

  const updateBuilder = (patch: Partial<RingBuilderConfig>) => {
    setBuilder((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    setValue("builder_config", builder, { shouldValidate: false });
  }, [builder, setValue]);

  useEffect(() => {
    if (!initialDraft || !isRingBuilderConfig(initialDraft.builder_config)) return;
    setBuilder(initialDraft.builder_config);
    setDraftId(initialDraft.id);
    setValue("title", initialDraft.title);
    setValue("story_type", initialDraft.story_type);
    setValue("story_narrative", initialDraft.story_narrative ?? "");
  }, [initialDraft, setValue]);

  useEffect(() => {
    if (!restorePending && !shouldRestorePendingRingDraft()) return;

    const pending = readPendingRingDraft();
    if (!pending) {
      clearPendingRingDraft();
      return;
    }

    setBuilder(pending.builder);
    setValue("title", pending.title);
    setValue("story_type", pending.storyType as CreateRingCommissionInput["story_type"]);
    setValue("story_narrative", pending.storyNarrative);
    if (pending.draftId) setDraftId(pending.draftId);
    clearPendingRingDraft();
  }, [restorePending, setValue]);

  const investmentEstimate = useMemo(() => estimateRingInvestment(builder), [builder]);

  const persistPendingDraftLocally = () => {
    writePendingRingDraft({
      builder,
      title: title ?? "",
      storyType: storyType ?? "milestone",
      storyNarrative: storyNarrative ?? "",
      draftId,
      savedAt: new Date().toISOString(),
    });
    markPendingRingDraftRestore();
  };

  const handleSaveDraft = () => {
    setServerError(null);
    setDraftMessage(null);

    if (!isAuthenticated) {
      persistPendingDraftLocally();
      setAuthPromptOpen(true);
      return;
    }

    startDraftTransition(async () => {
      try {
        const result = await saveDesignDraft({
          draft_id: draftId,
          title: title?.trim() || undefined,
          story_type: storyType,
          story_narrative: storyNarrative?.trim() || undefined,
          builder_config: builder,
        });

        if (result.error) {
          setServerError(result.error);
          return;
        }

        if (result.data) {
          setDraftId(result.data.id);
          setDraftMessage("Design saved to your account.");
        }
      } catch (draftError) {
        console.error("[RingConfigurator] save draft failed:", draftError);
        setServerError("Could not save your draft. Please try again.");
      }
    });
  };

  const handleBeginCommission = handleSubmit((data) => {
    setServerError(null);
    setDraftMessage(null);

    if (!isAuthenticated) {
      persistPendingDraftLocally();
      setAuthPromptOpen(true);
      return;
    }

    startTransition(async () => {
      try {
        let snapshot: File | null = null;

        try {
          const blob = (await previewRef.current?.captureSnapshot()) ?? null;
          if (blob) {
            snapshot = new File([blob], "builder-snapshot.png", { type: "image/png" });
          }
        } catch (captureError) {
          console.warn("[RingConfigurator] snapshot capture failed:", captureError);
        }

        const result = await beginCommissionInquiry(
          {
            ...data,
            draft_id: draftId,
          },
          snapshot,
        );

        if (result.error) {
          setServerError(result.error);
          return;
        }

        if (!result.data?.commission) {
          setServerError("Commission could not be confirmed. Please check your account or try again.");
          return;
        }

        setDraftMessage("Commission saved. Redirecting to secure checkout...");

        const redirected = redirectToCheckoutSafely(result.data.checkoutUrl);
        if (!redirected) {
          setServerError(
            "Your commission was saved, but we could not open checkout automatically. Visit aevumdigital.co to complete your deposit.",
          );
        }
      } catch (submitError) {
        console.error("[RingConfigurator] begin commission failed:", submitError);
        setServerError(
          "Something went wrong while submitting your commission. Please try again.",
        );
      }
    });
  });

  const handleSavePreview = async () => {
    setPreviewError(null);
    setCapturingPreview(true);

    try {
      if (!previewRef.current?.isReady()) {
        setPreviewError("Preview is still loading. Try again in a moment.");
        return;
      }

      const blob = (await previewRef.current.captureSnapshot()) ?? null;
      if (!blob) {
        setPreviewError("Could not capture the preview. Try again.");
        return;
      }

      downloadPreviewBlob(blob, `vault-ring-preview-${Date.now()}.png`);
    } catch (captureError) {
      console.warn("[RingConfigurator] preview download failed:", captureError);
      setPreviewError("Could not save the preview. Try again.");
    } finally {
      setCapturingPreview(false);
    }
  };

  return (
    <>
      <form onSubmit={handleBeginCommission} className="space-y-8">
        {serverError && (
          <p className="rounded-sm border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {serverError}
          </p>
        )}

        {draftMessage && (
          <p className="rounded-sm border border-vault-gold/30 bg-vault-gold/10 px-4 py-3 text-sm text-vault-gold">
            {draftMessage}
          </p>
        )}

        {!isAuthenticated && (
          <p className="rounded-sm border border-white/10 bg-vault-smoke/40 px-4 py-3 text-sm text-vault-pearl/65">
            Design freely. Sign in when you&apos;re ready to save your draft or begin your commission.
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[7fr_3fr] xl:gap-8">
          <div className="space-y-2 lg:sticky lg:top-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Atelier Preview</p>
              <p className="mt-0.5 font-serif text-lg text-vault-ivory">Live Configuration</p>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-vault-gold/15 bg-[#070707] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(201,169,98,0.06)] max-lg:sticky max-lg:top-20 max-lg:z-10 lg:aspect-auto lg:min-h-[min(440px,48vh)] lg:max-h-[min(560px,58vh)]">
              <RingPreview ref={previewRef} config={builder} className="absolute inset-0 h-full w-full" />
            </div>
            <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-between">
              <p className="text-center text-[10px] tracking-wider text-vault-pearl/35 sm:text-left">
                Drag to inspect · Scroll to zoom
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={capturingPreview}
                onClick={handleSavePreview}
                className="shrink-0 border-vault-gold/30 text-[10px] uppercase tracking-[0.2em]"
              >
                {capturingPreview ? "Capturing..." : "Save Preview"}
              </Button>
            </div>
            {previewError && (
              <p className="text-center text-xs text-red-400 sm:text-right">{previewError}</p>
            )}
          </div>

          <div className="space-y-8 lg:max-h-[min(680px,calc(100vh-6rem))] lg:overflow-y-auto lg:pr-1">
            <MaterialSelector
              value={builder.metal}
              onChange={(metal: MetalId) => updateBuilder({ metal })}
            />

            <BandStyleSelector
              value={builder.bandStyle}
              onChange={(bandStyle: BandStyleId) => updateBuilder({ bandStyle })}
            />

            <RingSizeSelector
              value={builder.ringSize}
              onChange={(ringSize) => updateBuilder({ ringSize })}
            />

            <BandWidthSelector
              value={builder.bandWidth}
              onChange={(bandWidth: BandWidthMm) => updateBuilder({ bandWidth })}
            />

            <HaloSettingSelector
              value={builder.haloStyle}
              disabled={!builder.stoneEnabled}
              onChange={(haloStyle: HaloStyleId) => updateBuilder({ haloStyle })}
            />

            <ProngStyleSelector
              value={builder.prongStyle}
              disabled={!builder.stoneEnabled}
              onChange={(prongStyle: ProngStyleId) => updateBuilder({ prongStyle })}
            />

            <SideStoneStyleSelector
              value={builder.sideStoneStyle}
              disabled={!builder.stoneEnabled}
              onChange={(sideStoneStyle: SideStoneStyleId) => updateBuilder({ sideStoneStyle })}
            />

            <StoneSelector
              value={builder.stone}
              enabled={builder.stoneEnabled}
              stoneSize={builder.stoneSize}
              onStoneChange={(stone: StoneId) => updateBuilder({ stone })}
              onEnabledChange={(stoneEnabled) => updateBuilder({ stoneEnabled })}
              onStoneSizeChange={(stoneSize) => updateBuilder({ stoneSize })}
            />

            <StoneShapeSelector
              value={builder.stoneShape}
              disabled={!builder.stoneEnabled}
              onChange={(stoneShape: StoneShapeId) => updateBuilder({ stoneShape })}
            />

            <AccentStoneSelector
              stones={builder.accentStones}
              onChange={(accentStones) => updateBuilder({ accentStones })}
            />

            <EngravingSelector
              value={builder.engraving}
              angle={builder.engravingAngle}
              face={builder.engravingFace}
              onTextChange={(engraving) => updateBuilder({ engraving })}
              onAngleChange={(engravingAngle) => updateBuilder({ engravingAngle })}
              onFaceChange={(engravingFace) => updateBuilder({ engravingFace })}
            />

            <EstimatedInvestment estimate={investmentEstimate} />

            <BuilderSummary
              config={builder}
              title={title}
              storyType={storyType}
              investmentEstimate={investmentEstimate}
            />
          </div>
        </div>

        <div className="space-y-6 border border-white/[0.06] bg-vault-charcoal/60 p-6 lg:p-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Commission Narrative</p>
            <p className="mt-1 font-serif text-lg text-vault-ivory">Your Story</p>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Commission Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Achievement Ring — 2026 Transformation"
                  {...register("title")}
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="story_type">Story Type</Label>
                <select
                  id="story_type"
                  className="flex h-11 w-full rounded-sm border border-white/10 bg-vault-smoke px-4 text-sm"
                  {...register("story_type")}
                >
                  {STORY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {STORY_TYPE_LABELS[t as StoryType]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story_narrative">Your Story</Label>
                <textarea
                  id="story_narrative"
                  rows={4}
                  className="flex w-full rounded-sm border border-white/10 bg-vault-smoke px-4 py-3 text-sm"
                  placeholder="Share the meaning, milestone, or symbolism behind this ring..."
                  {...register("story_narrative")}
                />
                {errors.story_narrative && (
                  <p className="text-xs text-red-400">{errors.story_narrative.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={savingDraft}
              onClick={handleSaveDraft}
              className="w-full sm:w-auto"
            >
              {savingDraft ? "Saving Draft..." : "Save Draft"}
            </Button>
            <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Beginning Commission..." : "Begin Commission"}
            </Button>
          </div>

          <p className="max-w-2xl text-[11px] leading-relaxed text-vault-pearl/45">
            Your design will be reviewed by our jeweler. The deposit begins the private commission
            process and is applied toward your final quote.
          </p>
        </div>
      </form>

      <SaveDraftAuthPrompt open={authPromptOpen} onOpenChange={setAuthPromptOpen} />
    </>
  );
}
