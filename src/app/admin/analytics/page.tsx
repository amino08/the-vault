import { AdminPlaceholder, AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/layout/section";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell>
      <PageHeader title="Analytics" description="Business intelligence for The Vault." />
      <AdminPlaceholder title="Analytics Dashboard" description="KPIs, funnel, revenue — Phase 3." />
    </AdminShell>
  );
}
