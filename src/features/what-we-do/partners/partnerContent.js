import {localizedModule} from "../../../shared/i18n/locale.js";
import {partnerConfig} from "./partners.config.js";
import {fetchJsonFromApi} from "../../../shared/content/utils.js";

const modules = import.meta.glob("../../../content/{en,ar,tr}/partners/**/*.json", {eager: true, import: "default"});
const partnerSlugs = ["allentia", "brightidea", "gartner", "idc", "itonics", "lean", "lensorg", "market-research", "r-and-m", "sharjah", "startin", "statista", "trex"];
const partnerContent = Object.fromEntries(partnerSlugs.map((slug) => [slug, localizedModule(modules, `../../../content/en/partners/${slug}/${slug}.json`)]));

function buildPartnerPage(content, config = {}) {
  if (!content) return null;

  return {
    ...content,
    assets: config.assets ?? {},
    theme: config.theme,
  };
}

export function getPartnerPage(slug) {
  return buildPartnerPage(partnerContent[slug], partnerConfig[slug]);
}

export async function fetchPartnerPage(slug) {
  const apiContent = await fetchJsonFromApi(`/partners/${slug}`);
  return apiContent
    ? buildPartnerPage(apiContent, partnerConfig[slug])
    : getPartnerPage(slug);
}
