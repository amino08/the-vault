import { EditorialHero } from "@/components/editorial/EditorialHero";
import { HeroQuoteSpacer } from "@/components/editorial/HeroQuoteSpacer";
import { MarriageCommitmentEditorial } from "@/components/editorial/MarriageCommitmentEditorial";
import { MilestoneStoriesSection } from "@/components/editorial/MilestoneStories";
import { VaultCollectionSection } from "@/components/editorial/VaultCollection";

export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <HeroQuoteSpacer />
      <MarriageCommitmentEditorial />
      <MilestoneStoriesSection />
      <VaultCollectionSection limit={3} showGalleryLink />
    </>
  );
}
