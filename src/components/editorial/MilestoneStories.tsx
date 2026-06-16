import { Container, Section } from "@/components/layout/section";
import { homepageMilestoneSection, milestoneStories } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

export function MilestoneStoriesSection() {
  return (
    <Section className="py-24 md:py-32 lg:py-40">
      <Container>
        <div className="mb-14 text-center md:mb-20">
          <h2 className="font-serif text-3xl font-light text-vault-ink md:text-5xl">
            {homepageMilestoneSection.title}
          </h2>
        </div>

        <div className="grid gap-16 md:grid-cols-3 md:gap-10 lg:gap-14">
          {milestoneStories.map((story) => (
            <article key={story.title} className="editorial-milestone-card">
              <EditorialImage
                asset={story.image}
                sizes="(max-width: 768px) 100vw, 33vw"
                aspectClassName="aspect-[3/4]"
              />
              <h3 className="mt-6 font-serif text-xl text-vault-ink md:text-2xl">{story.title}</h3>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
