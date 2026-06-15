import Link from "next/link";
import { getCommissionsForCurrentUser } from "@/features/commissions/actions";
import { isCommissionDraft, isCommissionSubmitted } from "@/features/commissions/draft-metadata";
import { AccountShell } from "@/components/account/account-shell";
import { CommissionList } from "@/components/account/commission-list";
import { SavedDesignsList } from "@/components/account/saved-designs-list";
import { PageHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export default async function AccountPage() {
  const commissions = await getCommissionsForCurrentUser();
  const drafts = commissions.filter(isCommissionDraft);
  const submitted = commissions.filter(isCommissionSubmitted);

  return (
    <AccountShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Client Portal"
          title="Your Commissions"
          description="Track progress, approve renders, and manage your bespoke pieces."
        />
        <Button asChild className="shrink-0">
          <Link href={routes.create}>New Commission</Link>
        </Button>
      </div>

      <section className="mb-12 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Saved Designs</p>
          <p className="mt-1 font-serif text-xl text-vault-ivory">Continue Where You Left Off</p>
        </div>
        <SavedDesignsList drafts={drafts} />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-vault-gold">Active Commissions</p>
          <p className="mt-1 font-serif text-xl text-vault-ivory">Submitted Inquiries</p>
        </div>
        <CommissionList commissions={submitted} />
      </section>
    </AccountShell>
  );
}
