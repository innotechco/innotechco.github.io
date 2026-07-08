import automotivePage from "../../content/en/industries/automotive.json";
import energyAndMaterialsPage from "../../content/en/industries/energy-and-materials.json";
import healthPage from "../../content/en/industries/health.json";
import highTechPage from "../../content/en/industries/high-tech.json";
import metalsAndMiningPage from "../../content/en/industries/metals-and-mining.json";
import {industryConfig} from "../../config/industries.config";
import {fetchJsonFromApi, mergeArrayById, mergeRecord} from "./utils";

const industryContent = {
  automotive: automotivePage,
  "energy-and-materials": energyAndMaterialsPage,
  health: healthPage,
  "high-tech": highTechPage,
  "metals-and-mining": metalsAndMiningPage,
};

function buildIndustryPage(content, config = {}) {
  return {
    ...content,
    hero: mergeRecord(content.hero, config.hero),
    liveInsights: {
      ...content.liveInsights,
      ...(config.liveInsights ?? {}),
      cards: mergeArrayById(
        content.liveInsights?.cards,
        config.liveInsights?.cards,
      ),
    },
    ecosystemCards: mergeArrayById(content.ecosystemCards, config.ecosystemCards),
  };
}

export function getIndustryPage(slug) {
  return buildIndustryPage(industryContent[slug], industryConfig[slug]);
}

export async function fetchIndustryPage(slug) {
  const apiContent = await fetchJsonFromApi(`/industries/${slug}`);
  return apiContent
    ? buildIndustryPage(apiContent, industryConfig[slug])
    : getIndustryPage(slug);
}
