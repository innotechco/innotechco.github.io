import aiAgentPage from "../content/en/pages/ai-agent.json";
import homePage from "../content/en/pages/home/home.json";
import inlearnAcademyPage from "../content/en/pages/inlearn-academy.json";
import archivesPage from "../content/en/pages/what-we-think/archives.json";
import whatWeThinkPage from "../content/en/pages/what-we-think/what-we-think.json";
import whoWeArePage from "../content/en/pages/who-we-are/who-we-are.json";
import allentiaPartnerPage from "../content/en/partners/allentia/allentia.json";
import brightideaPartnerPage from "../content/en/partners/brightidea/brightidea.json";
import gartnerPartnerPage from "../content/en/partners/gartner/gartner.json";
import idcPartnerPage from "../content/en/partners/idc/idc.json";
import itonicsPartnerPage from "../content/en/partners/itonics/itonics.json";
import leanPartnerPage from "../content/en/partners/lean/lean.json";
import lensorgPartnerPage from "../content/en/partners/lensorg/lensorg.json";
import sharjahPartnerPage from "../content/en/partners/sharjah/sharjah.json";
import startinPartnerPage from "../content/en/partners/startin/startin.json";
import statistaPartnerPage from "../content/en/partners/statista/statista.json";
import trexPartnerPage from "../content/en/partners/trex/trex.json";
import automotivePage from "../content/en/industries/automotive.json";
import energyAndMaterialsPage from "../content/en/industries/energy-and-materials.json";
import healthPage from "../content/en/industries/health.json";
import highTechPage from "../content/en/industries/high-tech.json";
import metalsAndMiningPage from "../content/en/industries/metals-and-mining.json";
import inceptionPage from "../content/en/services/inception.json";
import infinityPage from "../content/en/services/infinity.json";
import insightPage from "../content/en/services/insight.json";
import {homeConfig} from "../config/home.config";
import {industryConfig} from "../config/industries.config";
import {partnerConfig} from "../config/partners.config";
import {serviceConfig} from "../config/services.config";
import {whatWeThinkConfig} from "../config/whatWeThink.config";
import {whoWeAreConfig} from "../config/whoWeAre.config";

const contentApiBaseUrl = import.meta.env.VITE_CONTENT_API_BASE_URL;

const industryContent = {
  automotive: automotivePage,
  "energy-and-materials": energyAndMaterialsPage,
  health: healthPage,
  "high-tech": highTechPage,
  "metals-and-mining": metalsAndMiningPage,
};

const serviceContent = {
  inception: inceptionPage,
  infinity: infinityPage,
  insight: insightPage,
};

const partnerContent = {
  allentia: allentiaPartnerPage,
  brightidea: brightideaPartnerPage,
  gartner: gartnerPartnerPage,
  idc: idcPartnerPage,
  itonics: itonicsPartnerPage,
  lean: leanPartnerPage,
  lensorg: lensorgPartnerPage,
  sharjah: sharjahPartnerPage,
  startin: startinPartnerPage,
  statista: statistaPartnerPage,
  trex: trexPartnerPage,
};

const articleModules = import.meta.glob("../content/en/articles/*.json", {
  eager: true,
  import: "default",
});

const articlesBySlug = Object.values(articleModules).reduce((articles, article) => {
  articles[article.slug] = article;
  return articles;
}, {});

function mergeRecord(contentRecord, configRecord) {
  return {
    ...contentRecord,
    ...(configRecord ?? {}),
  };
}

function mergeArrayById(contentItems = [], configItemsById = {}) {
  return contentItems.map((item) => mergeRecord(item, configItemsById[item.id]));
}

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

function buildServicePage(content, config = {}) {
  return {
    ...content,
    partners: mergeArrayById(content.partners, config.partners),
    showcase: {
      ...content.showcase,
      ...(config.showcase ?? {}),
    },
  };
}

function buildPartnerPage(content, config = {}) {
  if (!content) return null;

  return {
    ...content,
    assets: config.assets ?? {},
    theme: config.theme,
  };
}

function buildHomePage(content, config = {}) {
  return {
    ...content,
    liveInsights: {
      ...content.liveInsights,
      cards: mergeArrayById(
        content.liveInsights?.cards,
        config.liveInsights?.cards,
      ),
    },
  };
}

function buildWhatWeThinkPage(content, config = {}) {
  return {
    ...content,
    cards: Object.fromEntries(
      Object.entries(content.cards).map(([key, card]) => [
        key,
        mergeRecord(card, config.cards?.[key]),
      ]),
    ),
  };
}

function buildWhoWeArePage(content, config = {}) {
  return {
    ...content,
    images: config.images,
    stats: mergeArrayById(content.stats, config.stats),
  };
}

async function fetchJsonFromApi(path) {
  if (!contentApiBaseUrl) return null;

  const response = await fetch(`${contentApiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Content API request failed: ${response.status}`);
  }

  return response.json();
}

export function getHomePage() {
  return buildHomePage(homePage, homeConfig);
}

export function getAiAgentPage() {
  return aiAgentPage;
}

export function getInlearnAcademyPage() {
  return inlearnAcademyPage;
}

export function getWhatWeThinkPage() {
  return buildWhatWeThinkPage(whatWeThinkPage, whatWeThinkConfig);
}

export function getArchivesPage() {
  return archivesPage;
}

export function getWhoWeArePage() {
  return buildWhoWeArePage(whoWeArePage, whoWeAreConfig);
}

export function getIndustryPage(slug) {
  return buildIndustryPage(industryContent[slug], industryConfig[slug]);
}

export function getServicePage(slug) {
  return buildServicePage(serviceContent[slug], serviceConfig[slug]);
}

export function getPartnerPage(slug) {
  return buildPartnerPage(partnerContent[slug], partnerConfig[slug]);
}

export function getArticle(slug) {
  return articlesBySlug[slug] ?? null;
}

export function getArticleSlugs() {
  return Object.keys(articlesBySlug);
}

export async function fetchIndustryPage(slug) {
  const apiContent = await fetchJsonFromApi(`/industries/${slug}`);
  return apiContent
    ? buildIndustryPage(apiContent, industryConfig[slug])
    : getIndustryPage(slug);
}

export async function fetchServicePage(slug) {
  const apiContent = await fetchJsonFromApi(`/services/${slug}`);
  return apiContent
    ? buildServicePage(apiContent, serviceConfig[slug])
    : getServicePage(slug);
}

export async function fetchPartnerPage(slug) {
  const apiContent = await fetchJsonFromApi(`/partners/${slug}`);
  return apiContent
    ? buildPartnerPage(apiContent, partnerConfig[slug])
    : getPartnerPage(slug);
}

export async function fetchArticle(slug) {
  return (await fetchJsonFromApi(`/articles/${slug}`)) ?? getArticle(slug);
}
