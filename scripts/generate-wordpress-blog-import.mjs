import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "wordpress-import");
const siteUrl = "https://blog.innotech.global";

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value = "") {
  return `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dateToWp(value, fallback = "2026-01-01") {
  const date = new Date(value || fallback);
  if (Number.isNaN(date.getTime())) return `${fallback} 09:00:00`;
  return `${date.toISOString().slice(0, 10)} 09:00:00`;
}

function parseDate(value) {
  if (!value) return "2026-01-01";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "2026-01-01" : parsed.toISOString().slice(0, 10);
}

function paragraphsToHtml(paragraphs = []) {
  return paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeXml(paragraph)}</p>`)
    .join("\n");
}

function renderArticleSection(section) {
  const parts = [];
  if (section.heading && section.showInBody !== false) parts.push(`<h2>${escapeXml(section.heading)}</h2>`);
  if (section.content) parts.push(`<p>${escapeXml(section.content)}</p>`);
  if (section.paragraphs) parts.push(paragraphsToHtml(section.paragraphs));
  if (section.bullets) {
    parts.push(`<ul>${section.bullets.map((item) => `<li>${escapeXml(item)}</li>`).join("")}</ul>`);
  }
  if (section.afterBullets) parts.push(paragraphsToHtml(section.afterBullets));
  if (section.subheading) parts.push(`<h3>${escapeXml(section.subheading)}</h3>`);
  if (section.after) parts.push(paragraphsToHtml(section.after));
  if (section.subsections) {
    section.subsections.forEach((subsection) => {
      if (subsection.heading) parts.push(`<h3>${escapeXml(subsection.heading)}</h3>`);
      if (subsection.paragraphs) parts.push(paragraphsToHtml(subsection.paragraphs));
    });
  }
  if (section.caption) parts.push(`<p><em>${escapeXml(section.caption)}</em></p>`);
  return parts.filter(Boolean).join("\n");
}

function renderFullArticle(article) {
  return [
    paragraphsToHtml(article.introduction ?? []),
    ...(article.sections ?? []).map(renderArticleSection),
  ].filter(Boolean).join("\n\n");
}

function makePost({
  slug,
  title,
  excerpt,
  content,
  date,
  categories = ["insight"],
  source,
  readMinutes,
}) {
  return {
    slug,
    title,
    excerpt,
    content,
    date: dateToWp(parseDate(date)),
    categories,
    source,
    readMinutes,
  };
}

function collectPosts() {
  const posts = [];
  const article = readJson("src/content/en/articles/product-portfolio-management.json");
  posts.push(makePost({
    slug: article.slug,
    title: article.title,
    excerpt: article.description,
    content: renderFullArticle(article),
    date: article.date,
    categories: [article.category ?? "Product Development"],
    source: "local-article",
    readMinutes: Number.parseInt(article.readTime, 10) || 2,
  }));

  const archives = readJson("src/content/en/pages/what-we-think/archives.json");
  archives.items.forEach((item) => {
    posts.push(makePost({
      slug: item.id,
      title: item.title,
      excerpt: item.description,
      content: `<p>${escapeXml(item.description)}</p>`,
      date: item.date,
      categories: item.categories ?? ["insight"],
      source: "local-archives",
      readMinutes: item.readMinutes,
    }));
  });

  const whatWeThink = readJson("src/content/en/pages/what-we-think/what-we-think.json");
  Object.entries(whatWeThink.cards).forEach(([key, card]) => {
    posts.push(makePost({
      slug: `what-we-think-${slugify(card.title || key)}`,
      title: card.title,
      excerpt: card.description,
      content: `<p>${escapeXml(card.description)}</p>`,
      date: card.date,
      categories: ["what-we-think"],
      source: `local-what-we-think:${key}`,
      readMinutes: Number.parseInt(card.readTime, 10) || 2,
    }));
  });

  const seen = new Set();
  return posts.filter((post) => {
    const key = post.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderWxr(posts) {
  const now = new Date().toUTCString();
  const categories = [...new Set(posts.flatMap((post) => post.categories))];
  const categoryXml = categories.map((category) => {
    const slug = slugify(category);
    return [
      "<wp:category>",
      `<wp:term_id>${categories.indexOf(category) + 1}</wp:term_id>`,
      `<wp:category_nicename>${escapeXml(slug)}</wp:category_nicename>`,
      `<wp:cat_name>${cdata(category)}</wp:cat_name>`,
      "</wp:category>",
    ].join("\n");
  }).join("\n");

  const itemXml = posts.map((post, index) => {
    const postId = 1000 + index;
    return [
      "<item>",
      `<title>${escapeXml(post.title)}</title>`,
      `<link>${siteUrl}/${post.slug}/</link>`,
      `<pubDate>${new Date(post.date.replace(" ", "T")).toUTCString()}</pubDate>`,
      `<dc:creator>${cdata("bardia")}</dc:creator>`,
      `<guid isPermaLink="false">${siteUrl}/?p=${postId}</guid>`,
      `<description>${cdata(post.excerpt)}</description>`,
      `<content:encoded>${cdata(post.content)}</content:encoded>`,
      `<excerpt:encoded>${cdata(post.excerpt)}</excerpt:encoded>`,
      `<wp:post_id>${postId}</wp:post_id>`,
      `<wp:post_date>${post.date}</wp:post_date>`,
      `<wp:post_date_gmt>${post.date}</wp:post_date_gmt>`,
      `<wp:comment_status>closed</wp:comment_status>`,
      `<wp:ping_status>closed</wp:ping_status>`,
      `<wp:post_name>${escapeXml(post.slug)}</wp:post_name>`,
      `<wp:status>publish</wp:status>`,
      `<wp:post_parent>0</wp:post_parent>`,
      `<wp:menu_order>0</wp:menu_order>`,
      `<wp:post_type>post</wp:post_type>`,
      `<wp:post_password></wp:post_password>`,
      `<wp:is_sticky>0</wp:is_sticky>`,
      ...post.categories.map((category) =>
        `<category domain="category" nicename="${escapeXml(slugify(category))}">${cdata(category)}</category>`),
      "<wp:postmeta>",
      "<wp:meta_key>_innotech_import_source</wp:meta_key>",
      `<wp:meta_value>${cdata(post.source)}</wp:meta_value>`,
      "</wp:postmeta>",
      "<wp:postmeta>",
      "<wp:meta_key>_innotech_read_minutes</wp:meta_key>",
      `<wp:meta_value>${cdata(post.readMinutes ?? "")}</wp:meta_value>`,
      "</wp:postmeta>",
      "</item>",
    ].join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
<title>INNOTECH Blog Local Import</title>
<link>${siteUrl}</link>
<description>Local What We Think, Archives, and Articles migrated from React JSON.</description>
<pubDate>${now}</pubDate>
<language>en</language>
<wp:wxr_version>1.2</wp:wxr_version>
<wp:base_site_url>${siteUrl}</wp:base_site_url>
<wp:base_blog_url>${siteUrl}</wp:base_blog_url>
<wp:author>
<wp:author_id>1</wp:author_id>
<wp:author_login>${cdata("bardia")}</wp:author_login>
<wp:author_email>${cdata("")}</wp:author_email>
<wp:author_display_name>${cdata("bardia")}</wp:author_display_name>
<wp:author_first_name>${cdata("")}</wp:author_first_name>
<wp:author_last_name>${cdata("")}</wp:author_last_name>
</wp:author>
${categoryXml}
${itemXml}
</channel>
</rss>
`;
}

const posts = collectPosts();
fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(path.join(outDir, "innotech-blog-import.xml"), renderWxr(posts), "utf8");
fs.writeFileSync(path.join(outDir, "innotech-blog-import-manifest.json"), JSON.stringify(posts, null, 2), "utf8");

console.log(`Generated ${posts.length} WordPress posts`);
console.log(path.join(outDir, "innotech-blog-import.xml"));
