import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";

import {industryRoutes, routes, serviceRoutes} from "../src/routes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const sourceFiles = walk(srcRoot).filter((file) => /\.(js|jsx|css)$/.test(file));

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
