import { requireStaff } from "@/lib/auth/session";
import { getCommissionsForCurrentUser } from "@/features/commissions/actions";
import { isCommissionSubmitted } from "@/features/commissions/draft-metadata";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/layout/section";
import Link from "next/link";
import { routes } from "@/config/routes";

export default async function AdminDashboardPage() {
  await requireStaff();
  const commissions = await getCommissionsForCurrentUser();
  const submitted = commissions.filter(isCommissionSubmitted);
  const inquiryCount = submitted.filter((c) => c.status === "inquiry").length;

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="Internal operations for The Vault commission house."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="brand-panel p-8">
          <p className="brand-eyebrow text-[10px]">Open Inquiries</p>
          <p className="mt-2 font-serif text-4xl text-vault-cream">{inquiryCount}</p>
        </div>
        <div className="brand-panel p-8">
          <p className="brand-eyebrow text-[10px]">Total Commissions</p>
          <p className="mt-2 font-serif text-4xl text-vault-cream">{submitted.length}</p>
        </div>
        <Link
          href={`${routes.admin}/commissions`}
          className="brand-panel flex items-center p-8 transition-colors hover:border-vault-gold/40"
        >
          <span className="text-sm text-vault-gold">Manage all commissions →</span>
        </Link>
      </div>
    </AdminShell>
  );
}
