import { EditorialHero } from "@/components/editorial/EditorialHero";
import { HeroQuoteSpacer } from "@/components/editorial/HeroQuoteSpacer";
import { MarriageCommitmentEditorial } from "@/components/editorial/MarriageCommitmentEditorial";
import { VaultCollectionSection } from "@/components/editorial/VaultCollection";

export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <HeroQuoteSpacer />
      <MarriageCommitmentEditorial />
      <VaultCollectionSection limit={6} showGalleryLink />
    </>
  );
}
