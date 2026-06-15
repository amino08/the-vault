import { Container } from "@/components/layout/section";
import { editorialImages } from "@/content/editorial-images";
import { EditorialImage } from "@/components/editorial/EditorialImage";

/**
 * Full-width marriage & commitment editorial — placeholder until
 * /images/vault/marriage-commitment-hero.jpg is supplied.
 */
export function MarriageCommitmentEditorial() {
  return (
    <section className="marriage-commitment-editorial" aria-label="Marriage and commitment">
      <Container size="wide" className="px-0 md:px-10">
        <div className="marriage-commitment-frame">
          <EditorialImage
            asset={editorialImages.marriageCommitment}
            sizes="100vw"
            aspectClassName="aspect-[16/9] md:aspect-[21/9] min-h-[14rem] md:min-h-[22rem]"
          />
          <div className="marriage-commitment-overlay" aria-hidden />
          <div className="marriage-commitment-caption">
            <p className="brand-eyebrow-gold text-[10px] tracking-[0.28em]">Marriage &amp; Commitment</p>
            <p className="mt-3 max-w-md font-serif text-xl font-light leading-snug text-vault-cream-text md:text-2xl">
              An engagement is not a transaction. It is a vow made visible.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
