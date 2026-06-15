import { Container, PageHeader, Section } from "@/components/layout/section";

const placeholderCreations = [
  { title: "Legacy Signet", story: "Family crest reimagined in 18k gold" },
  { title: "Transformation Pendant", story: "Weight loss journey — 100 lb milestone" },
  { title: "Anniversary Band", story: "Twenty years, one continuous line of diamonds" },
];

export default function GalleryPage() {
  return (
    <Section>
      <Container>
        <PageHeader
          eyebrow="Gallery"
          title="Past Creations"
          description="A curated selection of commissioned works. Full gallery launches in Phase 3."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {placeholderCreations.map((item) => (
            <article
              key={item.title}
              className="group aspect-[3/4] border border-white/5 bg-vault-charcoal p-8 flex flex-col justify-end"
            >
              <div className="mb-auto aspect-square w-full bg-vault-smoke/80" />
              <h3 className="mt-6 font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-vault-pearl/60">{item.story}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
