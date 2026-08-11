import {normalizeLocale} from "../../i18n/locale";
import {getWordPressCategoryTerms} from "./blogOrdering";

const DEFAULT_BLOG_PER_PAGE = 50;
const DEFAULT_IMAGE_KEY = "customerEcosystemInsights";
const EXCLUDED_SLUGS = new Set(["hello", "hello-world"]);
const CATEGORY_LABELS = {
  "ai-agents": "AI Agents",
  automotive: "Automotive",
  "digital-transformation": "Digital Transformation",
  "energy-materials": "Oil, Gas and Petrochemical",
  foresight: "Strategic Foresight",
  health: "Healthcare and Life Sciences",
  "high-tech": "High Tech and AI",
  inception: "INCEPTION",
  infinity: "INFINITY",
  insight: "INSIGHT",
  "market-research": "Market Research",
  "metals-mining": "Steel and Mining",
  sustainability: "Sustainability",
  "what-we-think": "What We Think",
};

function trimTrailingSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

function getBaseUrl() {
  return trimTrailingSlash(import.meta.env.VITE_CMS_BASE_URL);
}

function isBlogEnabled() {
  return import.meta.env.VITE_CMS_ENABLED === "true" &&
    import.meta.env.VITE_CMS_BLOG_ENABLED !== "false";
}

function decodeHtml(value) {
  const text = String(value ?? "");
  if (typeof window === "undefined") {
    return text
      .replace(/&quot;/g, "\"")
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "-")
      .replace(/&#8212;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function stripHtml(value) {
  const text = String(value ?? "");
  if (typeof window === "undefined") return decodeHtml(text.replace(/<[^>]*>/g, " "));

  const doc = new window.DOMParser().parseFromString(text, "text/html");
  return doc.body.textContent || "";
}

function getFeaturedImage(post) {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function estimateReadMinutes(text) {
  const words = stripHtml(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function getPostParagraphs(post) {
  const rendered = post?.content?.rendered ?? "";
  if (typeof window === "undefined") {
    return stripHtml(rendered).split(/\n+/).map((item) => item.trim()).filter(Boolean);
  }

  const doc = new window.DOMParser().parseFromString(rendered, "text/html");
  const paragraphs = Array.from(doc.body.querySelectorAll("p, li"))
    .map((node) => node.textContent.trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs : [stripHtml(rendered).trim()].filter(Boolean);
}

function normalizeCategorySlug(value) {
  return String(value ?? "insight").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "insight";
}

function normalizePost(post) {
  const title = decodeHtml(post?.title?.rendered);
  const description = stripHtml(post?.excerpt?.rendered || post?.content?.rendered)
    .replace(/\s+/g, " ")
    .trim();
  const readMinutes = estimateReadMinutes(post?.content?.rendered);
  const image = getFeaturedImage(post);
  const categoryTerms = getWordPressCategoryTerms(post);
  const primaryCategory = categoryTerms.find((term) => term.slug !== "what-we-think") ?? categoryTerms[0];
  const rawCategory = decodeHtml(primaryCategory?.name || "Insight");
  const categorySlug = normalizeCategorySlug(rawCategory);
  const category = CATEGORY_LABELS[categorySlug] || rawCategory;
  const categories = categoryTerms.length
    ? categoryTerms.map((term) => normalizeCategorySlug(term.slug || term.name))
    : [categorySlug];

  return {
    id: String(post.id),
    slug: post.slug,
    title,
    description,
    date: formatDate(post.date),
    readMinutes,
    readTime: `${readMinutes} minutes read`,
    categories,
    category,
    image,
    heroAssetKey: DEFAULT_IMAGE_KEY,
    contentAssetKey: "aiAgentFirst",
    introduction: [],
    sections: [
      {
        type: "wordpress",
        id: "wordpress-content",
        heading: title,
        showInBody: false,
        html: post?.content?.rendered ?? "",
        paragraphs: getPostParagraphs(post),
      },
    ],
    related: [],
  };
}

function buildPostsUrl({slug, locale} = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !isBlogEnabled()) return null;

  const url = new URL("/wp-json/wp/v2/posts", `${baseUrl}/`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", import.meta.env.VITE_CMS_BLOG_PER_PAGE || DEFAULT_BLOG_PER_PAGE);
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("lang", normalizeLocale(locale));
  if (slug) url.searchParams.set("slug", slug);
  return url.toString();
}

export async function fetchWordPressPosts(options = {}) {
  const url = buildPostsUrl(options);
  if (!url) return null;

  const response = await fetch(url, {headers: {Accept: "application/json"}});
  if (!response.ok) throw new Error(`WordPress posts request failed: ${response.status}`);

  const posts = await response.json();
  return posts
    .filter((post) => !EXCLUDED_SLUGS.has(post.slug))
    .map(normalizePost);
}

export async function fetchWordPressPost(slug, options = {}) {
  const posts = await fetchWordPressPosts({...options, slug});
  return posts?.[0] ?? null;
}
