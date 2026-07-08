import inceptionPage from "../../content/en/services/inception.json";
import infinityPage from "../../content/en/services/infinity.json";
import insightPage from "../../content/en/services/insight.json";
import {serviceConfig} from "../../config/services.config";
import {fetchJsonFromApi, mergeArrayById} from "./utils";

const serviceContent = {
  inception: inceptionPage,
  infinity: infinityPage,
  insight: insightPage,
};

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
