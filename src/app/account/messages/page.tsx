import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountMessagesPage() {
  return (
    <AccountShell>
      <PageHeader title="Message Center" description="Communicate with your commission team." />
      <div className="surface-panel rounded-sm p-10">
        <p className="text-sm text-vault-muted">
          Threaded messaging arrives in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
