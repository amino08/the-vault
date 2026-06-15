import Link from "next/link";
import {
  STORY_TYPE_LABELS,
  PIECE_TYPE_LABELS,
  type CommissionStatus,
  type PieceType,
  type StoryType,
} from "@/config/commission-status";
import { formatDate } from "@/lib/utils";
import type { Commission } from "@/types";
import { isCommissionDraft } from "@/features/commissions/draft-metadata";
import { CommissionStatusBadge } from "@/components/account/commission-tracker";

interface CommissionListProps {
  commissions: Commission[];
  basePath?: string;
}

export function CommissionList({ commissions, basePath = "/account/commissions" }: CommissionListProps) {
  if (commissions.length === 0) {
    return (
      <div className="brand-panel p-10 text-center">
        <p className="text-vault-pearl/60">No commissions yet.</p>
        <Link href="/create" className="mt-4 inline-block text-sm text-vault-gold hover:underline">
          Begin your first commission →
        </Link>
      </div>
    );
  }

  return (
    <ul className="brand-panel divide-y divide-vault-forest/25">
      {commissions.map((c) => (
        <li key={c.id}>
          <Link
            href={`${basePath}/${c.id}`}
            className="flex flex-col gap-3 p-6 transition-colors hover:bg-vault-forest/10 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-luxury text-vault-gold/80">
                {c.reference_number}
              </p>
              <h3 className="font-serif text-xl">{c.title}</h3>
              <p className="text-sm text-vault-pearl/50">
                {STORY_TYPE_LABELS[c.story_type as StoryType]} ·{" "}
                {PIECE_TYPE_LABELS[c.piece_type as PieceType]} · {formatDate(c.created_at)}
              </p>
            </div>
            <CommissionStatusBadge
              status={c.status as CommissionStatus}
              isDraft={isCommissionDraft(c)}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
