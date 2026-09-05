import InsightIntro from "./sections/InsightIntro.jsx";
import ReportStoreCard from "../shared/components/ReportStoreCard.jsx";
import ServiceActionSection from "../shared/components/ServiceActionSection.jsx";
import ServiceCapabilities from "../shared/components/ServiceCapabilities.jsx";
import ServiceRoad from "../shared/components/ServiceRoad.jsx";
import ServiceStats from "../shared/components/ServiceStats.jsx";
import ServicePartners from "../shared/components/ServicePartners.jsx";
import ServiceShowcase from "../shared/components/ServiceShowcase.jsx";
import {
  actions,
  capabilities,
  partners,
  road,
  sectionLabels,
  showcase,
  stats,
} from "./insight.content.js";

function Insight() {
  return (
    <>
      <InsightIntro />
      <ServiceRoad {...road} />
      <ReportStoreCard />
      <ServiceCapabilities
        title={sectionLabels.capabilities}
        items={capabilities}
      />
      <ServiceStats stats={stats} />
      <ServiceActionSection title={sectionLabels.actions} items={actions} />
      <ServicePartners
        service={sectionLabels.partnersServiceName}
        partners={partners}
      />
      <ServiceShowcase {...showcase} />
    </>
  );
}

export default Insight;
