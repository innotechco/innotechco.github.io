import {normalizeLocale} from "../../i18n/locale";
import {getWordPressCategoryTerms} from "./blogOrdering";

const DEFAULT_BLOG_PER_PAGE = 50;
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

function getField(post, ...names) {
  for (const name of names) {
    const acfValue = post?.acf?.[name];
    if (acfValue !== undefined && acfValue !== null && acfValue !== "") return acfValue;

    const metaValue = post?.meta?.[name];
    if (metaValue !== undefined && metaValue !== null && metaValue !== "") return metaValue;
  }

  return null;
}

function normalizeRelatedIds(value) {
  const items = Array.isArray(value) ? value : String(value ?? "").split(",");
  return items
    .map((item) => {
      if (typeof item === "object") return item.ID ?? item.id ?? null;
      const numeric = Number(String(item).trim());
      return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
    })
    .filter(Boolean)
    .slice(0, 3);
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
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

function slugifyHeading(value, fallback) {
  const slug = String(value ?? "")
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;\s]+;/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function getWordPressSections(post, title) {
  const rendered = post?.content?.rendered ?? "";
  if (!rendered.trim()) return [];

  if (typeof window === "undefined") {
    return [
      {
        type: "wordpress",
        id: "wordpress-content",
        heading: title,
        html: rendered,
        paragraphs: getPostParagraphs(post),
      },
    ];
  }

  const doc = new window.DOMParser().parseFromString(rendered, "text/html");
  Array.from(doc.body.querySelectorAll("a[href]")).forEach((link) => {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", Array.from(rel).join(" "));
  });
  const sections = [];
  let current = {
    type: "wordpress",
    id: "wordpress-introduction",
    heading: title,
    html: "",
    showInToc: false,
  };

  Array.from(doc.body.childNodes).forEach((node, index) => {
    const isHeading = node.nodeType === Node.ELEMENT_NODE && /^H[2-3]$/.test(node.tagName);
    if (isHeading) {
      if (current.html.trim()) sections.push(current);
      const heading = node.textContent.trim() || title;
      current = {
        type: "wordpress",
        id: slugifyHeading(heading, `wordpress-section-${index}`),
        heading,
        html: node.outerHTML,
      };
      return;
    }

    current.html += node.outerHTML ?? node.textContent ?? "";
  });

  if (current.html.trim()) sections.push(current);
  return sections.length
    ? sections
    : [
        {
          type: "wordpress",
          id: "wordpress-content",
          heading: title,
          html: rendered,
          paragraphs: getPostParagraphs(post),
        },
      ];
}

function normalizeCategorySlug(value) {
  return String(value ?? "insight").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "insight";
}

function normalizePost(post) {
  const title = decodeHtml(post?.title?.rendered);
  const description = stripHtml(post?.excerpt?.rendered || post?.content?.rendered)
    .replace(/\s+/g, " ")
    .trim();
  const readTime = getField(post, "innotech_read_time");
  const image = getFeaturedImage(post) || "";
  const categoryTerms = getWordPressCategoryTerms(post);
  const primaryCategory = categoryTerms.find((term) => term.slug !== "what-we-think") ?? categoryTerms[0];
  const rawCategory = decodeHtml(primaryCategory?.name || "");
  const categorySlug = normalizeCategorySlug(rawCategory);
  const category = CATEGORY_LABELS[categorySlug] || rawCategory;
  const categories = categoryTerms.length
    ? categoryTerms.map((term) => normalizeCategorySlug(term.slug || term.name))
    : [categorySlug];

  return {
    id: String(post.id),
    wpId: post.id,
    isCmsArticle: true,
    slug: post.slug,
    title,
    description,
    date: formatDate(post.date),
    readTime: typeof readTime === "string" ? readTime : "",
    categories,
    category,
    image,
    introduction: [],
    sections: getWordPressSections(post, title),
    relatedPostIds: normalizeRelatedIds(getField(post, "innotech_related_posts")),
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
  const posts = await fetchWordPressPosts(options);
  const article = posts?.find((post) => post.slug === slug);
  if (!article) return null;

  const relationshipRelated = (article.relatedPostIds ?? [])
    .map((relatedId) => posts.find((post) => Number(post.wpId) === Number(relatedId)))
    .filter(Boolean);
  return {
    ...article,
    related: relationshipRelated.map((post) => ({
      title: post.title,
      description: post.description,
      slug: post.slug,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
    })),
  };
}
