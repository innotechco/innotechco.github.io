/* Articles whose WordPress slug was rewritten after the old address had already
   been shared or indexed.
 *
 * The Redirection plugin covers blog.innotech.global, but the reader's link is
 * to innotech.global/articles/<slug>, which this site serves and WordPress
 * never sees. Without an entry here that address is a dead end: the post is not
 * found under its old slug and the page says so.
 *
 * Old address on the left, current slug on the right. Entries stay: the whole
 * point is that a link shared two years ago still lands somewhere sensible.
 */
export const articleRedirects = {
  "product-portfolio-management": "technology-innovation-business-transformation",
};

export function redirectedArticleSlug(slug) {
  return articleRedirects[slug] ?? null;
}
