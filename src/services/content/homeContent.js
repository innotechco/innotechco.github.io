import homePage from "../../content/en/pages/home/home.json";
import inlearnAcademyPage from "../../content/en/pages/inlearn-academy.json";
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
  return buildHomePage(homePage, homeConfig);
}

export function getInlearnAcademyPage() {
  return inlearnAcademyPage;
}
