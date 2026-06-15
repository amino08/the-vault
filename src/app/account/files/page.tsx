import { AccountShell } from "@/components/account/account-shell";
import { PageHeader } from "@/components/layout/section";

export default function AccountFilesPage() {
  return (
    <AccountShell>
      <PageHeader title="Files" description="Upload references and download deliverables." />
      <div className="border border-white/5 bg-vault-charcoal p-10">
        <p className="text-sm text-vault-pearl/60">
          File uploads via Supabase Storage arrive in Phase 2.
        </p>
      </div>
    </AccountShell>
  );
}
