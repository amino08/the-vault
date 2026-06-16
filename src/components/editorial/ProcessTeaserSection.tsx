import Link from "next/link";
import { Container, Section } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { homepageProcessSection } from "@/content/editorial";
import { EditorialDescriptionBox } from "@/components/editorial/EditorialDescriptionBox";

export function ProcessTeaserSection() {
  return (
    <Section className="py-20 md:py-28">
      <Container size="narrow" className="text-center">
        <h2 className="font-serif text-3xl font-light text-vault-ink md:text-4xl">
          {homepageProcessSection.title}
        </h2>
        <EditorialDescriptionBox centered className="mx-auto">
          {homepageProcessSection.description}
        </EditorialDescriptionBox>
        <Link href={routes.process} className="hero-cta hero-cta-secondary mt-10 inline-flex">
          Explore The Process
        </Link>
      </Container>
    </Section>
  );
}
