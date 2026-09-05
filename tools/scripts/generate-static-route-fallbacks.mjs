import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const indexPath = path.join(distRoot, "index.html");
const cmsBaseUrl = process.env.VITE_CMS_BASE_URL || "https://blog.innotech.global";
const blogEnabled = process.env.VITE_CMS_ENABLED === "true" &&
  process.env.VITE_CMS_BLOG_ENABLED !== "false";

const staticRoutes = [
  "archives",
  "what-we-think",
  "who-we-are",
  "inlearn-academy",
  "what-we-do/inception",
  "what-we-do/insight",
  "what-we-do/infinity",
  "automotive",
  "energy-and-materials",
  "health",
  "high-tech",
  "metals-and-mining",
];

function writeRouteIndex(route, html) {
  const directory = path.join(distRoot, route);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, "index.html"), html);
}

async function getArticleRoutes() {
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
    .map((post) => `articles/${post.slug}`);
}

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run build first.");
}

const html = fs.readFileSync(indexPath, "utf8");
const routes = [...staticRoutes, ...(await getArticleRoutes())];

routes.forEach((route) => writeRouteIndex(route, html));
fs.writeFileSync(path.join(distRoot, "404.html"), html);

console.log(`Generated ${routes.length} static route fallbacks.`);
