import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { editorialQuote } from "@/content/editorial";
import { EditorialHero } from "@/components/editorial/EditorialHero";
import {
  EditorialQuoteBlock,
  MilestoneStoriesSection,
} from "@/components/editorial/MilestoneStories";
import { VaultCollectionSection } from "@/components/editorial/VaultCollection";

export default function HomePage() {
  return (
    <>
      <EditorialHero />

      <MilestoneStoriesSection />

      <VaultCollectionSection limit={3} showGalleryLink />

      <EditorialQuoteBlock
        text={editorialQuote.text}
        attribution={editorialQuote.attribution}
      />

      <Section className="pb-24 pt-8 md:pb-32">
        <Container size="narrow" className="text-center">
          <p className="brand-eyebrow">When you are ready</p>
          <p className="mt-4 font-serif text-2xl font-light text-vault-ink md:text-3xl">
            A modern heirloom begins here.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-vault-muted">
            Configure your commission in private, save drafts as your story takes shape, or speak
            with our team when the moment is clear.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" asChild>
              <Link href={routes.create}>Enter the Atelier</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={routes.contact}>Private Inquiry</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
