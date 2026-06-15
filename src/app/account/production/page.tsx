import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountProductionPage() {
  return (
    <AccountShell>
      <PageHeader title="Production Updates" description="Milestones, QC, and shipment tracking." />
      <div className="surface-panel rounded-sm p-10">
        <p className="text-sm text-vault-muted">
          Production timeline and shipment tracking arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
