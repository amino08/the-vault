import { COMMISSION_STATUS_LABELS, type CommissionStatus } from "@/config/commission-status";
import { cn } from "@/lib/utils";

interface CommissionStatusBadgeProps {
  status: CommissionStatus;
  isDraft?: boolean;
  className?: string;
}

export function CommissionStatusBadge({ status, isDraft, className }: CommissionStatusBadgeProps) {
  if (isDraft) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-sm border border-vault-gold/40 px-3 py-1 text-xs uppercase tracking-wider text-vault-gold",
          className,
        )}
      >
        Draft
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-vault-gold/30 px-3 py-1 text-xs uppercase tracking-wider text-vault-gold",
        status === "cancelled" && "border-red-400/30 text-red-300",
        status === "completed" && "border-emerald-400/30 text-emerald-300",
        className,
      )}
    >
      {COMMISSION_STATUS_LABELS[status]}
    </span>
  );
}

interface CommissionTrackerProps {
  status: CommissionStatus;
}

export function CommissionTracker({ status }: CommissionTrackerProps) {
  return (
    <div className="border border-white/5 bg-vault-charcoal p-8">
      <p className="text-xs uppercase tracking-luxury text-vault-gold">Current Status</p>
      <CommissionStatusBadge status={status} className="mt-4" />
      <p className="mt-6 text-sm text-vault-pearl/60">
        Full timeline UI connects to commission_status_history in Phase 2.
      </p>
    </div>
  );
}
