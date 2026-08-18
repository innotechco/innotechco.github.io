import {fetchWordPressCategories, fetchWordPressPosts} from "./wordpressBlog";
import {getActiveLocale} from "../../i18n/locale";

const FRESHNESS_MS = 60_000;

const cache = new Map();
const categoryCache = new Map();

function loadCached(store, locale, loader) {
  const entry = store.get(locale);
  if (entry && Date.now() - entry.createdAt < FRESHNESS_MS) return entry.promise;

  const promise = loader().catch((error) => {
    store.delete(locale);
    throw error;
  });

  store.set(locale, {createdAt: Date.now(), promise});
  return promise;
}

/**
 * Single source of truth for WordPress posts.
 *
 * Every section that shows article cards (home latest news, home live insights,
 * industry live insights, What We Think and Archive) reads from this store, so
 * they always agree on content and ordering. Entries expire after one minute so
 * a newly published post shows up on the next fetch instead of a stale cache.
 */
export function loadBlogPosts(locale = getActiveLocale()) {
  return loadCached(cache, locale, () => fetchWordPressPosts({locale}));
}

/**
 * Categories defined in WordPress, used to build the archive filter rail.
 * Shares the one-minute freshness window, so a category added in WordPress
 * shows up on the next load instead of being pinned to a stale list.
 */
export function loadBlogCategories(locale = getActiveLocale()) {
  return loadCached(categoryCache, locale, () => fetchWordPressCategories({locale}));
}

export function clearBlogPostsCache() {
  cache.clear();
  categoryCache.clear();
}
