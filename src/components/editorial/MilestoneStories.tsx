import { Container, Section } from "@/components/layout/section";
import { milestoneStories } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

export function MilestoneStoriesSection() {
  return (
    <Section className="py-24 md:py-32 lg:py-40">
      <Container>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
          {milestoneStories.map((story) => (
            <article key={story.title} className="editorial-milestone-card">
              <EditorialImage
                asset={story.image}
                sizes="(max-width: 768px) 100vw, 33vw"
                aspectClassName="aspect-[3/4]"
              />
              <h3 className="mt-5 font-serif text-xl text-vault-ink md:text-2xl">{story.title}</h3>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
