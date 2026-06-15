import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCommissionById,
  getCommissionStatusHistory,
} from "@/features/commissions/actions";
import {
  STORY_TYPE_LABELS,
  PIECE_TYPE_LABELS,
  type CommissionStatus,
  type StoryType,
  type PieceType,
} from "@/config/commission-status";
import { AccountShell } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import { CommissionStatusBadge } from "@/components/account/commission-tracker";
import { CommissionStatusTimeline } from "@/components/account/commission-status-timeline";
import { CommissionBuilderSummary } from "@/features/builder/components/CommissionBuilderSummary";
import { StoredInvestmentEstimate } from "@/features/builder/components/EstimatedInvestment";
import { CommissionRenderSnapshot } from "@/features/commissions/components/CommissionRenderSnapshot";
import { getCommissionBuilderSnapshotUrl } from "@/features/commissions/get-snapshot-url";
import { isCommissionDraft } from "@/features/commissions/draft-metadata";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const commission = await getCommissionById(id);

  if (!commission) {
    notFound();
  }

  const history = await getCommissionStatusHistory(id);
  const supabase = await createClient();
  const snapshotUrl = await getCommissionBuilderSnapshotUrl(supabase, commission);

  const isDraft = isCommissionDraft(commission);

  return (
    <AccountShell>
      <Link
        href={routes.account}
        className="mb-8 inline-block text-sm text-vault-muted hover:text-vault-gold"
      >
        ← Back to commissions
      </Link>

      <div className="mb-8 space-y-4">
        <p className="text-xs uppercase tracking-luxury text-vault-gold">
          {commission.reference_number}
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="font-serif text-3xl font-light text-vault-ink md:text-4xl">{commission.title}</h1>
          <CommissionStatusBadge status={commission.status as CommissionStatus} isDraft={isDraft} />
        </div>
        <p className="text-sm text-vault-muted">
          {STORY_TYPE_LABELS[commission.story_type as StoryType]} ·{" "}
          {PIECE_TYPE_LABELS[commission.piece_type as PieceType]}
        </p>
      </div>

      {isDraft && (
        <div className="mb-8 flex flex-col gap-4 border border-vault-gold/25 bg-vault-warm p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-vault-muted">
            This is a saved design draft — not yet submitted as a commission inquiry.
          </p>
          <Button asChild variant="outline">
            <Link href={`${routes.create}?draft=${commission.id}`}>Continue Design</Link>
          </Button>
        </div>
      )}

      {commission.story_narrative && (
        <div className="surface-panel mb-8 rounded-sm p-8">
          <p className="mb-3 brand-eyebrow text-[10px]">Your Story</p>
          <p className="leading-relaxed text-vault-muted">{commission.story_narrative}</p>
        </div>
      )}

      {snapshotUrl && (
        <CommissionRenderSnapshot
          imageUrl={snapshotUrl}
          referenceNumber={commission.reference_number}
        />
      )}

      <StoredInvestmentEstimate
        lowCents={commission.budget_min_cents}
        highCents={commission.budget_max_cents}
        className="mb-8"
      />

      {commission.builder_config &&
        typeof commission.builder_config === "object" &&
        Object.keys(commission.builder_config).length > 0 && (
          <CommissionBuilderSummary
            builderConfig={commission.builder_config as Record<string, unknown>}
          />
        )}

      <CommissionStatusTimeline
        currentStatus={commission.status as CommissionStatus}
        history={history}
      />
    </AccountShell>
  );
}
