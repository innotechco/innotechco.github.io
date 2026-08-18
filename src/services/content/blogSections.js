import {LIVE_INSIGHTS_CARD_COUNT} from "../../config/articleCards.config.js";
import {truncateWords} from "./cardSummary";

/** Route of the single-article page for a WordPress post. */
export function getArticlePath(slug) {
  return slug ? `/articles/${slug}` : undefined;
}

/**
 * Turns the newest WordPress post into the Home > "Our latest news" section,
 * keeping the section title and any image fallback from local content.
 */
export function buildLatestNewsFromPost(defaultLatestNews = {}, post) {
  if (!post) return defaultLatestNews;

  return {
    ...defaultLatestNews,
    headline: post.title || defaultLatestNews.headline,
    date: post.date || defaultLatestNews.date,
    readTime: post.readTime || "",
    summary: truncateWords(post.description) || defaultLatestNews.summary,
    image: post.image || defaultLatestNews.image,
    imageAlt: post.title || defaultLatestNews.imageAlt,
    slug: post.slug,
  };
}

/**
 * Maps WordPress posts onto Live Insight cards. Card ids, images and alt text
 * fall back to the matching local card so the layout never loses an image.
 */
export function buildLiveInsightCards(defaultCards = [], posts = [], count = LIVE_INSIGHTS_CARD_COUNT) {
  const selected = posts.slice(0, count);
  if (!selected.length) return defaultCards;

  const cards = selected.map((post, index) => {
    const fallback = defaultCards[index] ?? {};
    return {
      ...fallback,
      id: fallback.id ?? `live-insight-${post.slug}`,
      title: post.title || fallback.title,
      date: post.date || fallback.date,
      readTime: post.readTime || "",
      description: truncateWords(post.description) || fallback.description,
      image: post.image || fallback.image,
      imageAlt: post.title || fallback.imageAlt,
      slug: post.slug,
    };
  });

  return cards.length >= defaultCards.length
    ? cards
    : [...cards, ...defaultCards.slice(cards.length)];
}
