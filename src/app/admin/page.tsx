import { requireStaff } from "@/lib/auth/session";
import { getCommissionsForCurrentUser } from "@/features/commissions/actions";
import { isCommissionSubmitted } from "@/features/commissions/draft-metadata";
import { AdminShell } from "@/components/admin/admin-shell";import { PageHeader } from "@/components/layout/section";
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
        <div className="border border-white/5 bg-vault-charcoal p-8">
          <p className="text-xs uppercase tracking-luxury text-vault-gold">Open Inquiries</p>
          <p className="mt-2 font-serif text-4xl">{inquiryCount}</p>
        </div>
        <div className="border border-white/5 bg-vault-charcoal p-8">
          <p className="text-xs uppercase tracking-luxury text-vault-gold">Total Commissions</p>
          <p className="mt-2 font-serif text-4xl">{submitted.length}</p>
        </div>
        <Link
          href={`${routes.admin}/commissions`}
          className="flex items-center border border-vault-gold/20 bg-vault-charcoal p-8 transition-colors hover:border-vault-gold/50"
        >
          <span className="text-sm text-vault-gold">Manage all commissions →</span>
        </Link>
      </div>
    </AdminShell>
  );
}
