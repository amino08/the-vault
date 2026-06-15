import {
  COMMISSION_STATUS_LABELS,
  type CommissionStatus,
} from "@/config/commission-status";
import { formatDate } from "@/lib/utils";
import type { StatusHistoryEntry } from "@/features/commissions/actions";
import { cn } from "@/lib/utils";

interface CommissionStatusTimelineProps {
  currentStatus: CommissionStatus;
  history: StatusHistoryEntry[];
}

export function CommissionStatusTimeline({
  currentStatus,
  history,
}: CommissionStatusTimelineProps) {
  const entries =
    history.length > 0
      ? history
      : [
          {
            id: "current",
            from_status: null,
            to_status: currentStatus,
            notes: null,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <div className="border border-white/5 bg-vault-charcoal p-8">
      <p className="mb-6 text-xs uppercase tracking-luxury text-vault-gold">Status Timeline</p>
      <ol className="relative space-y-6 border-l border-vault-gold/20 pl-6">
        {entries.map((entry, index) => (
          <li key={entry.id} className="relative">
            <span
              className={cn(
                "absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full",
                index === entries.length - 1 ? "bg-vault-gold" : "bg-vault-gold/40",
              )}
            />
            <p className="font-medium text-vault-ivory">
              {COMMISSION_STATUS_LABELS[entry.to_status as CommissionStatus]}
            </p>
            {entry.notes && (
              <p className="mt-1 text-sm text-vault-pearl/60">{entry.notes}</p>
            )}
            <p className="mt-1 text-xs text-vault-pearl/40">{formatDate(entry.created_at)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
