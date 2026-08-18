import {INDUSTRY_CATEGORY_SLUGS} from "../../config/articleCards.config.js";

const WHAT_WE_THINK_CATEGORY = "what-we-think";

export function getWordPressCategoryTerms(post) {
  return (post?._embedded?.["wp:term"] ?? [])
    .flat()
    .filter((term) => term.taxonomy === "category");
}

export function getWhatWeThinkPosts(posts = []) {
  return posts.filter((post) => post.categories?.includes(WHAT_WE_THINK_CATEGORY));
}

function getPublishedTime(post) {
  const value = post?.publishedAt ?? post?.date;
  const time = value ? new Date(value).getTime() : Number.NaN;
  return Number.isFinite(time) ? time : 0;
}

/**
 * The one ordering used by every list on the site: newest post first.
 *
 * What We Think, Archive, the home Live Insights and the industry Live Insight
 * sections all read from this function, so a new post lands at the top of all
 * of them in exactly the same order.
 */
export function orderPosts(posts = []) {
  return [...posts].sort((a, b) => getPublishedTime(b) - getPublishedTime(a));
}

export const orderPostsForArchives = orderPosts;

/** Posts tagged with the WordPress category that belongs to an industry page. */
export function getIndustryPosts(posts = [], industrySlug) {
  const categorySlug = INDUSTRY_CATEGORY_SLUGS[industrySlug];
  if (!categorySlug) return [];

  return orderPosts(posts).filter((post) => post.categories?.includes(categorySlug));
}
