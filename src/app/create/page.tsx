import { getSessionUser } from "@/lib/auth/session";
import { getCommissionById } from "@/features/commissions/actions";
import { isCommissionDraft } from "@/features/commissions/draft-metadata";
import { RingConfigurator } from "@/features/builder/components/RingConfigurator";
import { Container, PageHeader, Section } from "@/components/layout/section";

interface CreatePageProps {
  searchParams: Promise<{ draft?: string; restore?: string }>;
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { draft, restore } = await searchParams;
  const user = await getSessionUser();

  let initialDraft = null;
  if (user && draft) {
    const commission = await getCommissionById(draft);
    if (commission && isCommissionDraft(commission)) {
      initialDraft = commission;
    }
  }

  return (
    <Section className="relative py-14 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-brand-radial opacity-60" aria-hidden />
      <Container size="wide" className="relative">
        <PageHeader
          className="mb-8 md:mb-10"
          eyebrow="Atelier"
          title="Design Your Ring"
          description="Configure your commission in real time. Save drafts anytime or begin your private commission when ready."
        />
        <RingConfigurator
          isAuthenticated={Boolean(user)}
          userEmail={user?.email ?? null}
          initialDraft={initialDraft}
          restorePending={restore === "1"}
        />
      </Container>
    </Section>
  );
}
