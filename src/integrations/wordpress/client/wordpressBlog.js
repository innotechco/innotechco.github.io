import {normalizeLocale} from "../../../shared/i18n/locale.js";
import {getWordPressCategoryTerms} from "../adapters/blogOrdering.js";
import {INDUSTRY_CATEGORY_LABELS} from "../../../shared/config/industries.config.js";

const DEFAULT_BLOG_PER_PAGE = 50;
const EXCLUDED_SLUGS = new Set(["hello", "hello-world"]);
/* Structural buckets, not topics: never offered as an archive filter. */
const EXCLUDED_CATEGORY_SLUGS = new Set(["uncategorized", "what-we-think"]);
/* The five industry rows come from the registry, because the same wording is
   also the navigation label for that page - written twice, the card pill and
   the menu drift apart. The rest are categories with no page of their own. */
const CATEGORY_LABELS = {
  ...INDUSTRY_CATEGORY_LABELS,
  "ai-agents": "AI Agents",
  "digital-transformation": "Digital Transformation",
  foresight: "Strategic Foresight",
  inception: "INCEPTION",
  infinity: "INFINITY",
  insight: "INSIGHT",
  "market-research": "Market Research",
  sustainability: "Sustainability",
  "what-we-think": "What We Think",
};

function trimTrailingSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

function getBaseUrl() {
  return trimTrailingSlash(import.meta.env.VITE_CMS_BASE_URL);
}

export function isBlogEnabled() {
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

/* The widest the site ever draws one of these: the event card's picture column
   on a large monitor. Anything bigger is pixels nobody sees. */
const LARGEST_RENDITION_NEEDED = 1000;

/* WordPress keeps several renditions of every upload and answers with all of
   them; source_url is the untouched original. Editors upload what the camera or
   the image generator gave them, so that original is routinely two or three
   megabytes of PNG for a card 500px wide - which is why these pictures arrived
   long after the words did.
 *
 * This picks the smallest rendition that is still big enough to draw sharply,
 * and only falls back to the original when WordPress has nothing else. */
function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return undefined;

  const renditions = Object.values(media.media_details?.sizes ?? {})
    .filter((size) => size?.source_url && Number(size.width) > 0)
    .sort((a, b) => a.width - b.width);

  const bigEnough = renditions.find((size) => size.width >= LARGEST_RENDITION_NEEDED);
  const largest = renditions[renditions.length - 1];

  return bigEnough?.source_url ?? largest?.source_url ?? media.source_url;
}

/* Every rendition worth offering, as a srcset, so the browser can pick by the
   width it is actually drawing and by the screen it is drawing on. A phone
   showing this card 375px wide then takes the 768 - a third of the bytes of the
   one a monitor takes - without the page having to know which is which.
 *
 * The thumbnails are left out: 150 and 300 are too small for any card here, and
 * an entry the browser might choose on a slow connection is an entry that can
 * come back blurred. */
const SMALLEST_RENDITION_OFFERED = 700;
/* And nothing above this. A retina screen asks for twice the drawn width, which
   would reach for the 1536 or the original - another 700KB and 1.2MB of PNG for
   detail nobody can see on a card this size. */
const LARGEST_RENDITION_OFFERED = 1100;

function getFeaturedImageSrcSet(post) {
  const sizes = post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes ?? {};

  const entries = Object.values(sizes)
    .filter(
      (size) =>
        size?.source_url &&
        Number(size.width) >= SMALLEST_RENDITION_OFFERED &&
        Number(size.width) <= LARGEST_RENDITION_OFFERED,
    )
    .sort((a, b) => a.width - b.width)
    .map((size) => `${size.source_url} ${size.width}w`);

  return entries.length > 1 ? entries.join(", ") : "";
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

/**
 * WordPress emits an empty `<p>` between most blocks (roughly half of the
 * paragraphs in a long post). They carry no content but each one adds a
 * paragraph gap, which is what makes the spacing of an article look uneven.
 * A paragraph counts as empty only when it holds no text and no media.
 */
function removeEmptyParagraphs(doc) {
  Array.from(doc.body.querySelectorAll("p")).forEach((paragraph) => {
    if (paragraph.querySelector("img, iframe, video, audio, picture, svg")) return;
    /* &nbsp; is whitespace to a reader but not to trim(). */
    if (paragraph.textContent.replace(/[\s\u00a0]+/g, "")) return;
    paragraph.remove();
  });
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
        level: 1,
        showInToc: false,
        html: rendered,
        paragraphs: getPostParagraphs(post),
      },
    ];
  }

  const doc = new window.DOMParser().parseFromString(rendered, "text/html");
  removeEmptyParagraphs(doc);
  Array.from(doc.body.querySelectorAll("a[href]")).forEach((link) => {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", Array.from(rel).join(" "));
  });
  const bodyNodes = Array.from(doc.body.childNodes);
  const getHeadingLevel = (node) =>
    node.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(node.tagName)
      ? Number(node.tagName.slice(1))
      : 0;

  /* Editors do not always start the body at H2 - some articles use H1 for their
     top-level sections. The article title is the page's only H1, so the whole
     body is shifted down until its shallowest heading is an H2. Ranks stay
     relative, which keeps the real H2 -> H3 hierarchy intact for the TOC. */
  const headingLevels = bodyNodes.map(getHeadingLevel).filter(Boolean);
  const levelShift = headingLevels.length ? 2 - Math.min(...headingLevels) : 0;
  const normalizeLevel = (level) => Math.min(6, Math.max(2, level + levelShift));

  const renderHeading = (node, level) => {
    if (level === Number(node.tagName.slice(1))) return node.outerHTML;
    const replacement = doc.createElement(`h${level}`);
    Array.from(node.attributes).forEach((attribute) =>
      replacement.setAttribute(attribute.name, attribute.value),
    );
    replacement.innerHTML = node.innerHTML;
    return replacement.outerHTML;
  };

  const sections = [];
  let current = {
    type: "wordpress",
    id: "wordpress-introduction",
    heading: title,
    level: 1,
    html: "",
    showInToc: false,
  };

  bodyNodes.forEach((node, index) => {
    const headingLevel = getHeadingLevel(node);
    if (headingLevel) {
      if (current.html.trim()) sections.push(current);
      const heading = node.textContent.trim() || title;
      const level = normalizeLevel(headingLevel);
      current = {
        type: "wordpress",
        id: slugifyHeading(heading, `wordpress-section-${index}`),
        heading,
        level,
        html: renderHeading(node, level),
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
          level: 1,
          showInToc: false,
          html: rendered,
          paragraphs: getPostParagraphs(post),
        },
      ];
}

function normalizeCategorySlug(value) {
  return String(value ?? "insight").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "insight";
}

/* An untouched WordPress category is named after its own slug ("metals-mining").
   Once an editor gives it a real name ("Steel and Mining") that name wins, so
   renaming a category in WordPress takes effect on the site immediately. */
function looksLikeRawSlug(name, slug) {
  return !name || name === slug || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
}

function resolveCategoryLabel(term) {
  const slug = term?.slug ?? "";
  const name = decodeHtml(term?.name ?? "");
  if (!looksLikeRawSlug(name, slug)) return name;
  return CATEGORY_LABELS[slug] || CATEGORY_LABELS[normalizeCategorySlug(name)] || name;
}

function normalizePost(post) {
  const title = decodeHtml(post?.title?.rendered);
  const description = stripHtml(post?.excerpt?.rendered || post?.content?.rendered)
    .replace(/\s+/g, " ")
    .trim();
  const readTime = getField(post, "innotech_read_time");
  const image = getFeaturedImage(post) || "";
  const imageSrcSet = getFeaturedImageSrcSet(post);
  const categoryTerms = getWordPressCategoryTerms(post);
  const primaryCategory = categoryTerms.find((term) => term.slug !== "what-we-think") ?? categoryTerms[0];
  /* Always key off the real WordPress slug: it stays stable when a category is
     renamed, so filters keep matching. */
  const categorySlug = normalizeCategorySlug(primaryCategory?.slug || primaryCategory?.name);
  const category = primaryCategory ? resolveCategoryLabel(primaryCategory) : "";
  const categories = categoryTerms.length
    ? categoryTerms.map((term) => normalizeCategorySlug(term.slug || term.name))
    : [categorySlug];

  return {
    id: String(post.id),
    wpId: post.id,
    isCmsArticle: true,
    imageSrcSet,
    slug: post.slug,
    title,
    description,
    date: formatDate(post.date),
    publishedAt: post.date,
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

/* Everything a CARD needs, and nothing else.

   content.rendered - the whole article body - is deliberately absent. It is
   43% of a post's payload, and asking for fifty of them was 559KB on every
   page of the site, including pages that never show an article body at all.

   _links has to stay: it is what _embed hangs the featured image and the
   category terms off, and without it a card loses its picture. */
const CARD_FIELDS = "id,slug,link,date,title,excerpt,meta,categories,_links";

/* The article page asks for the body as well, for one post at a time. */
const ARTICLE_FIELDS = `${CARD_FIELDS},content`;

/* `limit`      how many posts. Cards want a handful; the archive wants all.
   `withContent`  only the article page, and only for the post it is showing.
   `include`    specific post ids, for the related row - ordered by the caller,
                because WordPress returns them by date. */
function buildPostsUrl({slug, locale, limit, withContent = false, include} = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !isBlogEnabled()) return null;

  const url = new URL("/wp-json/wp/v2/posts", `${baseUrl}/`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("_fields", withContent ? ARTICLE_FIELDS : CARD_FIELDS);
  url.searchParams.set(
    "per_page",
    String(limit ?? import.meta.env.VITE_CMS_BLOG_PER_PAGE ?? DEFAULT_BLOG_PER_PAGE),
  );
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("lang", normalizeLocale(locale));
  if (slug) url.searchParams.set("slug", slug);
  if (include?.length) url.searchParams.set("include", include.join(","));
  return url.toString();
}

function buildCategoriesUrl(locale) {
  const baseUrl = getBaseUrl();
  if (!baseUrl || !isBlogEnabled()) return null;

  const url = new URL("/wp-json/wp/v2/categories", `${baseUrl}/`);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("orderby", "name");
  url.searchParams.set("order", "asc");
  url.searchParams.set("_fields", "id,name,slug,count");
  url.searchParams.set("lang", normalizeLocale(locale));
  return url.toString();
}

/**
 * Every category defined in WordPress, so the archive filter rail is driven by
 * the CMS instead of a hard-coded list. `label` prefers the curated display
 * name; a category added in WordPress falls back to the name the editor typed.
 */
export async function fetchWordPressCategories({locale} = {}) {
  const url = buildCategoriesUrl(locale);
  if (!url) return null;

  const response = await fetch(url, {headers: {Accept: "application/json"}});
  if (!response.ok) {
    throw new Error(`WordPress categories request failed: ${response.status}`);
  }

  const categories = await response.json();
  return categories
    .filter((category) => !EXCLUDED_CATEGORY_SLUGS.has(category.slug))
    .map((category) => ({
      slug: category.slug,
      count: category.count,
      label: resolveCategoryLabel(category),
    }));
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

/* One article, with its body, plus the handful it points at.

   This used to pull the whole list and search it - which is why the body of
   every post had to be in that list, and why a visitor reading one article
   downloaded fifty of them. Now it asks for the one it is showing, and then
   for the two or three it links to, as cards.

   Two small requests instead of one large one, and the large one is no longer
   large for everybody else either. */
export async function fetchWordPressPost(slug, options = {}) {
  const posts = await fetchWordPressPosts({...options, slug, limit: 1, withContent: true});
  const article = posts?.[0];
  if (!article) return null;

  const relatedIds = article.relatedPostIds ?? [];
  /* No request at all when the editor picked nothing. */
  const relatedPool = relatedIds.length
    ? (await fetchWordPressPosts({...options, include: relatedIds, limit: relatedIds.length})) ?? []
    : [];

  /* Mapped over the editor's ids rather than over what came back, because the
     order the editor chose is the order the cards appear in - and WordPress
     returns them by date. */
  const relationshipRelated = relatedIds
    .map((relatedId) => relatedPool.find((post) => Number(post.wpId) === Number(relatedId)))
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
      /* The renditions WordPress already made. Without this the related card
         falls back to whatever the editor uploaded, which is the full-size
         PNG - the same thing that made these cards sit empty. */
      imageSrcSet: post.imageSrcSet,
    })),
  };
}
