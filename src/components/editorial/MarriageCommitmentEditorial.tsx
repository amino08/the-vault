import Link from "next/link";
import { Container } from "@/components/layout/section";
import { routes } from "@/config/routes";
import { marriageCommitmentSection } from "@/content/editorial";
import { MarriageCommitmentVideo } from "@/components/editorial/MarriageCommitmentVideo";

export function MarriageCommitmentEditorial() {
  return (
    <section className="marriage-commitment-editorial" aria-label="Marriage and commitment">
      <Container size="wide">
        <div className="marriage-commitment-video-wrap">
          <MarriageCommitmentVideo />
        </div>

        <div className="marriage-commitment-copy">
          <div className="space-y-5">
            <p className="brand-eyebrow-gold">{marriageCommitmentSection.eyebrow}</p>
            <h2 className="font-serif text-3xl font-light leading-snug text-vault-ink md:text-4xl lg:text-[2.75rem]">
              {marriageCommitmentSection.title}
            </h2>
          </div>
          <div className="space-y-5">
            <p className="body-editorial md:text-base">{marriageCommitmentSection.body}</p>
            <p className="text-sm leading-relaxed text-vault-muted">
              {marriageCommitmentSection.support}
            </p>
            <Link href={routes.create} className="hero-cta hero-cta-secondary inline-flex">
              Begin Your Commission
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
