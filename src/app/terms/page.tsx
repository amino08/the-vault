import { Container, PageHeader, Section } from "@/components/layout/section";

export default function TermsPage() {
  return (
    <Section>
      <Container size="narrow">
        <PageHeader eyebrow="Legal" title="Terms of Service" />
        <div className="space-y-4 text-sm text-vault-muted">
          <p>Terms of service content will be finalized before production launch.</p>
        </div>
      </Container>
    </Section>
  );
}
