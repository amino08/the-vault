import { AdminPlaceholder, AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/layout/section";

export default function AdminPaymentsPage() {
  return (
    <AdminShell>
      <PageHeader title="Payments" description="Deposits, milestones, refunds, and Stripe reconciliation." />
      <AdminPlaceholder title="Payment Tracking" description="commission_payments + Stripe dashboard sync — Phase 2." />
    </AdminShell>
  );
}
