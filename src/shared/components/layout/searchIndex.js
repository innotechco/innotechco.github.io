/* The navbar search index is built from every content JSON in the site, which
   is far too much to sit in the entry chunk: navData.js used to pull all of it
   in eagerly, for all three locales, just so the search panel had something to
   filter. The globs here are deliberately lazy and only the active locale's
   files are ever fetched, so the index is downloaded the first time the user
   opens search and never on first paint. */

import {getActiveLocale} from "../../i18n/locale.js";
import {routes} from "../../../app/routes.js";
import {navigationContent} from "./navData.js";

const serviceModules = import.meta.glob("../../../content/{en,ar,tr}/services/*.json", {
  import: "default",
});
const industryModules = import.meta.glob("../../../content/{en,ar,tr}/industries/*.json", {
  import: "default",
});
const articleModules = import.meta.glob("../../../content/{en,ar,tr}/articles/*.json", {
  import: "default",
});
const partnerModules = import.meta.glob("../../../content/{en,ar,tr}/partners/**/*.json", {
  import: "default",
});
const pageModules = import.meta.glob("../../../content/{en,ar,tr}/pages/**/*.json", {
  import: "default",
});

const searchRoutes = [routes.whoWeAre, null, routes.whatWeThink, routes.inlearnAcademy, "https://stimanalytics.ai", routes.rfp];

const serviceRoutesBySlug = {
  inception: routes.inception,
  insight: routes.insight,
  infinity: routes.infinity,
};

const industryRoutesBySlug = {
  automotive: routes.automotive,
  "energy-and-materials": routes.energyAndMaterials,
  health: routes.health,
  "high-tech": routes.highTech,
  "metals-and-mining": routes.metalsAndMining,
};

const pageRouteByPath = {
  "who-we-are/who-we-are": routes.whoWeAre,
  "what-we-think/what-we-think": routes.whatWeThink,
  "what-we-think/archives": routes.archives,
  "inlearn-academy": routes.inlearnAcademy,
};

const serviceLabelsBySlug = Object.fromEntries(
  navigationContent.serviceMenuItems.map((item) => [item.id, item.label]),
);

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

/* Resolves only the entries under the active locale, so a visitor downloads one
   language's content instead of all three. */
async function loadLocaleModules(modules) {
  const localePrefix = `/content/${getActiveLocale()}/`;

  return Promise.all(
    Object.entries(modules)
      .filter(([modulePath]) => modulePath.includes(localePrefix))
      .map(async ([modulePath, load]) => [modulePath, await load()]),
  );
}

async function makeContentItems(modules, type, getRoute) {
  const entries = await loadLocaleModules(modules);

  return entries
    .flatMap(([modulePath, content]) => {
      const slug = content.slug ?? modulePath.split("/").pop().replace(".json", "");
      const to = getRoute(slug, modulePath);
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

const manualSearchItems = navigationContent.searchItems
  .slice(0, 6)
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

const typePriority = {
  Industry: 0,
  Service: 1,
  Partner: 2,
  Article: 3,
  Page: 4,
};

/* Ranks index entries against a query: exact title match first, then partial
   title matches, then body matches - ties broken by content type and title. */
export function rankSearchResults(items, query) {
  const normalizedQuery = query ? normalizeSearchText(query) : "";
  const queryTokens = normalizedQuery
    .split(" ")
    .filter((token) => token && token !== "and");

  if (queryTokens.length === 0) return [];

  return items
    .map((item) => {
      const matchedPart = item.searchParts?.find((part) => {
        const normalizedPart = normalizeSearchText(part);

        return queryTokens.every((token) => normalizedPart.includes(token));
      });

      if (!matchedPart) return null;

      const normalizedTitle = normalizeSearchText(item.title);
      const titleTokensMatch = queryTokens.every((token) =>
        normalizedTitle.includes(token),
      );

      return {
        ...item,
        matchText: matchedPart,
        rank:
          normalizedTitle === normalizedQuery
            ? 0
            : normalizedTitle.includes(normalizedQuery) || titleTokensMatch
              ? 1
              : 2,
        typeRank: typePriority[item.type] ?? 9,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        a.typeRank - b.typeRank ||
        a.title.localeCompare(b.title),
    )
    .slice(0, 10);
}

let searchItemsPromise;

/* Cached on the module, so repeatedly opening the search panel only ever pays
   for the content fetch once. */
export function loadSearchItems() {
  searchItemsPromise ??= buildSearchItems();
  return searchItemsPromise;
}

async function buildSearchItems() {
  const contentSearchItems = (
    await Promise.all([
      makeContentItems(serviceModules, "Service", (slug) => serviceRoutesBySlug[slug]),
      makeContentItems(industryModules, "Industry", (slug) => industryRoutesBySlug[slug]),
      makeContentItems(articleModules, "Article", (slug) =>
        routes.article.replace(":slug", slug),
      ),
      makeContentItems(partnerModules, "Partner", (slug) =>
        routes.partner.replace(":slug", slug),
      ),
      makeContentItems(pageModules, "Page", (_, modulePath) => {
        const key = modulePath
          .replace(new RegExp(`../../content/${getActiveLocale()}/pages/`), "")
          .replace(".json", "");
        return pageRouteByPath[key];
      }),
    ])
  ).flat();

  return Array.from(
    new Map(
      [...manualSearchItems, ...contentSearchItems].map((item) => [
        `${item.to}-${item.title}`,
        {...item, title: compactTitle(item.title)},
      ]),
    ).values(),
  );
}
