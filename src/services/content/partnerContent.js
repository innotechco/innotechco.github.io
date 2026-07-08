import allentiaPartnerPage from "../../content/en/partners/allentia/allentia.json";
import brightideaPartnerPage from "../../content/en/partners/brightidea/brightidea.json";
import gartnerPartnerPage from "../../content/en/partners/gartner/gartner.json";
import idcPartnerPage from "../../content/en/partners/idc/idc.json";
import itonicsPartnerPage from "../../content/en/partners/itonics/itonics.json";
import leanPartnerPage from "../../content/en/partners/lean/lean.json";
import lensorgPartnerPage from "../../content/en/partners/lensorg/lensorg.json";
import marketResearchPartnerPage from "../../content/en/partners/market-research/market-research.json";
import randMPartnerPage from "../../content/en/partners/r-and-m/r-and-m.json";
import sharjahPartnerPage from "../../content/en/partners/sharjah/sharjah.json";
import startinPartnerPage from "../../content/en/partners/startin/startin.json";
import statistaPartnerPage from "../../content/en/partners/statista/statista.json";
import trexPartnerPage from "../../content/en/partners/trex/trex.json";
import {partnerConfig} from "../../config/partners.config";
import {fetchJsonFromApi} from "./utils";

const partnerContent = {
  allentia: allentiaPartnerPage,
  brightidea: brightideaPartnerPage,
  gartner: gartnerPartnerPage,
  idc: idcPartnerPage,
  itonics: itonicsPartnerPage,
  lean: leanPartnerPage,
  lensorg: lensorgPartnerPage,
  "market-research": marketResearchPartnerPage,
  "r-and-m": randMPartnerPage,
  sharjah: sharjahPartnerPage,
  startin: startinPartnerPage,
  statista: statistaPartnerPage,
  trex: trexPartnerPage,
};

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
