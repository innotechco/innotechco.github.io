import {localizedModule} from "../../shared/i18n/locale.js";
import {whoWeAreConfig} from "./whoWeAre.config.js";
import {mergeArrayById} from "../../shared/content/utils.js";

function buildWhoWeArePage(content, config = {}) {
  return {
    ...content,
    images: config.images,
    stats: mergeArrayById(content.stats, config.stats),
  };
}

export function getWhoWeArePage() {
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/who-we-are/*.json", {eager: true, import: "default"});
  const whoWeArePage = localizedModule(modules, "../../content/en/pages/who-we-are/who-we-are.json");
  return buildWhoWeArePage(whoWeArePage, whoWeAreConfig);
}
