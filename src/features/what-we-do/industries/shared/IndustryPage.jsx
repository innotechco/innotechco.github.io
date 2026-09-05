import AccelerationSection from "./components/AccelerationSection.jsx";
import CapabilitiesSection from "./components/CapabilitiesSection.jsx";
import EcosystemCardsSection from "./components/EcosystemCardsSection.jsx";
import IndustryHero from "./components/IndustryHero.jsx";
import LiveInsightsSection from "./components/LiveInsightsSection.jsx";

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
