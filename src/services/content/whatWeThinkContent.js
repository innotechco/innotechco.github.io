import archivesPage from "../../content/en/pages/what-we-think/archives.json";
import whatWeThinkPage from "../../content/en/pages/what-we-think/what-we-think.json";
import {whatWeThinkConfig} from "../../config/whatWeThink.config";
import {mergeRecord} from "./utils";

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

export function getWhatWeThinkPage() {
  return buildWhatWeThinkPage(whatWeThinkPage, whatWeThinkConfig);
}

export function getArchivesPage() {
  return archivesPage;
}
