import Link from "next/link";
import { getMetalPreset, getStonePreset } from "@/features/builder/constants";
import { getBandStylePreset } from "@/features/builder/style-presets";
import { isRingBuilderConfig } from "@/features/builder/types";
import { getDraftSavedAt, isCommissionDraft } from "@/features/commissions/draft-metadata";
import { formatDate } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { Commission } from "@/types";
import { Button } from "@/components/ui/button";

interface SavedDesignsListProps {
  drafts: Commission[];
}

function draftSummary(commission: Commission): {
  metal: string;
  stone: string;
  bandStyle: string;
} {
  const config = commission.builder_config;
  if (!isRingBuilderConfig(config)) {
    return { metal: "—", stone: "—", bandStyle: "—" };
  }

  return {
    metal: getMetalPreset(config.metal).label,
    stone: config.stoneEnabled ? getStonePreset(config.stone).label : "Band only",
    bandStyle: getBandStylePreset(config.bandStyle).label,
  };
}

export function SavedDesignsList({ drafts }: SavedDesignsListProps) {
  const savedDrafts = drafts.filter(isCommissionDraft);

  if (savedDrafts.length === 0) {
    return (
      <div className="brand-panel p-8 text-center">
        <p className="text-sm text-vault-pearl/55">No saved designs yet.</p>
        <Link href={routes.create} className="mt-4 inline-block text-sm text-vault-gold hover:underline">
          Start designing →
        </Link>
      </div>
    );
  }

  return (
    <ul className="brand-panel divide-y divide-vault-forest/25">
      {savedDrafts.map((draft) => {
        const summary = draftSummary(draft);
        const savedAt = getDraftSavedAt(draft);

        return (
          <li key={draft.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-vault-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-vault-gold">
                  Draft
                </span>
                <p className="text-xs text-vault-pearl/45">Saved {formatDate(savedAt ?? draft.updated_at)}</p>
              </div>
              <h3 className="font-serif text-xl text-vault-ivory">{draft.title}</h3>
              <p className="text-sm text-vault-pearl/55">
                {summary.metal} · {summary.stone} · {summary.bandStyle}
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href={`${routes.create}?draft=${draft.id}`}>Continue Design</Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
