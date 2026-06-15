import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountPaymentsPage() {
  return (
    <AccountShell>
      <PageHeader title="Payments" description="Invoices, deposits, and payment history." />
      <div className="surface-panel rounded-sm p-10">
        <p className="text-sm text-vault-muted">
          Stripe checkout and payment history arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
