import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountProductionPage() {
  return (
    <AccountShell>
      <PageHeader title="Production Updates" description="Milestones, QC, and shipment tracking." />
      <div className="border border-white/5 bg-vault-charcoal p-10">
        <p className="text-sm text-vault-pearl/60">
          Production timeline and shipment tracking arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
