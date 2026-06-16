import { EditorialHero } from "@/components/editorial/EditorialHero";
import { HeroQuoteSpacer } from "@/components/editorial/HeroQuoteSpacer";
import { MarriageCommitmentEditorial } from "@/components/editorial/MarriageCommitmentEditorial";
import { MilestoneStoriesSection } from "@/components/editorial/MilestoneStories";
import { ProcessTeaserSection } from "@/components/editorial/ProcessTeaserSection";
import { VaultCollectionSection } from "@/components/editorial/VaultCollection";

export default function HomePage() {
  return (
    <>
      <EditorialHero />
      <HeroQuoteSpacer />
      <MarriageCommitmentEditorial />
      <MilestoneStoriesSection />
      <ProcessTeaserSection />
      <VaultCollectionSection limit={6} showGalleryLink />
    </>
  );
}
