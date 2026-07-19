import {getActiveLocale, localizedModule} from "../../i18n/locale";
import {navigationConfig} from "../../config/navigation.config";
import {routes} from "../../routes";

const navigationModules = import.meta.glob("../../content/{en,ar,tr}/navigation.json", {eager: true, import: "default"});
const navigationContent = localizedModule(navigationModules, "../../content/en/navigation.json");
const serviceModules = import.meta.glob("../../content/{en,ar,tr}/services/*.json", {
  eager: true,
  import: "default",
});
const industryModules = import.meta.glob("../../content/{en,ar,tr}/industries/*.json", {
  eager: true,
  import: "default",
});
const articleModules = import.meta.glob("../../content/{en,ar,tr}/articles/*.json", {
  eager: true,
  import: "default",
});
const partnerModules = import.meta.glob("../../content/{en,ar,tr}/partners/**/*.json", {
  eager: true,
  import: "default",
});
const pageModules = import.meta.glob("../../content/{en,ar,tr}/pages/**/*.json", {
  eager: true,
  import: "default",
});

const searchRoutes = [routes.whoWeAre, null, routes.whatWeThink, routes.inlearnAcademy, "https://stimanalytics.ai"];

const serviceRoutesBySlug = {
  inception: routes.inception,
  insight: routes.insight,
  infinity: routes.infinity,
};

const serviceLabelsBySlug = Object.fromEntries(
  navigationContent.serviceMenuItems.map((item) => [item.id, item.label]),
);

const industryRoutesBySlug = {
  automotive: routes.automotive,
  "energy-and-materials": routes.energyAndMaterials,
  health: routes.health,
  "high-tech": routes.highTech,
  "metals-and-mining": routes.metalsAndMining,
};

const searchableKeys = new Set([
  "body",
  "breadcrumbLabel",
  "description",
  "headline",
  "heading",
  "label",
  "name",
  "paragraphs",
  "subtitle",
  "summary",
  "title",
]);

function normalizeText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeSearchText(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectSearchText(value, output = []) {
  if (!value) return output;

  if (typeof value === "string" || typeof value === "number") {
    const text = normalizeText(value);
    if (text.length > 2) output.push(text);
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectSearchText(item, output));
    return output;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (searchableKeys.has(key)) {
        collectSearchText(item, output);
      } else if (typeof item === "object") {
        collectSearchText(item, output);
      }
    });
  }

  return output;
}

function compactTitle(text) {
  const normalized = normalizeText(text);
  return normalized.length > 92 ? `${normalized.slice(0, 89)}...` : normalized;
}

function makeItem({content, fallbackTitle, to, type}) {
  const title = normalizeText(
    content?.hero?.title ??
      content?.title ??
      content?.seo?.title ??
      fallbackTitle,
  );
  const description = normalizeText(
    content?.hero?.description ?? content?.description ?? content?.seo?.description ?? "",
  );
  const allText = [...new Set([title, description])].filter(Boolean);

  return {
    title,
    type,
    to,
    matchText: title,
    searchParts: allText,
    searchText: normalizeSearchText(allText.join(" ")),
  };
}

function makeSearchItem({title, type, to, parts = [], matchText}) {
  const cleanTitle = normalizeText(title);
  const searchParts = [...new Set([cleanTitle, ...parts.map(normalizeText)])]
    .filter((part) => part.length > 2);

  return {
    title: cleanTitle,
    type,
    to,
    matchText: matchText ?? cleanTitle,
    searchParts,
    searchText: normalizeSearchText(searchParts.join(" ")),
  };
}

function getResultType(type) {
  return type === "Archive" ? "Article" : type;
}

function makeSectionItems(content, type, to) {
  const items = [];
  const addItem = (section, sectionType) => {
    if (!section) return;
    const title =
      section.title ??
      section.heading ??
      section.label ??
      section.name ??
      section.subtitle;
    if (!title) return;

    const normalizedSectionType = getResultType(sectionType);
    items.push(
      makeSearchItem({
        title,
        type: normalizedSectionType,
        to,
        parts: collectSearchText(section),
      }),
    );
  };

  content.partners?.forEach((partner) => addItem(partner, type));
  content.capabilities?.forEach((capability) => addItem(capability, type));
  content.actions?.forEach((action) => addItem(action, type));
  content.showcase?.cards?.forEach((card) => addItem(card, type));
  content.ecosystemCards?.forEach((card) => addItem(card, type));
  content.liveInsights?.cards?.forEach((card) => addItem(card, "Archive"));
  content.items?.forEach((item) => addItem(item, "Archive"));
  content.sections?.forEach((section) => addItem(section, "Article"));

  if (content.cards && typeof content.cards === "object") {
    Object.values(content.cards).forEach((card) => addItem(card, "Article"));
  }

  if (content.road) addItem(content.road, type);
  content.road?.items?.forEach((item) => addItem(item, type));

  return items;
}

function makeContentItems(modules, type, getRoute) {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/content/${getActiveLocale()}/`))
    .flatMap(([path, content]) => {
      const slug = content.slug ?? path.split("/").pop().replace(".json", "");
      const to = getRoute(slug, path);
      if (!to) return [];
      const fallbackTitle =
        type === "Service" ? serviceLabelsBySlug[slug] ?? slug : slug;
      return [
        makeItem({content, fallbackTitle, to, type}),
        ...makeSectionItems(content, type, to),
      ];
    })
    .filter((item) => item.to);
}

const pageRouteByPath = {
  "who-we-are/who-we-are": routes.whoWeAre,
  "what-we-think/what-we-think": routes.whatWeThink,
  "what-we-think/archives": routes.archives,
  "inlearn-academy": routes.inlearnAcademy,
};

const manualSearchItems = navigationContent.searchItems
  .slice(0, 5)
  .map((item, index) => ({
    ...item,
    type: "Page",
    to: searchRoutes[index],
    isExternal: searchRoutes[index]?.startsWith("http") ?? false,
    matchText: item.title,
    searchParts: [item.title, "Page"],
    searchText: normalizeSearchText(`${item.title} Page`),
  }))
  .filter((item) => item.to);

const contentSearchItems = [
  ...makeContentItems(serviceModules, "Service", (slug) => serviceRoutesBySlug[slug]),
  ...makeContentItems(industryModules, "Industry", (slug) => industryRoutesBySlug[slug]),
  ...makeContentItems(articleModules, "Article", (slug) =>
    routes.article.replace(":slug", slug),
  ),
  ...makeContentItems(partnerModules, "Partner", (slug) =>
    routes.partner.replace(":slug", slug),
  ),
  ...makeContentItems(pageModules, "Page", (_, path) => {
    const key = path
      .replace(new RegExp(`../../content/${getActiveLocale()}/pages/`), "")
      .replace(".json", "");
    return pageRouteByPath[key];
  }),
];

export const searchItems = Array.from(
  new Map(
    [...manualSearchItems, ...contentSearchItems].map((item) => [
      `${item.to}-${item.title}`,
      {...item, title: compactTitle(item.title)},
    ]),
  ).values(),
);
export const languageOptions = [
  {code: "en", label: "EN", name: "English"},
  {code: "tr", label: "TR", name: "Türkçe"},
  {code: "ar", label: "AR", name: "العربية"},
];
export const serviceMenuItems = navigationContent.serviceMenuItems.map((item) => ({
  ...item,
  to: navigationConfig.serviceRoutes[item.id],
}));
export const industryMenuItems = navigationContent.industryMenuItems.map(
  (item) => ({
    ...item,
    to: navigationConfig.industryRoutes[item.id],
  }),
);
