import { Container, PageHeader, Section } from "@/components/layout/section";

export default function PrivacyPage() {
  return (
    <Section>
      <Container size="narrow">
        <PageHeader eyebrow="Legal" title="Privacy Policy" />
        <div className="space-y-4 text-sm text-vault-muted">
          <p>Privacy policy content will be finalized before production launch.</p>
        </div>
      </Container>
    </Section>
  );
}
