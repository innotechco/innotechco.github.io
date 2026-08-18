/**
 * Shared presentation rules for every article card in the site
 * (Home > Our latest news, Home > Live insights, Industries > Live insight,
 * What We Think, Archive).
 *
 * Keep every card summary rule in this file so the four sections stay in sync.
 */

/** Maximum number of words shown in a card summary before it is cut with "...". */
export const CARD_SUMMARY_WORD_LIMIT = 35;

/** Number of cards rendered by the Live Insights sections. */
export const LIVE_INSIGHTS_CARD_COUNT = 3;

/**
 * Home reads one date-ordered list: "Our latest news" takes post 1 and
 * Live Insights takes posts 2-4, so the two sections never show the same post.
 */
export const HOME_LIVE_INSIGHTS_START_INDEX = 1;

/**
 * Fixed aspect ratio of the single-article hero image.
 * The CEO should upload hero images at 16:9, minimum 1920x1080.
 */
export const ARTICLE_HERO_ASPECT_RATIO = "16 / 9";

/**
 * WordPress category slug for every industry page that renders a Live Insight section.
 * Frontend route slug -> WordPress category slug.
 */
export const INDUSTRY_CATEGORY_SLUGS = {
  automotive: "automotive",
  "energy-and-materials": "energy-materials",
  health: "health",
  "high-tech": "high-tech",
  "metals-and-mining": "metals-mining",
};

/**
 * Stable colour per archive category pill.
 * Background and text stay inside the same colour family while keeping
 * enough contrast to remain readable in both themes.
 */
export const CATEGORY_PILL_COLORS = {
  insight: {background: "#0f3728", text: "#8ee6bb", lightBackground: "#d8f4e6", lightText: "#0d5137"},
  inception: {background: "#0d3040", text: "#8ddcf2", lightBackground: "#d6eef8", lightText: "#0b4257"},
  infinity: {background: "#241d47", text: "#c3b6f4", lightBackground: "#e6e1fa", lightText: "#3a2f73"},
  automotive: {background: "#3a1f16", text: "#f2b79a", lightBackground: "#fbe4d8", lightText: "#7a3a20"},
  "energy-materials": {background: "#3d3211", text: "#efd489", lightBackground: "#fbf0cf", lightText: "#6d5809"},
  health: {background: "#3a1327", text: "#f3a8c6", lightBackground: "#fbdde9", lightText: "#7c1f44"},
  "high-tech": {background: "#122c47", text: "#93c4f5", lightBackground: "#dbe9fb", lightText: "#134070"},
  "metals-mining": {background: "#2a2f33", text: "#bcc9d3", lightBackground: "#e2e8ed", lightText: "#3c474f"},
  "ai-agents": {background: "#123a34", text: "#8fe4d4", lightBackground: "#d5f2ec", lightText: "#0d5146"},
  "market-research": {background: "#33223f", text: "#dcaef2", lightBackground: "#f2ddfa", lightText: "#5c2f72"},
  "digital-transformation": {background: "#0f2f3a", text: "#8ad6e6", lightBackground: "#d7eef4", lightText: "#0d4d5e"},
  sustainability: {background: "#1c3512", text: "#b3e58c", lightBackground: "#e2f5d3", lightText: "#33601c"},
  foresight: {background: "#2c2740", text: "#c1b9ea", lightBackground: "#e5e2f6", lightText: "#413a6b"},
  "what-we-think": {background: "#123227", text: "#8edeb8", lightBackground: "#d9f2e5", lightText: "#0f5138"},
  "product-development": {background: "#33291a", text: "#e8c795", lightBackground: "#f8ead4", lightText: "#6a4f22"},
};

/** Colour used when a category has no explicit entry above. */
export const DEFAULT_CATEGORY_PILL_COLOR = {
  background: "#25302b",
  text: "#a9c9ba",
  lightBackground: "#e3ece7",
  lightText: "#3c5449",
};

export function getCategoryPillColor(slug, isDarkMode) {
  const palette = CATEGORY_PILL_COLORS[slug] ?? DEFAULT_CATEGORY_PILL_COLOR;
  return isDarkMode
    ? {background: palette.background, color: palette.text}
    : {background: palette.lightBackground, color: palette.lightText};
}
