import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";

import {industryRoutes, routes, serviceRoutes} from "../src/routes.js";
import {
  getIndustryPosts,
  getWordPressCategoryTerms,
  getWhatWeThinkPosts,
  orderPosts,
  orderPostsForArchives,
} from "../src/services/cms/blogOrdering.js";
import {truncateWords} from "../src/services/content/cardSummary.js";
import {
  buildArchiveCategories,
  buildCategoryLabels,
  isMultilineCategoryLabel,
} from "../src/services/cms/archiveCategories.js";
import {
  CARD_SUMMARY_WORD_LIMIT,
  HOME_LIVE_INSIGHTS_START_INDEX,
  INDUSTRY_CATEGORY_SLUGS,
} from "../src/config/articleCards.config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const sourceFiles = walk(srcRoot).filter((file) => /\.(js|jsx|css)$/.test(file));

test("What We Think and Archive share one newest-first ordering", () => {
  const posts = [
    {slug: "archive-old", categories: ["inception"], publishedAt: "2026-01-05T00:00:00"},
    {slug: "what-new", categories: ["what-we-think"], publishedAt: "2026-03-01T00:00:00"},
    {slug: "archive-new", categories: ["insight"], publishedAt: "2026-02-10T00:00:00"},
    {slug: "what-old", categories: ["what-we-think", "insight"], publishedAt: "2025-12-01T00:00:00"},
  ];

  const ordered = orderPosts(posts);

  assert.deepEqual(ordered.map(({slug}) => slug), [
    "what-new",
    "archive-new",
    "archive-old",
    "what-old",
  ]);
  // Archive and What We Think read the exact same list, so both stay in sync.
  assert.deepEqual(
    orderPostsForArchives(posts).map(({slug}) => slug),
    ordered.map(({slug}) => slug),
  );
  assert.deepEqual(getWhatWeThinkPosts(ordered).map(({slug}) => slug), [
    "what-new",
    "what-old",
  ]);
});

test("industry Live Insight sections only accept posts tagged with their category", () => {
  const posts = [
    {slug: "car", categories: ["automotive"], publishedAt: "2026-02-01T00:00:00"},
    {slug: "steel", categories: ["metals-mining"], publishedAt: "2026-03-01T00:00:00"},
    {slug: "untagged", categories: ["insight"], publishedAt: "2026-04-01T00:00:00"},
  ];

  assert.deepEqual(getIndustryPosts(posts, "automotive").map(({slug}) => slug), ["car"]);
  assert.deepEqual(
    getIndustryPosts(posts, "metals-and-mining").map(({slug}) => slug),
    ["steel"],
  );
  assert.deepEqual(getIndustryPosts(posts, "health"), []);

  // A category created in WordPress under the industry's real name also matches.
  const renamed = [
    {slug: "a", categories: ["steel-and-mining"], publishedAt: "2026-01-01T00:00:00"},
    {slug: "b", categories: ["oil-gas-and-petrochemical"], publishedAt: "2026-01-02T00:00:00"},
    {slug: "c", categories: ["healthcare-and-life-sciences"], publishedAt: "2026-01-03T00:00:00"},
    {slug: "d", categories: ["high-tech-and-ai"], publishedAt: "2026-01-04T00:00:00"},
  ];
  assert.deepEqual(getIndustryPosts(renamed, "metals-and-mining").map(({slug}) => slug), ["a"]);
  assert.deepEqual(getIndustryPosts(renamed, "energy-and-materials").map(({slug}) => slug), ["b"]);
  assert.deepEqual(getIndustryPosts(renamed, "health").map(({slug}) => slug), ["c"]);
  assert.deepEqual(getIndustryPosts(renamed, "high-tech").map(({slug}) => slug), ["d"]);
  assert.ok(
    Object.values(INDUSTRY_CATEGORY_SLUGS).every((slugs) => Array.isArray(slugs) && slugs.length),
  );
  assert.deepEqual(Object.keys(INDUSTRY_CATEGORY_SLUGS).sort(), [
    "automotive",
    "energy-and-materials",
    "health",
    "high-tech",
    "metals-and-mining",
  ]);
});

test("every card summary uses the one shared word limit", () => {
  const words = Array.from({length: CARD_SUMMARY_WORD_LIMIT + 12}, (_, index) => `word${index}`);
  const truncated = truncateWords(words.join(" "));

  assert.ok(truncated.endsWith("..."));
  assert.equal(truncated.replace("...", "").trim().split(" ").length, CARD_SUMMARY_WORD_LIMIT);
  assert.equal(truncateWords("short summary"), "short summary");
  assert.equal(truncateWords(""), "");

  const cardFiles = [
    path.join(srcRoot, "services", "content", "blogSections.js"),
    path.join(srcRoot, "pages", "what-we-think", "WhatWeThink.jsx"),
    path.join(srcRoot, "pages", "what-we-think", "archives", "Archives.jsx"),
  ];

  for (const file of cardFiles) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /truncateWords/, `${path.relative(root, file)} must reuse truncateWords`);
  }
});

test("WordPress posts preserve every assigned category", () => {
  const post = {
    _embedded: {
      "wp:term": [[
        {taxonomy: "category", slug: "insight"},
        {taxonomy: "category", slug: "what-we-think"},
        {taxonomy: "post_tag", slug: "ignored-tag"},
      ]],
    },
  };

  assert.deepEqual(
    getWordPressCategoryTerms(post).map(({slug}) => slug),
    ["insight", "what-we-think"],
  );
});

test("WordPress Article fields are real REST meta and Related News stays outside Body", () => {
  const plugin = fs.readFileSync(
    path.join(root, "wordpress-plugin", "innotech-article-fields", "innotech-article-fields.php"),
    "utf8",
  );
  const service = fs.readFileSync(
    path.join(srcRoot, "services", "cms", "wordpressBlog.js"),
    "utf8",
  );

  assert.match(plugin, /register_post_meta\('post', INNOTECH_READ_TIME_META/);
  assert.match(plugin, /register_post_meta\('post', INNOTECH_RELATED_POSTS_META/);
  assert.match(plugin, /'show_in_rest' => true/);
  assert.match(plugin, /'maxItems' => 3/);
  assert.match(service, /getField\(post, "innotech_read_time"\)/);
  assert.match(service, /getField\(post, "innotech_related_posts"\)/);
  assert.doesNotMatch(service, /getManualRelated|getManualReadTime|fallbackRelated/);
  assert.doesNotMatch(service, /Related News\\s\*<\\\/h/);
  assert.match(service, /link\.setAttribute\("target", "_blank"\)/);
  assert.match(service, /rel\.add\("noopener"\)/);
  assert.match(service, /rel\.add\("noreferrer"\)/);
});

test("CMS Article cards do not hide missing WordPress values with local fallbacks", () => {
  const page = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "ArticlePage.jsx"),
    "utf8",
  );
  const related = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "components", "RelatedNews.jsx"),
    "utf8",
  );

  assert.match(page, /article\.isCmsArticle \? article\.image/);
  assert.doesNotMatch(related, /item\.image \|\||item\.date \|\||item\.readTime \|\|/);
});

test("Article body expands when a WordPress post has no table of contents", () => {
  const body = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "components", "ArticleBody.jsx"),
    "utf8",
  );
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");

  assert.match(body, /article-body-layout--without-toc/);
  assert.match(css, /\.article-body-layout--without-toc \.article-copy\s*\{\s*grid-column:\s*2/);
  assert.match(css, /\.article-copy\s*\{[^}]*max-width:\s*none/);
  assert.match(css, /\.article-wordpress-content\s*\{[^}]*overflow-wrap:\s*anywhere/);
});

test("What We Think waits for WordPress and never flashes local card content", () => {
  const page = fs.readFileSync(
    path.join(srcRoot, "pages", "what-we-think", "WhatWeThink.jsx"),
    "utf8",
  );

  assert.match(page, /posts\.length >= cardOrder\.length/);
  assert.match(page, /useBlogPosts\(\)/);
  assert.doesNotMatch(page, /getWhatWeThinkPosts/);
  assert.doesNotMatch(page, /post\.image \|\|/);
  assert.match(page, /displayCards \? <section/);
});

test("every article card section reads from the one shared WordPress feed", () => {
  const readers = [
    path.join(srcRoot, "context", "HomeContentProvider.jsx"),
    path.join(srcRoot, "pages", "what-we-think", "WhatWeThink.jsx"),
    path.join(srcRoot, "pages", "what-we-think", "archives", "Archives.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "industries", "shared", "components", "LiveInsightsSection.jsx"),
  ];

  for (const file of readers) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /useBlogPosts/, `${path.relative(root, file)} must use useBlogPosts`);
    assert.doesNotMatch(
      source,
      /fetchBlogPosts|fetchWordPressPosts/,
      `${path.relative(root, file)} must not fetch posts on its own`,
    );
  }
});

test("the archive card is one link with a category pill instead of Read More", () => {
  const page = fs.readFileSync(
    path.join(srcRoot, "pages", "what-we-think", "archives", "Archives.jsx"),
    "utf8",
  );
  const css = fs.readFileSync(path.join(srcRoot, "styles", "archive.css"), "utf8");

  assert.match(page, /<Link\s+className={`archive-card/);
  assert.match(page, /archive-card-category/);
  assert.doesNotMatch(page, /ReadMoreLink|archive-card-read-more/);
  assert.match(css, /\.archive-card-category \{[^}]*border-radius: 999px/s);
  assert.match(css, /\.archive-card-category \{[^}]*text-overflow: ellipsis/s);
});

test("the article table of contents lists H2 only and nests H3 under it", () => {
  const toc = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "components", "TableOfContents.jsx"),
    "utf8",
  );
  const blog = fs.readFileSync(
    path.join(srcRoot, "services", "cms", "wordpressBlog.js"),
    "utf8",
  );
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");

  // Headings carry their level so the H1 title can never become a TOC entry.
  assert.match(blog, /level,\s+html: renderHeading\(node, level\)/);
  assert.match(blog, /level: 1,\s+showInToc: false/);
  assert.match(toc, /\(section\.level \?\? 2\) >= 2/);
  assert.match(toc, /level >= 3 && parent/);
  assert.match(toc, /article-toc-subtree/);
  assert.match(css, /\.article-toc-subtree \{[^}]*transition: max-height/s);
});

test("the single-article hero box takes the uploaded image's own ratio", () => {
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");
  const hero = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "components", "ArticleHero.jsx"),
    "utf8",
  );

  // No ratio can crop the hero: the box matches the image and contain is the floor.
  assert.match(hero, /naturalWidth\} \/ \$\{naturalHeight\}/);
  assert.match(hero, /style=\{\{aspectRatio\}\}/);
  assert.match(css, /\.article-hero-media img \{[^}]*object-fit: contain/s);
  assert.doesNotMatch(css, /\.article-hero-media img \{[^}]*object-fit: cover/s);
  // Images inside the article body keep their own dimensions.
  assert.match(css, /\.article-wordpress-content img \{[^}]*object-fit: contain/s);
});

test("the home hero card is editable from a real WordPress screen", () => {
  const plugin = fs.readFileSync(
    path.join(root, "wordpress-plugin", "innotech-article-fields", "home-hero.php"),
    "utf8",
  );
  const entry = fs.readFileSync(
    path.join(root, "wordpress-plugin", "innotech-article-fields", "innotech-article-fields.php"),
    "utf8",
  );
  const provider = fs.readFileSync(
    path.join(srcRoot, "context", "HomeContentProvider.jsx"),
    "utf8",
  );

  // A visible admin menu, not a raw JSON blob buried in a page.
  assert.match(entry, /require_once plugin_dir_path\(__FILE__\) \. 'home-hero\.php'/);
  assert.match(plugin, /add_menu_page\(/);
  assert.match(plugin, /'INNOTECH Home'/);
  assert.match(plugin, /add_action\('admin_menu', 'innotech_register_home_hero_page'\)/);
  // Saved values are nonce-checked and capability-checked.
  assert.match(plugin, /wp_verify_nonce\(\$nonce, 'innotech_save_home_hero'\)/);
  assert.match(plugin, /current_user_can\('edit_pages'\)/);
  assert.match(plugin, /sanitize_text_field|sanitize_textarea_field/);
  // Published read-only over REST for the website.
  assert.match(plugin, /register_rest_route\('innotech\/v1', '\/home-hero'/);
  assert.match(plugin, /'methods' => 'GET'/);
  // Every locale the site supports.
  for (const locale of ["en", "ar", "tr"]) {
    assert.match(plugin, new RegExp(`'${locale}' =>`));
  }
  // The site merges the hero over its own text, so blank fields change nothing.
  assert.match(provider, /content\.hero = \{\.\.\.content\.hero, \.\.\.hero\}/);
});

test("images inside a WordPress article are never cropped or boxed in", () => {
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");

  // `.article-section figure img` caps local-article figures at 390px with
  // object-fit: cover. WordPress sections carry both classes, so a 1200x675
  // upload used to render 776x390 - sliced top and bottom.
  assert.match(css, /\.article-section figure img \{[^}]*max-height: 390px/s);
  const wordpressFigureImg = css.match(
    /\.article-wordpress-content figure img,[^{]*\{[^}]*\}/s,
  )?.[0];
  assert.ok(wordpressFigureImg, "WordPress figure images need their own rule");
  assert.match(wordpressFigureImg, /max-height: none/);
  assert.match(wordpressFigureImg, /height: auto/);
  assert.match(wordpressFigureImg, /object-fit: contain/);

  // Figures reclaim the empty space beside the shell, and a nested gallery
  // figure must not apply that bleed a second time.
  assert.match(css, /--article-bleed-end: max\(/);
  assert.match(
    css,
    /\.article-wordpress-content figure figure \{[^}]*--article-figure-bleed: 0px;[^}]*--article-bleed-end: 0px/s,
  );
});

test("home never shows the same post in latest news and live insights", () => {
  const provider = fs.readFileSync(
    path.join(srcRoot, "context", "HomeContentProvider.jsx"),
    "utf8",
  );

  assert.equal(HOME_LIVE_INSIGHTS_START_INDEX, 1);
  assert.match(provider, /buildLatestNewsFromPost\(content\.latestNews, posts\[0\]\)/);
  assert.match(provider, /posts\.slice\(HOME_LIVE_INSIGHTS_START_INDEX\)/);
});

test("card summaries are cut in JS and the card footer is pinned by flexbox", () => {
  const shared = fs.readFileSync(path.join(srcRoot, "styles", "article-cards.css"), "utf8");

  assert.match(shared, /\.article-card-summary \{[^}]*-webkit-line-clamp: var\(--article-card-summary-lines/s);
  assert.match(shared, /\.article-card-footer \{[^}]*margin-top: auto/s);

  // Every card section shares the one contract instead of clamping on its own.
  const cardSections = [
    path.join(srcRoot, "pages", "home", "sections", "live-insights", "LiveInsightsSection.jsx"),
    path.join(srcRoot, "pages", "home", "sections", "latest-news", "LatestNewsSection.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "industries", "shared", "components", "LiveInsightsSection.jsx"),
    path.join(srcRoot, "pages", "what-we-think", "WhatWeThink.jsx"),
    path.join(srcRoot, "pages", "what-we-think", "archives", "Archives.jsx"),
  ];

  for (const file of cardSections) {
    assert.match(
      fs.readFileSync(file, "utf8"),
      /article-card-summary/,
      `${path.relative(root, file)} must use the shared card summary`,
    );
  }

  // Summary clamping belongs to .article-card-summary; sections only set the
  // line count. The category pill has its own two-line clamp, which is a
  // separate rule and is excluded from this check.
  for (const file of ["archive.css", "what-we-think.css"]) {
    const css = fs.readFileSync(path.join(srcRoot, "styles", file), "utf8")
      .replace(/\.archive-card-category--multiline \{[^}]*\}/gs, "");

    assert.match(css, /--article-card-summary-lines/, `${file} must set the shared line count`);
    assert.doesNotMatch(
      css,
      /-webkit-line-clamp:\s*(?:\d|var\()/,
      `${file} must not clamp its summary on its own`,
    );
  }
});

test("the archive filter rail is driven by WordPress categories", () => {
  const local = [
    {id: "all", label: "Show all"},
    {id: "insight", label: "INSIGHT"},
    {id: "energy-materials", label: "Oil, Gas and Petrochemical"},
    {id: "retired", label: "Removed In WordPress"},
  ];
  const remote = [
    {slug: "energy-materials", label: "energy-materials", count: 3},
    {slug: "insight", label: "insight", count: 6},
    {slug: "patent-landscape-insight", label: "PATENT LANDSCAPE INSIGHT", count: 1},
  ];

  const merged = buildArchiveCategories(local, remote);

  // Curated order and curated labels win; a new WordPress category is appended.
  assert.deepEqual(merged.map(({id}) => id), [
    "all",
    "insight",
    "energy-materials",
    "patent-landscape-insight",
  ]);
  assert.equal(merged[2].label, "Oil, Gas and Petrochemical");
  assert.equal(merged[3].label, "PATENT LANDSCAPE INSIGHT");
  // A category deleted in WordPress stops being offered as a filter.
  assert.ok(!merged.some(({id}) => id === "retired"));
  // Without WordPress the local rail is used unchanged.
  assert.deepEqual(buildArchiveCategories(local, null), local);
  assert.deepEqual(buildArchiveCategories(local, []), local);

  assert.deepEqual(buildCategoryLabels(merged), {
    insight: "INSIGHT",
    "energy-materials": "Oil, Gas and Petrochemical",
    "patent-landscape-insight": "PATENT LANDSCAPE INSIGHT",
  });
});

test("a three word category label wraps onto two lines in the card pill", () => {
  assert.equal(isMultilineCategoryLabel("PATENT LANDSCAPE INSIGHT"), true);
  assert.equal(isMultilineCategoryLabel("Oil, Gas and Petrochemical"), true);
  assert.equal(isMultilineCategoryLabel("Steel and Mining"), true);
  // Two long words overflow just as badly as three short ones.
  assert.equal(isMultilineCategoryLabel("Digital Transformation"), true);
  assert.equal(isMultilineCategoryLabel("Product Development"), true);
  assert.equal(isMultilineCategoryLabel("Market Research"), false);
  assert.equal(isMultilineCategoryLabel("INSIGHT"), false);
  assert.equal(isMultilineCategoryLabel("Sustainability"), false);
  assert.equal(isMultilineCategoryLabel(""), false);

  const css = fs.readFileSync(path.join(srcRoot, "styles", "archive.css"), "utf8");
  assert.match(css, /\.archive-card-category--multiline \{[^}]*-webkit-line-clamp: 2/s);
  assert.match(css, /\.archive-card-category--multiline \{[^}]*white-space: normal/s);
  // Cards keep one height per row even when a pill takes two lines.
  assert.match(css, /\.archive-card \{[^}]*height: 100%/s);
});

test("a renamed WordPress category takes over its display label", () => {
  const blog = fs.readFileSync(
    path.join(srcRoot, "services", "cms", "wordpressBlog.js"),
    "utf8",
  );

  // Untouched categories are named after their slug; a real name wins.
  assert.match(blog, /function looksLikeRawSlug/);
  assert.match(blog, /function resolveCategoryLabel/);
  assert.match(blog, /label: resolveCategoryLabel\(category\)/);
  // Filtering keys off the slug, which survives a rename.
  assert.match(blog, /normalizeCategorySlug\(primaryCategory\?\.slug \|\| primaryCategory\?\.name\)/);
});

test("structural WordPress buckets are never offered as archive filters", () => {
  const blog = fs.readFileSync(
    path.join(srcRoot, "services", "cms", "wordpressBlog.js"),
    "utf8",
  );

  assert.match(blog, /EXCLUDED_CATEGORY_SLUGS = new Set\(\["uncategorized", "what-we-think"\]\)/);
  assert.match(blog, /export async function fetchWordPressCategories/);
  assert.match(blog, /wp\/v2\/categories/);
});

test("the archive card pill matches the category the reader filtered by", () => {
  const page = fs.readFileSync(
    path.join(srcRoot, "pages", "what-we-think", "archives", "Archives.jsx"),
    "utf8",
  );

  // Posts carry several categories, so the pill follows the active filter.
  assert.match(page, /slugs\.includes\(selectedCategory\)/);
  assert.match(page, /getCardCategory\(item, selectedCategory, categoryLabels\)/);
  assert.match(page, /categories\.includes\(selectedCategory\)/);
});

test("the table of contents scrolls instead of navigating and toggles in place", () => {
  const toc = fs.readFileSync(
    path.join(srcRoot, "pages", "articles", "components", "TableOfContents.jsx"),
    "utf8",
  );
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");

  // A hash navigation would remount the route and flash the loading overlay.
  assert.match(toc, /event\.preventDefault\(\)/);
  assert.match(toc, /scrollIntoView\(\{/);
  assert.match(toc, /behavior: prefersReducedMotion \? "auto" : "smooth"/);
  // Opening a dropdown is a button, separate from the scrolling link.
  assert.match(toc, /className="article-toc-toggle"/);
  assert.doesNotMatch(toc, /onClick=\{\(\) => hasChildren && onToggle/);
  // The dropdown must stay a plain block child, or its height collapses to zero.
  assert.match(toc, /article-toc-item-header/);
  assert.doesNotMatch(css, /\.article-toc-item \{[^}]*display: (flex|grid)/s);
});

test("WordPress body headings are shifted so the title stays the only H1", () => {
  const blog = fs.readFileSync(
    path.join(srcRoot, "services", "cms", "wordpressBlog.js"),
    "utf8",
  );

  assert.match(blog, /2 - Math\.min\(\.\.\.headingLevels\)/);
  assert.match(blog, /Math\.min\(6, Math\.max\(2, level \+ levelShift\)\)/);
  assert.match(blog, /doc\.createElement\(`h\$\{level\}`\)/);
  assert.match(blog, /\/\^H\[1-6\]\$\//);
});

test("WordPress tables render with the site theme and the store button opens a new tab", () => {
  const css = fs.readFileSync(path.join(srcRoot, "styles", "articles.css"), "utf8");
  const reportStoreCard = fs.readFileSync(
    path.join(srcRoot, "pages", "what-we-do", "services", "shared", "components", "ReportStoreCard.jsx"),
    "utf8",
  );

  assert.match(css, /\.article-wordpress-content table \{/);
  assert.match(css, /thead th, thead td/);
  assert.match(reportStoreCard, /const REPORT_STORE_URL = "https:\/\/www\.marketresearch\.com"/);
  assert.match(reportStoreCard, /target="_blank"/);
  assert.match(reportStoreCard, /rel="noopener noreferrer"/);
});

test("all route values are unique and grouped correctly", () => {
  const values = Object.values(routes);
  assert.equal(new Set(values).size, values.length);
  assert.equal(serviceRoutes.length, 3);
  assert.equal(industryRoutes.length, 5);
});

test("industry pages use shared components instead of copied section folders", () => {
  const industriesRoot = path.join(srcRoot, "pages", "what-we-do", "industries");
  const copiedSections = fs
    .readdirSync(industriesRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name !== "shared")
    .map((entry) => path.join(industriesRoot, entry.name, "sections"))
    .filter(fs.existsSync);

  assert.deepEqual(copiedSections, []);
});

test("each service owns its data and shared only contains components", () => {
  const servicesRoot = path.join(srcRoot, "pages", "what-we-do", "services");
  for (const service of ["inception", "infinity", "insight"]) {
    const data = fs.readFileSync(path.join(servicesRoot, service, "data.js"), "utf8");
    for (const name of ["road", "stats", "capabilities", "actions", "partners", "showcase"]) {
      assert.match(data, new RegExp(`export const ${name}\\b`));
    }
  }

  assert.equal(fs.existsSync(path.join(servicesRoot, "shared", "data.js")), false);
});

test("source has no known deployment-hostile paths or mojibake", () => {
  const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(source, /vector2\.svg/);
  assert.doesNotMatch(source, /\/assets\/shared\//);
  assert.doesNotMatch(source, /â€™|â€œ|â€/);
});

test("theme contract exposes light and dark mode", () => {
  const provider = fs.readFileSync(
    path.join(srcRoot, "context", "ThemeContext.jsx"),
    "utf8",
  );
  assert.match(provider, /isDarkMode/);
  assert.match(provider, /toggleTheme/);
  assert.match(provider, /setIsDarkMode/);
});

test("report store cards link to dedicated partner-style pages", () => {
  const reportStoreCard = fs.readFileSync(
    path.join(
      srcRoot,
      "pages",
      "what-we-do",
      "services",
      "shared",
      "components",
      "ReportStoreCard.jsx",
    ),
    "utf8",
  );

  assert.match(reportStoreCard, /market-research/);
  assert.match(reportStoreCard, /r-and-m/);
  assert.ok(
    fs.existsSync(
      path.join(
        srcRoot,
        "content",
        "en",
        "partners",
        "market-research",
        "market-research.json",
      ),
    ),
  );
  assert.ok(
    fs.existsSync(
      path.join(srcRoot, "content", "en", "partners", "r-and-m", "r-and-m.json"),
    ),
  );
});

test("card-style sections use the same responsive breakpoint as selected projects", () => {
  const cardSectionFiles = [
    path.join(srcRoot, "pages", "what-we-do", "industries", "shared", "components", "CapabilitiesSection.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "industries", "shared", "components", "LiveInsightsSection.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "services", "shared", "components", "ServiceActionSection.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "services", "shared", "components", "ServiceCapabilities.jsx"),
  ];

  const sources = cardSectionFiles.map((file) => fs.readFileSync(file, "utf8"));

  for (const source of sources) {
    assert.match(source, /lg:hidden/);
    assert.match(source, /lg:grid/);
    assert.doesNotMatch(source, /min-\[1400px\]:hidden/);
    assert.doesNotMatch(source, /min-\[1400px\]:grid/);
  }
});

test("card action controls stay anchored at the top-right with fixed decorative shapes", () => {
  const cardFiles = [
    path.join(srcRoot, "pages", "who-we-are", "components", "ExpertCard.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "services", "shared", "components", "ServiceShowcase.jsx"),
    path.join(srcRoot, "pages", "what-we-do", "industries", "shared", "components", "EcosystemCardsSection.jsx"),
  ];

  for (const file of cardFiles) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /absolute right-4 top-4/);
    assert.match(source, /absolute left-\[-34px\] top-\[-52px\]/);
  }
});

test("large interactive surfaces stay split into focused components", () => {
  const navbar = fs.readFileSync(
    path.join(srcRoot, "components", "layout", "Navbar.jsx"),
    "utf8",
  );
  const contactModal = fs.readFileSync(
    path.join(srcRoot, "components", "modals", "ContactModal.jsx"),
    "utf8",
  );

  assert.match(navbar, /NavbarMainBar/);
  assert.match(navbar, /NavbarPanels/);
  assert.match(contactModal, /ContactFormFields/);
  assert.ok(navbar.split("\n").length < 180);
  assert.ok(contactModal.split("\n").length < 260);
});

test("non-critical content images use native lazy loading", () => {
  const eagerImageFiles = new Set([
    path.join(srcRoot, "components", "layout", "Navbar.jsx"),
    path.join(srcRoot, "components", "layout", "navbar", "NavbarMainBar.jsx"),
    path.join(srcRoot, "pages", "home", "sections", "hero", "HeroSection.jsx"),
    path.join(srcRoot, "pages", "inlearn-academy", "InlearnAcademy.jsx"),
    path.join(
      srcRoot,
      "pages",
      "who-we-are",
      "components",
      "WhoWeAreBackground.jsx",
    ),
    path.join(
      srcRoot,
      "pages",
      "what-we-do",
      "industries",
      "shared",
      "components",
      "IndustryHero.jsx",
    ),
  ]);

  for (const file of sourceFiles.filter((file) => file.endsWith(".jsx"))) {
    if (eagerImageFiles.has(file)) continue;

    const source = fs.readFileSync(file, "utf8");
    for (const imageTag of source.matchAll(/<img\b[^>]*>/gs)) {
      assert.match(
        imageTag[0],
        /loading="lazy"/,
        `${path.relative(root, file)} has a non-lazy content image`,
      );
    }
  }
});

test("Gotham uses the original CDN stylesheet", () => {
  const css = fs.readFileSync(path.join(srcRoot, "index.css"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const localFont = path.join(root, "public", "fonts", "GothamRegular.woff");

  assert.equal(fs.existsSync(localFont), false);
  assert.match(css, /@import url\("https:\/\/fonts\.cdnfonts\.com\/css\/gotham"\)/);
  assert.doesNotMatch(css, /@font-face/);
  assert.doesNotMatch(html, /GothamRegular\.woff/);
});

test("GitHub Pages deployment supports organization and project site URLs", () => {
  const workflow = fs.readFileSync(
    path.join(root, ".github", "workflows", "deploy-pages.yml"),
    "utf8",
  );

  assert.match(workflow, /github\.event\.repository\.name\s*==\s*format\('\{0\}\.github\.io'/);
  assert.match(workflow, /format\('\/\{0\}\/',\s*github\.event\.repository\.name\)/);
  assert.match(workflow, /cp dist\/index\.html dist\/404\.html/);
  assert.match(workflow, /cancel-in-progress:\s*true/);
  assert.match(workflow, /enablement:\s*true/);
  assert.doesNotMatch(workflow, /gh api/);
});
