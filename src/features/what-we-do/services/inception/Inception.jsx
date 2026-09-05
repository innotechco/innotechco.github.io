import InceptionIntro from "./sections/InceptionIntro.jsx";
import ServiceCapabilities from "../shared/components/ServiceCapabilities.jsx";
import ServiceActionSection from "../shared/components/ServiceActionSection.jsx";
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
} from "./inception.content.js";

function Inception() {
  return (
    <>
      <InceptionIntro />
      <ServiceRoad {...road} />
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

export default Inception;
