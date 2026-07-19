import {localizedModule} from "../../i18n/locale";
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
  const modules = import.meta.glob("../../content/{en,ar,tr}/pages/who-we-are/*.json", {eager: true, import: "default"});
  const whoWeArePage = localizedModule(modules, "../../content/en/pages/who-we-are/who-we-are.json");
  return buildWhoWeArePage(whoWeArePage, whoWeAreConfig);
}
