import {getArchivesPage} from "../../../services/content/whatWeThinkContent";
import customerInsight from "../../../assets/images/archives/customer-insight.svg";
import crossFunctional from "../../../assets/images/archives/cross-functional.svg";
import decisionVelocity from "../../../assets/images/archives/decision-velocity.svg";
import ecosystem from "../../../assets/images/archives/ecosystem.svg";
import futureReady from "../../../assets/images/archives/future-ready.svg";
import innovationMetrics from "../../../assets/images/archives/innovation-metrics.svg";
import innovationPortfolio from "../../../assets/images/archives/innovation-portfolio.svg";
import industrialAi from "../../../assets/images/archives/industrial-ai.svg";
import marketSignals from "../../../assets/images/archives/market-signals.svg";
import opportunitySpaces from "../../../assets/images/archives/opportunity-spaces.svg";
import portfolioDecisions from "../../../assets/images/archives/portfolio-decisions.svg";
import responsibleAi from "../../../assets/images/archives/responsible-ai.svg";
import scaleExperiments from "../../../assets/images/archives/scale-experiments.svg";
import strategicForesight from "../../../assets/images/archives/strategic-foresight.svg";
import aiInnovation from "../../../assets/images/archives/ai-innovation.svg";

const archiveImages = {
  "portfolio-decisions": portfolioDecisions,
  "ai-innovation": aiInnovation,
  "market-signals": marketSignals,
  "scale-experiments": scaleExperiments,
  "industrial-ai": industrialAi,
  "innovation-portfolio": innovationPortfolio,
  "future-ready": futureReady,
  "customer-insight": customerInsight,
  "strategic-foresight": strategicForesight,
  "innovation-metrics": innovationMetrics,
  "cross-functional": crossFunctional,
  "opportunity-spaces": opportunitySpaces,
  "decision-velocity": decisionVelocity,
  "responsible-ai": responsibleAi,
  "ecosystem": ecosystem,
};

const {page: archivePage, items} = getArchivesPage();
export const archiveItems = items.map((item) => ({
  ...item,
  image: archiveImages[item.id] ?? item.image,
}));
export {archivePage};
