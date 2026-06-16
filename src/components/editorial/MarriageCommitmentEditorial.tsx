import { Container } from "@/components/layout/section";
import { marriageCommitmentSection } from "@/content/editorial";
import { EditorialDescriptionBox } from "@/components/editorial/EditorialDescriptionBox";
import { MarriageCommitmentVideo } from "@/components/editorial/MarriageCommitmentVideo";

export function MarriageCommitmentEditorial() {
  return (
    <section className="marriage-commitment-editorial" aria-label="Marriage and commitment">
      <div className="marriage-commitment-video-bleed">
        <MarriageCommitmentVideo />
      </div>

      <Container size="narrow" className="marriage-commitment-copy">
        <h2 className="font-serif text-3xl font-light text-vault-ink md:text-4xl">
          {marriageCommitmentSection.title}
        </h2>
        <EditorialDescriptionBox centered>
          {marriageCommitmentSection.description}
        </EditorialDescriptionBox>
      </Container>
    </section>
  );
}
