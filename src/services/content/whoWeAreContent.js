import whoWeArePage from "../../content/en/pages/who-we-are/who-we-are.json";
import {whoWeAreConfig} from "../../config/whoWeAre.config";
import {mergeArrayById} from "./utils";

function buildWhoWeArePage(content, config = {}) {
  return {
    ...content,
    images: config.images,
    stats: mergeArrayById(content.stats, config.stats),
  };
}

export function getWhoWeArePage() {
  return buildWhoWeArePage(whoWeArePage, whoWeAreConfig);
}
