import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/session";
import {
  getCommissionById,
  getCommissionStatusHistory,
} from "@/features/commissions/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { CommissionStatusBadge } from "@/components/account/commission-tracker";
import { CommissionStatusTimeline } from "@/components/account/commission-status-timeline";
import {
  STORY_TYPE_LABELS,
  PIECE_TYPE_LABELS,
  type CommissionStatus,
  type StoryType,
  type PieceType,
} from "@/config/commission-status";
import { CommissionBuilderSummary } from "@/features/builder/components/CommissionBuilderSummary";
import { StoredInvestmentEstimate } from "@/features/builder/components/EstimatedInvestment";
import { JewelerHandoffPreview } from "@/features/commissions/components/JewelerHandoffPreview";
import { getCommissionBuilderSnapshotUrl } from "@/features/commissions/get-snapshot-url";
import { isCommissionDraft } from "@/features/commissions/draft-metadata";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/config/routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCommissionDetailPage({ params }: PageProps) {
  await requireStaff();
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
    <AdminShell>
      <Link
        href={`${routes.admin}/commissions`}
        className="mb-8 inline-block text-sm text-vault-pearl/60 hover:text-vault-gold"
      >
        ← Back to all commissions
      </Link>

      <div className="mb-8 space-y-4">
        <p className="text-xs uppercase tracking-luxury text-vault-gold">
          {commission.reference_number}
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="font-serif text-3xl font-light">{commission.title}</h1>
          <CommissionStatusBadge status={commission.status as CommissionStatus} isDraft={isDraft} />
        </div>
        <p className="text-sm text-vault-pearl/60">
          {STORY_TYPE_LABELS[commission.story_type as StoryType]} ·{" "}
          {PIECE_TYPE_LABELS[commission.piece_type as PieceType]} · Client ID:{" "}
          {commission.client_id}
        </p>
      </div>

      {isDraft && (
        <div className="mb-8 border border-vault-gold/25 bg-vault-gold/5 px-6 py-4 text-sm text-vault-pearl/75">
          This record is a saved design draft — not a submitted inquiry or paid commission.
        </div>
      )}

      {commission.story_narrative && (
        <div className="mb-8 border border-white/5 bg-vault-charcoal p-8">
          <p className="mb-3 text-xs uppercase tracking-luxury text-vault-gold">Client Story</p>
          <p className="leading-relaxed text-vault-pearl/80">{commission.story_narrative}</p>
        </div>
      )}

      {snapshotUrl && !isDraft && (
        <JewelerHandoffPreview
          imageUrl={snapshotUrl}
          referenceNumber={commission.reference_number}
          commissionTitle={commission.title}
          downloadPath={snapshotUrl}
        />
      )}

      {!isDraft && (
        <StoredInvestmentEstimate
          lowCents={commission.budget_min_cents}
          highCents={commission.budget_max_cents}
          className="mb-8"
        />
      )}

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
    </AdminShell>
  );
}
