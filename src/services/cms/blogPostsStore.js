import {fetchWordPressPosts} from "./wordpressBlog";
import {getActiveLocale} from "../../i18n/locale";

const FRESHNESS_MS = 60_000;

const cache = new Map();

/**
 * Single source of truth for WordPress posts.
 *
 * Every section that shows article cards (home latest news, home live insights,
 * industry live insights, What We Think and Archive) reads from this store, so
 * they always agree on content and ordering. Entries expire after one minute so
 * a newly published post shows up on the next fetch instead of a stale cache.
 */
export function loadBlogPosts(locale = getActiveLocale()) {
  const entry = cache.get(locale);
  if (entry && Date.now() - entry.createdAt < FRESHNESS_MS) return entry.promise;

  const promise = fetchWordPressPosts({locale}).catch((error) => {
    cache.delete(locale);
    throw error;
  });

  cache.set(locale, {createdAt: Date.now(), promise});
  return promise;
}

export function clearBlogPostsCache() {
  cache.clear();
}
