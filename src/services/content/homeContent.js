import {localizedModule} from "../../i18n/locale";
import {homeConfig} from "../../config/home.config";
import {normalizeHomeContent} from "../cms/normalizeHomeContent";
import {fetchWordPressHomePage} from "../cms/wordpressClient";
import {mergeArrayById} from "./utils";

function restoreRemoteImages(contentCards = [], mergedCards = []) {
  const cardsById = new Map(contentCards.map((card) => [card.id, card]));
  return mergedCards.map((card) => {
    const remoteCard = cardsById.get(card.id);
    return remoteCard?.image ? {...card, image: remoteCard.image} : card;
  });
}

function mergeSection(defaultSection = {}, remoteSection = {}) {
  return {
    ...defaultSection,
    ...remoteSection,
  };
}

function mergeRemoteHomePage(defaultContent, remoteContent) {
  return {
    ...defaultContent,
    ...remoteContent,
    hero: mergeSection(defaultContent.hero, remoteContent.hero),
    latestNews: mergeSection(defaultContent.latestNews, remoteContent.latestNews),
    liveInsights: {
      ...defaultContent.liveInsights,
      ...remoteContent.liveInsights,
      cards: remoteContent.liveInsights?.cards?.length
        ? remoteContent.liveInsights.cards
        : defaultContent.liveInsights?.cards,
    },
    globalFootprint: mergeSection(
      defaultContent.globalFootprint,
      remoteContent.globalFootprint,
    ),
    ecosystemCards: remoteContent.ecosystemCards?.length
      ? remoteContent.ecosystemCards
      : defaultContent.ecosystemCards,
  };
}

function buildHomePage(content, config = {}, options = {}) {
  const mergedCards = mergeArrayById(
    content.liveInsights?.cards,
    config.liveInsights?.cards,
  );

  return {
    ...content,
    liveInsights: {
      ...content.liveInsights,
      cards: options.preferContentImages
        ? restoreRemoteImages(content.liveInsights?.cards, mergedCards)
        : mergedCards,
    },
  };
}

export function getHomePage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/**/*.json", {eager: true, import: "default"});
  return buildHomePage(localizedModule(modules, "../../content/en/pages/home/home.json"), homeConfig);
}

export async function fetchHomePage(locale, {signal} = {}) {
  const response = await fetchWordPressHomePage(locale, {signal});
  if (!response) return null;

  const localContent = getHomePage();
  const remoteContent = normalizeHomeContent(response);

  return buildHomePage(mergeRemoteHomePage(localContent, remoteContent), homeConfig, {
    preferContentImages: true,
  });
}

export function getInlearnAcademyPage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/**/*.json", {eager: true, import: "default"});
  return localizedModule(modules, "../../content/en/pages/inlearn-academy.json");
}
