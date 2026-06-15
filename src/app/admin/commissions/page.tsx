import { requireStaff } from "@/lib/auth/session";
import { getAllCommissionsAdmin } from "@/features/commissions/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { CommissionList } from "@/components/account/commission-list";
import { PageHeader } from "@/components/layout/section";
import {
  COMMISSION_STATUS_LABELS,
  type CommissionStatus,
} from "@/config/commission-status";

export default async function AdminCommissionsPage() {
  await requireStaff();
  const commissions = await getAllCommissionsAdmin();

  const byStatus = commissions.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminShell>
      <PageHeader
        title="Commissions"
        description={`${commissions.length} total commission${commissions.length === 1 ? "" : "s"}`}
      />

      <div className="mb-8 flex flex-wrap gap-3">
        {Object.entries(byStatus).map(([status, count]) => (
          <span
            key={status}
            className="rounded-sm border border-white/10 px-3 py-1 text-xs text-vault-pearl/70"
          >
            {COMMISSION_STATUS_LABELS[status as CommissionStatus]}: {count}
          </span>
        ))}
      </div>

      <CommissionList commissions={commissions} basePath="/admin/commissions" />
    </AdminShell>
  );
}
