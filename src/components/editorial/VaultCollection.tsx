import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/section";
import type { CollectionPiece } from "@/content/editorial";
import { homepageCollectionSection, vaultCollection } from "@/content/editorial";
import { EditorialDescriptionBox } from "@/components/editorial/EditorialDescriptionBox";
import { EditorialImage } from "@/components/editorial/EditorialImage";

interface VaultCollectionProps {
  showHeader?: boolean;
  showGalleryLink?: boolean;
  limit?: number;
  className?: string;
}

export function VaultCollectionSection({
  showHeader = true,
  showGalleryLink = true,
  limit = 6,
  className,
}: VaultCollectionProps) {
  const pieces = limit ? vaultCollection.slice(0, limit) : vaultCollection;

  return (
    <Section className={cn("brand-section-alt overflow-hidden", className)} id="vault-collection">
      {showHeader && (
        <Container>
          <div className="mb-10 text-center md:mb-14">
            <h2 className="font-serif text-3xl font-light text-vault-ink md:text-5xl">
              {homepageCollectionSection.title}
            </h2>
            <EditorialDescriptionBox centered className="mx-auto">
              {homepageCollectionSection.description}
            </EditorialDescriptionBox>
          </div>
        </Container>
      )}

      <VaultCollectionScrollStrip pieces={pieces} />

      {showGalleryLink && (
        <Container>
          <div className="mt-14 text-center md:mt-16">
            <Button variant="outline" asChild>
              <Link href={routes.gallery}>View the Full Collection</Link>
            </Button>
          </div>
        </Container>
      )}
    </Section>
  );
}

interface VaultCollectionScrollStripProps {
  pieces: CollectionPiece[];
  className?: string;
}

/** Homepage — horizontal editorial scroll with large imagery */
export function VaultCollectionScrollStrip({ pieces, className }: VaultCollectionScrollStripProps) {
  return (
    <div className={cn("collection-scroll-bleed", className)}>
      <div className="collection-scroll-strip" aria-label="Vault collection">
        {pieces.map((piece) => (
          <article key={piece.id} className="collection-scroll-item group">
            <div className="collection-scroll-image">
              <EditorialImage
                asset={piece.image}
                sizes="(max-width: 768px) 85vw, 42vw"
                aspectClassName="aspect-[3/4] min-h-[24rem] md:min-h-[34rem] lg:min-h-[38rem]"
              />
            </div>
            <h3 className="mt-5 font-serif text-xl text-vault-ink md:mt-6 md:text-2xl">{piece.title}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Standard uniform grid — used on gallery page */
export function VaultCollectionGrid({ pieces, className }: { pieces: CollectionPiece[]; className?: string }) {
  return (
    <div className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10", className)}>
      {pieces.map((piece) => (
        <article key={piece.id} className="editorial-collection-card group">
          <div className="editorial-collection-image">
            <EditorialImage
              asset={piece.image}
              sizes="(max-width: 640px) 100vw, 33vw"
              aspectClassName="aspect-[4/5]"
            />
          </div>
          <div className="editorial-collection-meta">
            <h3 className="font-serif text-xl text-vault-ink md:text-2xl">{piece.title}</h3>
            <EditorialDescriptionBox>{piece.story}</EditorialDescriptionBox>
          </div>
        </article>
      ))}
    </div>
  );
}
