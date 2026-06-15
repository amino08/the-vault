import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container, PageHeader, Section } from "@/components/layout/section";

export default function ContactPage() {
  return (
    <Section>
      <Container size="narrow">
        <PageHeader
          eyebrow="Contact"
          title="Begin the Conversation"
          description="Private consultations for commission inquiries. We respond within one business day."
        />
        <div className="surface-panel space-y-6 rounded-sm p-10">
          <p className="text-vault-muted">
            Email us directly or begin a formal commission through the portal.
          </p>
          <Button asChild>
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
