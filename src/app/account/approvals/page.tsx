import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountApprovalsPage() {
  return (
    <AccountShell>
      <PageHeader title="Render Approvals" description="Review and approve design concepts and CAD renders." />
      <div className="surface-panel rounded-sm p-10">
        <p className="text-sm text-vault-muted">
          Design and CAD approval workflows arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
