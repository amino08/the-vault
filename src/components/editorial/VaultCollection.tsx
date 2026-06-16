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
    <Section className={cn("brand-section-alt", className)} id="vault-collection">
      <Container>
        {showHeader && (
          <div className="mb-14 text-center md:mb-20">
            <h2 className="font-serif text-3xl font-light text-vault-ink md:text-5xl">
              {homepageCollectionSection.title}
            </h2>
            <EditorialDescriptionBox centered className="mx-auto">
              {homepageCollectionSection.description}
            </EditorialDescriptionBox>
          </div>
        )}

        <VaultCollectionEditorialGrid pieces={pieces} />

        {showGalleryLink && (
          <div className="mt-16 text-center md:mt-20">
            <Button variant="outline" asChild>
              <Link href={routes.gallery}>View the Full Collection</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

interface VaultCollectionEditorialGridProps {
  pieces: CollectionPiece[];
  className?: string;
}

/** Luxury editorial layout: 2 + feature + 2 + wide feature */
export function VaultCollectionEditorialGrid({
  pieces,
  className,
}: VaultCollectionEditorialGridProps) {
  const layoutSlots = [
    "collection-slot-sm",
    "collection-slot-sm",
    "collection-slot-feature",
    "collection-slot-sm",
    "collection-slot-sm",
    "collection-slot-wide",
  ] as const;

  return (
    <div className={cn("collection-editorial-grid", className)}>
      {pieces.map((piece, index) => {
        const slot = layoutSlots[index] ?? "collection-slot-sm";
        const isFeature = slot === "collection-slot-feature" || slot === "collection-slot-wide";

        return (
          <article key={piece.id} className={cn("editorial-collection-card group", slot)}>
            <div className="editorial-collection-image">
              <EditorialImage
                asset={piece.image}
                sizes={isFeature ? "100vw" : "(max-width: 768px) 50vw, 33vw"}
                aspectClassName={
                  slot === "collection-slot-feature"
                    ? "aspect-[21/9] min-h-[12rem] md:min-h-[18rem]"
                    : slot === "collection-slot-wide"
                      ? "aspect-[16/7] min-h-[10rem] md:min-h-[14rem]"
                      : "aspect-[4/5]"
                }
              />
            </div>
            <div className="editorial-collection-meta">
              <h3 className="font-serif text-xl text-vault-ink md:text-2xl">{piece.title}</h3>
              <EditorialDescriptionBox>{piece.story}</EditorialDescriptionBox>
            </div>
          </article>
        );
      })}
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
