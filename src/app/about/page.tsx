import { Container, PageHeader, Section } from "@/components/layout/section";

export default function AboutPage() {
  return (
    <Section>
      <Container size="narrow">
        <PageHeader
          eyebrow="About"
          title="The Vault by Enter Aevum"
          description="A luxury commission house for clients who measure value in meaning — not mass production."
        />
        <div className="space-y-6 body-editorial">
          <p>
            The Vault exists at the intersection of fine jewelry craftsmanship and personal
            narrative. Each commission is a collaboration between client and atelier — shaped by
            story, symbolism, and the highest standards of bespoke design.
          </p>
          <p>
            We serve individuals marking transformation, couples honoring legacy, and leaders
            commemorating milestones. Every engagement is private, editorial in tone, and built for
            permanence.
          </p>
        </div>
      </Container>
    </Section>
  );
}
