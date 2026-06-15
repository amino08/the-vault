import { AdminPlaceholder, AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/layout/section";

export default function AdminCustomersPage() {
  return (
    <AdminShell>
      <PageHeader title="Customers" description="Client profiles and commission history." />
      <AdminPlaceholder title="Customer Management" description="users table admin views — Phase 2." />
    </AdminShell>
  );
}
