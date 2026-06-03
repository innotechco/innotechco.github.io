import AccelerationSection from "./AccelerationSection";
import CapabilitiesSection from "./CapabilitiesSection";
import EcosystemCardsSection from "./EcosystemCardsSection";
import IndustryHero from "./IndustryHero";
import LiveInsightsSection from "./LiveInsightsSection";

function IndustryPage({config}) {
  return (
    <>
      <IndustryHero {...config.hero} />
      <AccelerationSection paragraphs={config.acceleration} />
      <CapabilitiesSection services={config.capabilities} />
      <LiveInsightsSection {...config.insights} />
      <EcosystemCardsSection cards={config.ecosystemCards} />
    </>
  );
}

export default IndustryPage;
