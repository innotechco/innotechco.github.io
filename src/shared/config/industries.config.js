/**
 * The five industry pages, described once.
 *
 * An industry is spelled three different ways across the site and there is no
 * way to make that go away: the route is "/metals-and-mining", the navigation
 * item is "metalsAndMining", and the WordPress category the CEO actually
 * created is "metals-mining". Each spelling belongs to a system that owns its
 * own naming, so the fix is not one spelling but one place that holds all of
 * them together.
 *
 * Everything else derives from this list: the accepted WordPress categories per
 * page, the display label on an article card, and the id -> route map the Pages
 * fallback script needs. A test asserts that routes.js, navigation.json and the
 * category pill colours line up with it, so adding a sixth industry and missing
 * a step fails `npm test` instead of shipping an empty section.
 *
 * Adding an industry:
 *   1. add an entry here
 *   2. add the route to routes.js and a <Route> in App.jsx
 *   3. add the id and label to navigation.json in all three locales
 *   4. add the route to staticRoutes in the Pages fallback script
 *   5. add a pill colour under the canonical slug in articleCards.config.js
 *   6. write content/{en,ar,tr}/industries/<route>.json
 * Miss 1, 3 or 5 and the test says so by name.
 */

/**
 * `categorySlugs[0]` is the canonical one: it is the slug the category really
 * has in WordPress, and the key under which the label and the pill colour are
 * looked up. The rest are aliases, accepted so that a category created under
 * the industry's real name does not leave the page silently empty.
 */
export const INDUSTRIES = [
  {
    id: "automotive",
    route: "automotive",
    label: "Automotive",
    categorySlugs: ["automotive"],
  },
  {
    id: "energyAndMaterials",
    route: "energy-and-materials",
    label: "Oil, Gas and Petrochemical",
    categorySlugs: [
      "energy-materials",
      "energy-and-materials",
      "oil-gas-and-petrochemical",
    ],
  },
  {
    id: "health",
    route: "health",
    label: "Healthcare and Life Sciences",
    categorySlugs: ["health", "healthcare-and-life-sciences"],
  },
  {
    id: "highTech",
    route: "high-tech",
    label: "High Tech and AI",
    categorySlugs: ["high-tech", "high-tech-and-ai"],
  },
  {
    id: "metalsAndMining",
    route: "metals-and-mining",
    label: "Steel and Mining",
    categorySlugs: ["metals-mining", "metals-and-mining", "steel-and-mining"],
  },
];

/** The slug the category actually carries in WordPress. */
export function canonicalCategorySlug(industry) {
  return industry.categorySlugs[0];
}

/** Navigation item id -> route slug. Used by the Pages fallback script. */
export const INDUSTRY_ROUTE_BY_ID = Object.fromEntries(
  INDUSTRIES.map((industry) => [industry.id, industry.route]),
);

/** Route slug -> every WordPress category slug that feeds that page. */
export const INDUSTRY_CATEGORY_SLUGS_BY_ROUTE = Object.fromEntries(
  INDUSTRIES.map((industry) => [industry.route, industry.categorySlugs]),
);

/** Canonical WordPress slug -> display label, merged into CATEGORY_LABELS. */
export const INDUSTRY_CATEGORY_LABELS = Object.fromEntries(
  INDUSTRIES.map((industry) => [canonicalCategorySlug(industry), industry.label]),
);
