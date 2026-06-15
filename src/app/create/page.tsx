import { getSessionUser } from "@/lib/auth/session";
import { getCommissionById } from "@/features/commissions/actions";
import { isCommissionDraft } from "@/features/commissions/draft-metadata";
import { RingConfigurator } from "@/features/builder/components/RingConfigurator";
import { Container, PageHeader, Section } from "@/components/layout/section";
import { CreateAtmosphereBanner } from "@/components/editorial/CreateAtmosphereBanner";

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
    <Section className="py-12 md:py-16">
      <Container size="wide">
        <PageHeader
          className="mb-6 md:mb-8"
          eyebrow="Atelier"
          title="Design Your Ring"
          description="Configure your commission in real time. Save drafts anytime or begin your private commission when ready."
        />
        <CreateAtmosphereBanner />
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
