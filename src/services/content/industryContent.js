import {localizedModule} from "../../i18n/locale";
import {industryConfig} from "../../config/industries.config";
import {fetchJsonFromApi, mergeArrayById, mergeRecord} from "./utils";

const modules = import.meta.glob("../../content/{en,ar,tr}/industries/*.json", {eager: true, import: "default"});
const industryContent = Object.fromEntries(["automotive", "energy-and-materials", "health", "high-tech", "metals-and-mining"].map((slug) => [slug, localizedModule(modules, `../../content/en/industries/${slug}.json`)]));

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
