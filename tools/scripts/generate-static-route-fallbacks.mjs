import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const indexPath = path.join(distRoot, "index.html");
const contentRoot = path.resolve("src/content/en");
const cmsBaseUrl = process.env.VITE_CMS_BASE_URL || "https://blog.innotech.global";
const siteBaseUrl = (process.env.SITE_BASE_URL || "https://innotech.global").replace(/\/+$/, "");
const blogEnabled = process.env.VITE_CMS_ENABLED === "true" &&
  process.env.VITE_CMS_BLOG_ENABLED !== "false";

const staticRoutes = [
  "archives",
  "what-we-think",
  "who-we-are",
  "inlearn",
  "request-for-proposal",
  "what-we-do/inception",
  "what-we-do/insight",
  "what-we-do/infinity",
  "automotive",
  "energy-and-materials",
  "health",
  "high-tech",
  "metals-and-mining",
];

function readContent(relativePath) {
  const file = path.join(contentRoot, relativePath);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

const navigation = readContent("navigation.json") ?? {};

/* Every route served the same <title> and description, so search engines saw
   40+ identical pages. Titles and descriptions come from the same English
   content the app renders - nothing here is written by hand. Where the content
   has no description, the route falls back to the site-wide one rather than
   inventing copy. */
function buildRouteMetadata() {
  const metadata = new Map();

  const add = (route, title, description) => {
    if (title) metadata.set(route, {title, description: description || ""});
  };

  const heroOf = (relativePath) => readContent(relativePath)?.hero ?? {};

  const whoWeAre = heroOf("pages/who-we-are/who-we-are.json");
  add("who-we-are", whoWeAre.title, whoWeAre.description);

  const rfp = heroOf("rfp.json");
  add("request-for-proposal", rfp.title, rfp.description);

  const inlearn = readContent("pages/inlearn-academy.json") ?? {};
  add("inlearn", inlearn.title && `INLEARN Academy - ${inlearn.title}`);

  /* These two pages are card grids with no hero block of their own, so their
     titles come from the navigation labels the site already shows. */
  const navTitle = (index) => navigation.searchItems?.[index]?.title;
  add("what-we-think", navTitle(2));
  add("archives", "Archives");

  for (const item of navigation.serviceMenuItems ?? []) {
    add(`what-we-do/${item.id}`, item.label, item.description);
  }

  const industrySlugs = {
    energyAndMaterials: "energy-and-materials",
    metalsAndMining: "metals-and-mining",
    highTech: "high-tech",
    health: "health",
    automotive: "automotive",
  };
  for (const item of navigation.industryMenuItems ?? []) {
    const slug = industrySlugs[item.id];
    const hero = slug ? heroOf(`industries/${slug}.json`) : {};
    if (slug) add(slug, item.label, hero.description);
  }

  return metadata;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function collapse(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

/* A missed replacement here is invisible - the page still builds, it just
   ships the wrong metadata - so every substitution has to match exactly once
   and the build fails loudly if index.html stops looking the way we expect. */
function replaceOnce(html, pattern, replacement, label, route) {
  const matches = html.match(new RegExp(pattern.source, `${pattern.flags}g`));
  if (matches?.length !== 1) {
    throw new Error(
      `Expected exactly one ${label} in index.html for /${route}, found ${matches?.length ?? 0}. ` +
        "index.html and this script have drifted apart.",
    );
  }
  return html.replace(pattern, replacement);
}

/* Rewrites the head of the prebuilt index.html for one route. The document is
   otherwise untouched, so the SPA still boots exactly as it does at "/". */
function applyRouteMetadata(html, route, meta) {
  const canonical = new URL(route ? `/${route}/` : "/", `${siteBaseUrl}/`).toString();
  const title = escapeHtml(collapse(`${meta.title} | Innotech`));
  const description = collapse(meta.description);

  const substitutions = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "<title>"],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`, "og:title"],
    [/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`, "twitter:title"],
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${canonical}$2`, "canonical link"],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${canonical}$2`, "og:url"],
  ];

  if (description) {
    const escaped = escapeHtml(description);
    substitutions.push(
      [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escaped}$2`, "description"],
      [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escaped}$2`, "og:description"],
      [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escaped}$2`, "twitter:description"],
    );
  }

  return substitutions.reduce(
    (output, [pattern, replacement, label]) =>
      replaceOnce(output, pattern, replacement, label, route),
    html,
  );
}

function writeRouteIndex(route, html) {
  const directory = path.join(distRoot, route);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, "index.html"), html);
}

/* public/robots.txt advertises this file, so it is built from the same route
   list that produces the static entries - the two cannot drift apart. */
function writeSitemap(routes) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = ["", ...routes].map((route) => {
    const loc = new URL(route ? `/${route}/` : "/", `${siteBaseUrl}/`).toString();
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(distRoot, "sitemap.xml"), sitemap);
}

function stripHtml(value) {
  return collapse(String(value ?? "").replace(/<[^>]*>/g, ""));
}

async function getArticles() {
  if (!blogEnabled) return [];

  const url = new URL("/wp-json/wp/v2/posts", `${cmsBaseUrl.replace(/\/+$/, "")}/`);
  url.searchParams.set("per_page", process.env.VITE_CMS_BLOG_PER_PAGE || "50");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch WordPress posts for static routes: ${response.status}`);
  }

  const posts = await response.json();
  return posts
    .filter((post) => post.slug && !["hello", "hello-world"].includes(post.slug))
    .map((post) => ({
      route: `articles/${post.slug}`,
      title: stripHtml(post.title?.rendered),
      description: stripHtml(post.excerpt?.rendered).slice(0, 200),
    }));
}

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run build first.");
}

const html = fs.readFileSync(indexPath, "utf8");
const metadata = buildRouteMetadata();
const articles = await getArticles();

for (const article of articles) {
  if (article.title) {
    metadata.set(article.route, {title: article.title, description: article.description});
  }
}

const routes = [...staticRoutes, ...articles.map(({route}) => route)];

for (const route of routes) {
  const meta = metadata.get(route);
  writeRouteIndex(route, meta ? applyRouteMetadata(html, route, meta) : html);
}

fs.writeFileSync(path.join(distRoot, "404.html"), html);
writeSitemap(routes);

console.log(
  `Generated ${routes.length} static route fallbacks ` +
    `(${metadata.size} with page metadata) and sitemap.xml.`,
);
