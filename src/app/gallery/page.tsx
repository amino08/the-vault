import { Container, PageHeader, Section } from "@/components/layout/section";
import { VaultCollectionGrid } from "@/components/editorial/VaultCollection";
import { vaultCollection } from "@/content/editorial";

const categories = [
  "Engagement",
  "Anniversary",
  "Legacy",
  "Signet",
  "Bespoke Creations",
] as const;

export default function GalleryPage() {
  return (
    <>
      <Section className="pb-12 md:pb-16">
        <Container>
          <PageHeader
            eyebrow="The Vault Collection"
            title="Commissions that carry stories"
            description="A curated selection of completed work across engagement, legacy, signet, and bespoke creations. Full photography launches with each commission reveal."
          />
          <p className="max-w-2xl body-editorial">
            These pieces represent the emotional range of our studio — milestones, lineage, and
            transformations made tangible. Each began as a private conversation, not a catalog
            selection.
          </p>
        </Container>
      </Section>

      <Section className="brand-section-alt pb-24 pt-4 md:pb-32">
        <Container>
          <div className="mb-12 flex flex-wrap gap-3 md:mb-16">
            {categories.map((category) => (
              <span
                key={category}
                className="border border-vault-forest/15 bg-vault-ivory px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-vault-muted"
              >
                {category}
              </span>
            ))}
          </div>
          <VaultCollectionGrid pieces={vaultCollection} />
        </Container>
      </Section>
    </>
  );
}
