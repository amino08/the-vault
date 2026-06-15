import { createAtmosphere } from "@/content/editorial";
import { EditorialImage } from "@/components/editorial/EditorialImage";

export function CreateAtmosphereBanner() {
  return (
    <aside
      className="editorial-create-banner mb-8 md:mb-10"
      aria-label="Atelier atmosphere"
    >
      <EditorialImage
        asset={createAtmosphere.image}
        sizes="100vw"
        aspectClassName="absolute inset-0"
        className="h-full w-full"
      />
      <div className="editorial-create-banner-copy">
        <p className="brand-eyebrow-gold text-[10px] tracking-[0.28em] text-vault-gold-light">
          {createAtmosphere.eyebrow}
        </p>
        <p className="mt-2 max-w-xl font-serif text-lg font-light leading-snug text-vault-cream-text md:text-xl">
          {createAtmosphere.line}
        </p>
      </div>
    </aside>
  );
}
