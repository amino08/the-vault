import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountApprovalsPage() {
  return (
    <AccountShell>
      <PageHeader title="Render Approvals" description="Review and approve design concepts and CAD renders." />
      <div className="border border-white/5 bg-vault-charcoal p-10">
        <p className="text-sm text-vault-pearl/60">
          Design and CAD approval workflows arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
