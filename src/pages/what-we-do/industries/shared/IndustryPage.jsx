import AccelerationSection from "./components/AccelerationSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import EcosystemCardsSection from "./components/EcosystemCardsSection";
import IndustryHero from "./components/IndustryHero";
import LiveInsightsSection from "./components/LiveInsightsSection";

function IndustryPage({
  accelerationParagraphs,
  capabilities,
  ecosystemCards,
  hero,
  liveInsights,
  sectionLabels = {},
  slug,
}) {
  return (
    <>
      <IndustryHero {...hero} />
      <AccelerationSection
        paragraphs={accelerationParagraphs}
        title={sectionLabels.acceleration}
      />
      <CapabilitiesSection services={capabilities} />
      <LiveInsightsSection {...liveInsights} industrySlug={slug} />
      <EcosystemCardsSection
        actionLabel={sectionLabels.ecosystemAction}
        cards={ecosystemCards}
        title={sectionLabels.ecosystem}
      />
    </>
  );
}

export default IndustryPage;
