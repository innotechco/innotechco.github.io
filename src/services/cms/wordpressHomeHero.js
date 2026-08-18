import {normalizeLocale} from "../../i18n/locale";

const HOME_HERO_PATH = "/wp-json/innotech/v1/home-hero";

function trimTrailingSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

function isHomeHeroEnabled() {
  return import.meta.env.VITE_CMS_ENABLED === "true";
}

/**
 * The home hero card as the CEO edits it under WordPress > INNOTECH Home.
 *
 * Only the fields that were actually filled in come back, so anything left
 * blank keeps whatever the site already shows. Returns null when the CMS is
 * off or the plugin is not installed yet.
 */
export async function fetchWordPressHomeHero(locale, {signal} = {}) {
  const baseUrl = trimTrailingSlash(import.meta.env.VITE_CMS_BASE_URL);
  if (!baseUrl || !isHomeHeroEnabled()) return null;

  const url = new URL(HOME_HERO_PATH, `${baseUrl}/`);
  url.searchParams.set("lang", normalizeLocale(locale));

  const response = await fetch(url.toString(), {
    headers: {Accept: "application/json"},
    signal,
  });

  if (!response.ok) return null;

  const hero = await response.json();
  return hero && typeof hero === "object" && !Array.isArray(hero) ? hero : null;
}
