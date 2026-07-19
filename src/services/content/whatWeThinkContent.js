import {localizedModule} from "../../i18n/locale";
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
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/what-we-think/*.json", {eager: true, import: "default"});
  const whatWeThinkPage = localizedModule(modules, "../../content/en/pages/what-we-think/what-we-think.json");
  return buildWhatWeThinkPage(whatWeThinkPage, whatWeThinkConfig);
}

export function getArchivesPage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/what-we-think/*.json", {eager: true, import: "default"});
  return localizedModule(modules, "../../content/en/pages/what-we-think/archives.json");
}
