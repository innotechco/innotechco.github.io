import {localizedModule} from "../../i18n/locale";
import {serviceConfig} from "../../config/services.config";
import {fetchJsonFromApi, mergeArrayById} from "./utils";

const modules = import.meta.glob("../../content/{en,ar,tr}/services/*.json", {eager: true, import: "default"});
const serviceContent = Object.fromEntries(["inception", "infinity", "insight"].map((slug) => [slug, localizedModule(modules, `../../content/en/services/${slug}.json`)]));

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

export function getServicePage(slug) {
  return buildServicePage(serviceContent[slug], serviceConfig[slug]);
}

export async function fetchServicePage(slug) {
  const apiContent = await fetchJsonFromApi(`/services/${slug}`);
  return apiContent
    ? buildServicePage(apiContent, serviceConfig[slug])
    : getServicePage(slug);
}
