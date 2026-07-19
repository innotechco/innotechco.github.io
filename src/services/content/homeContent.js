import {localizedModule} from "../../i18n/locale";
import {homeConfig} from "../../config/home.config";
import {mergeArrayById} from "./utils";

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

export function getHomePage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/**/*.json", {eager: true, import: "default"});
  return buildHomePage(localizedModule(modules, "../../content/en/pages/home/home.json"), homeConfig);
}

export function getInlearnAcademyPage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/**/*.json", {eager: true, import: "default"});
  return localizedModule(modules, "../../content/en/pages/inlearn-academy.json");
}
