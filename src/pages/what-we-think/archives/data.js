import {getArchivesPage} from "../../../services/content/whatWeThinkContent";
import {customerInsight} from "../../../features/archives/archives.assets.js";
import {crossFunctional} from "../../../features/archives/archives.assets.js";
import {decisionVelocity} from "../../../features/archives/archives.assets.js";
import {ecosystem} from "../../../features/archives/archives.assets.js";
import {futureReady} from "../../../features/archives/archives.assets.js";
import {innovationMetrics} from "../../../features/archives/archives.assets.js";
import {innovationPortfolio} from "../../../features/archives/archives.assets.js";
import {industrialAi} from "../../../features/archives/archives.assets.js";
import {marketSignals} from "../../../features/archives/archives.assets.js";
import {opportunitySpaces} from "../../../features/archives/archives.assets.js";
import {portfolioDecisions} from "../../../features/archives/archives.assets.js";
import {responsibleAi} from "../../../features/archives/archives.assets.js";
import {scaleExperiments} from "../../../features/archives/archives.assets.js";
import {strategicForesight} from "../../../features/archives/archives.assets.js";
import {aiInnovation} from "../../../features/archives/archives.assets.js";

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
