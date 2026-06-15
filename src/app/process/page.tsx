import Link from "next/link";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Container, PageHeader, Section } from "@/components/layout/section";
import { processStages } from "@/content/editorial";
import { editorialImages } from "@/content/editorial-images";
import { EditorialImage } from "@/components/editorial/EditorialImage";
import { ProcessTimeline } from "@/components/editorial/ProcessTimeline";

export default function ProcessPage() {
  return (
    <>
      <Section className="pb-0 pt-4 md:pt-8">
        <Container size="wide">
          <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
            <PageHeader
              className="mb-0 lg:pb-12"
              eyebrow="The Commission Path"
              title="From story to finished piece"
              description="A private, five-stage journey — transparent at every milestone, never rushed."
            />
            <div className="editorial-process-frame pb-8 lg:pb-12">
              <EditorialImage
                asset={editorialImages.hero}
                sizes="(max-width: 1024px) 100vw, 45vw"
                aspectClassName="aspect-[16/10] md:aspect-[5/3]"
              />
            </div>
          </div>
          <p className="max-w-2xl border-l-2 border-vault-gold/35 pl-5 font-serif text-xl font-light leading-snug text-vault-ink md:text-2xl">
            Every commission begins with a story — not a SKU.
          </p>
        </Container>
      </Section>

      <Section className="brand-section-alt py-20 md:py-28 lg:py-32">
        <Container size="wide">
          <ProcessTimeline stages={processStages} />
        </Container>
      </Section>

      <Section className="py-20 md:py-28">
        <Container size="narrow" className="text-center">
          <p className="brand-eyebrow">Ready when you are</p>
          <p className="mt-4 font-serif text-2xl font-light text-vault-ink md:text-3xl">
            The atelier awaits your narrative.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-vault-muted">
            Configure a ring in real time, save your draft, or begin a full inquiry when the story
            is clear.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" asChild>
              <Link href={routes.create}>Begin a Commission</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={routes.contact}>Speak With Us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
