import {normalizeLocale} from "../../i18n/locale";

const DEFAULT_HOME_PATH = "/wp-json/innotech/v1/content/home";
const DEFAULT_HOME_SLUG_PREFIX = "innotech-home-content";

function trimTrailingSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

function buildCmsUrl(path, locale) {
  const baseUrl = trimTrailingSlash(import.meta.env.VITE_CMS_BASE_URL);
  if (!baseUrl || !path) return null;

  const url = new URL(path, `${baseUrl}/`);
  url.searchParams.set("lang", normalizeLocale(locale));
  return url.toString();
}

function stripHtml(value) {
  if (typeof value !== "string") return "";
  if (typeof window !== "undefined" && window.DOMParser) {
    const doc = new window.DOMParser().parseFromString(value, "text/html");
    return doc.documentElement.textContent || "";
  }
  return value.replace(/<[^>]*>/g, "");
}

function parseJsonContentPage(response) {
  const page = Array.isArray(response) ? response[0] : response;
  const rendered = page?.content?.rendered;
  if (!rendered) return null;
  return JSON.parse(stripHtml(rendered));
}

function isWordPressPageResponse(response) {
  return Array.isArray(response) || response?.content?.rendered;
}

function buildHomePageUrl(locale) {
  const slugPrefix = import.meta.env.VITE_CMS_HOME_SLUG_PREFIX ?? DEFAULT_HOME_SLUG_PREFIX;
  if (slugPrefix) {
    const slug = `${slugPrefix}-${normalizeLocale(locale)}`;
    return buildCmsUrl(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`, locale);
  }

  const path = import.meta.env.VITE_CMS_HOME_PATH || DEFAULT_HOME_PATH;
  return buildCmsUrl(path, locale);
}

export function isCmsEnabled() {
  return import.meta.env.VITE_CMS_ENABLED === "true" &&
    import.meta.env.VITE_CMS_HOME_ENABLED === "true";
}

export async function fetchWordPressHomePage(locale, {signal} = {}) {
  if (!isCmsEnabled()) return null;

  const url = buildHomePageUrl(locale);
  if (!url) return null;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`WordPress home content request failed: ${response.status}`);
  }

  const json = await response.json();
  return isWordPressPageResponse(json) ? parseJsonContentPage(json) : json;
}
