const ALL_CATEGORY_ID = "all";

/**
 * A card pill wraps onto two lines once the label is long enough that a single
 * line would be squeezed and cut off in the meta row.
 *
 * Word count alone is not enough: two long words ("Digital Transformation")
 * overflow just as badly as three short ones, so length decides as well.
 */
export const CATEGORY_PILL_WRAP_WORDS = 3;
export const CATEGORY_PILL_WRAP_CHARS = 16;

export function isMultilineCategoryLabel(label) {
  const text = String(label ?? "").trim();
  if (!text) return false;

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;

  return words.length >= CATEGORY_PILL_WRAP_WORDS || text.length > CATEGORY_PILL_WRAP_CHARS;
}

/**
 * The archive filter rail, driven by WordPress.
 *
 * Curated categories keep their local order and their display label (WordPress
 * stores most of them under raw slugs like "energy-materials"). Any category
 * added in WordPress afterwards is appended to the end of the rail, in the
 * order WordPress returns it. A category deleted in WordPress disappears, so
 * the rail never offers a filter that cannot match anything.
 *
 * With no WordPress response the local list is used unchanged.
 */
export function buildArchiveCategories(localCategories = [], remoteCategories) {
  const allCategory = localCategories.find((category) => category.id === ALL_CATEGORY_ID);
  if (!remoteCategories?.length) return localCategories;

  const remoteBySlug = new Map(remoteCategories.map((category) => [category.slug, category]));
  const localIds = new Set(localCategories.map((category) => category.id));

  const curated = localCategories
    .filter((category) => category.id !== ALL_CATEGORY_ID && remoteBySlug.has(category.id))
    .map((category) => ({...category, count: remoteBySlug.get(category.id).count}));

  const added = remoteCategories
    .filter((category) => !localIds.has(category.slug))
    .map((category) => ({id: category.slug, label: category.label, count: category.count}));

  return [...(allCategory ? [allCategory] : []), ...curated, ...added];
}

/** Category id -> label, for the pills rendered on the cards. */
export function buildCategoryLabels(categories = []) {
  return Object.fromEntries(
    categories
      .filter((category) => category.id !== ALL_CATEGORY_ID)
      .map((category) => [category.id, category.label]),
  );
}
