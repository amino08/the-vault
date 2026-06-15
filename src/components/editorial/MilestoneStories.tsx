import { Container, Section } from "@/components/layout/section";
import { milestoneStories, vaultPurpose } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

export function MilestoneStoriesSection() {
  return (
    <Section className="py-20 md:py-32">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <p className="brand-eyebrow">{vaultPurpose.eyebrow}</p>
          <h2 className="mt-4 font-serif text-3xl font-light text-vault-ink md:text-4xl">
            {vaultPurpose.title}
          </h2>
          <p className="mt-5 body-editorial">{vaultPurpose.body}</p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-10">
          {milestoneStories.map((story) => (
            <article key={story.title} className="editorial-milestone-card">
              <EditorialImage
                asset={story.image}
                sizes="(max-width: 768px) 100vw, 33vw"
                aspectClassName="aspect-[3/4]"
              />
              <div className="mt-6 space-y-3">
                <h3 className="font-serif text-xl text-vault-ink">{story.title}</h3>
                <p className="text-sm leading-relaxed text-vault-muted">{story.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

interface EditorialQuoteProps {
  text: string;
  attribution?: string;
}

export function EditorialQuoteBlock({ text, attribution }: EditorialQuoteProps) {
  return (
    <Section className="brand-section-alt py-24 md:py-32">
      <Container size="narrow" className="text-center">
        <div className="mx-auto mb-10 h-px w-16 bg-vault-gold/40" aria-hidden />
        <blockquote>
          <p className="font-serif text-2xl font-light italic leading-relaxed text-vault-forest md:text-3xl lg:text-4xl">
            &ldquo;{text}&rdquo;
          </p>
          {attribution && (
            <footer className="mt-8 text-xs uppercase tracking-luxury text-vault-muted-light">
              {attribution}
            </footer>
          )}
        </blockquote>
      </Container>
    </Section>
  );
}
