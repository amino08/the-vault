import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const storyExamples = [
  "Weight loss transformation",
  "Bodybuilding achievement",
  "Anniversary & wedding",
  "Family legacy",
  "Business milestone",
  "Personal symbolism",
];

export default function HomePage() {
  return (
    <>
      <Section className="relative overflow-hidden pb-24 pt-16 md:pb-32 md:pt-20">
        <div className="absolute inset-0 bg-brand-radial-light" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl space-y-10 py-12 text-center md:py-20">
            <p className="brand-eyebrow">Luxury Bespoke Commission House</p>
            <h1 className="font-serif text-5xl font-light leading-[1.12] tracking-wide text-balance text-vault-ink md:text-7xl">
              Every piece begins as a story worth preserving forever.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-vault-muted">
              {siteConfig.description}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={routes.create}>Begin Your Commission</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href={routes.process}>Explore the Process</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="brand-section-alt py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <p className="brand-eyebrow-gold">Not a jewelry store</p>
              <h2 className="font-serif text-3xl font-light text-vault-ink md:text-4xl">
                Commissions rooted in meaning, crafted for eternity.
              </h2>
              <p className="body-editorial">
                The Vault is where transformation, achievement, and legacy become tangible —
                one-of-a-kind pieces designed around your narrative, not a catalog.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {storyExamples.map((example) => (
                <li
                  key={example}
                  className="surface-panel rounded-sm px-5 py-4 text-sm text-vault-muted"
                >
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="py-20 md:py-28">
        <Container size="narrow" className="text-center">
          <p className="font-serif text-2xl font-light italic leading-relaxed text-vault-forest md:text-3xl">
            &ldquo;We do not sell jewelry. We immortalize chapters.&rdquo;
          </p>
          <div className="pt-12">
            <Button variant="outline" asChild>
              <Link href={routes.commissions}>View Commission Types</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
