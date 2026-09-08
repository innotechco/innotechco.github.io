import {getArchivesPage} from "../what-we-think/whatWeThinkContent.js";
import {customerInsight} from "./archives.assets.js";
import {crossFunctional} from "./archives.assets.js";
import {decisionVelocity} from "./archives.assets.js";
import {ecosystem} from "./archives.assets.js";
import {futureReady} from "./archives.assets.js";
import {innovationMetrics} from "./archives.assets.js";
import {innovationPortfolio} from "./archives.assets.js";
import {industrialAi} from "./archives.assets.js";
import {marketSignals} from "./archives.assets.js";
import {opportunitySpaces} from "./archives.assets.js";
import {portfolioDecisions} from "./archives.assets.js";
import {responsibleAi} from "./archives.assets.js";
import {scaleExperiments} from "./archives.assets.js";
import {strategicForesight} from "./archives.assets.js";
import {aiInnovation} from "./archives.assets.js";

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
