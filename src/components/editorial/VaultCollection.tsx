import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/section";
import type { CollectionPiece } from "@/content/editorial";
import { vaultCollection } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

interface VaultCollectionProps {
  /** Show section header and optional CTA to full gallery */
  showHeader?: boolean;
  showGalleryLink?: boolean;
  /** Limit pieces for homepage teaser */
  limit?: number;
  className?: string;
}

export function VaultCollectionSection({
  showHeader = true,
  showGalleryLink = true,
  limit,
  className,
}: VaultCollectionProps) {
  const pieces = limit ? vaultCollection.slice(0, limit) : vaultCollection;

  return (
    <Section className={cn("brand-section-alt", className)} id="vault-collection">
      <Container>
        {showHeader && (
          <div className="mb-14 max-w-2xl md:mb-20">
            <p className="brand-eyebrow">The Vault Collection</p>
            <h2 className="mt-4 font-serif text-3xl font-light text-vault-ink md:text-5xl">
              Commissions that carry stories
            </h2>
            <p className="mt-5 body-editorial">
              A curated selection of completed work — engagement, legacy, signet, and bespoke
              creations. Each piece began as a private conversation.
            </p>
          </div>
        )}

        <VaultCollectionGrid pieces={pieces} />

        {showGalleryLink && (
          <div className="mt-14 text-center md:mt-16">
            <Button variant="outline" asChild>
              <Link href={routes.gallery}>View the Full Collection</Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

interface VaultCollectionGridProps {
  pieces: CollectionPiece[];
  className?: string;
}

export function VaultCollectionGrid({ pieces, className }: VaultCollectionGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
        className,
      )}
    >
      {pieces.map((piece, index) => (
        <article
          key={piece.id}
          className={cn(
            "editorial-collection-card group",
            index === 0 && "sm:col-span-2 lg:col-span-1 lg:row-span-1",
          )}
        >
          <div className="editorial-collection-image">
            <EditorialImage
              asset={piece.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              aspectClassName="aspect-[4/5]"
            />
            <div className="editorial-collection-overlay" aria-hidden />
          </div>
          <div className="editorial-collection-meta">
            <p className="text-[10px] uppercase tracking-[0.22em] text-vault-gold">
              {piece.category}
            </p>
            <h3 className="mt-2 font-serif text-xl text-vault-ink md:text-2xl">{piece.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-vault-muted">{piece.story}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
