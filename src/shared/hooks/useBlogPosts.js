import {useEffect, useMemo, useState} from "react";

import {loadBlogPosts} from "../../integrations/wordpress/client/blogPostsStore.js";
import {isBlogEnabled} from "../../integrations/wordpress/client/wordpressBlog.js";
import {orderPosts} from "../../integrations/wordpress/adapters/blogOrdering.js";
import {useLanguage} from "../../app/providers/language/useLanguage.js";

/**
 * Shared WordPress post feed for every section that renders article cards.
 * Always returns the same list in the same order (newest first).
 *
 * `status` is what callers should render from:
 *   "loading" - WordPress has not answered yet. Show a skeleton, never the
 *               bundled placeholder copy, or the page visibly swaps content a
 *               moment after it paints.
 *   "ready"   - use `posts`. An empty list means WordPress genuinely has none.
 *   "error"   - WordPress could not be reached; fall back to bundled content.
 *
 * With the blog disabled there is nothing to wait for, so the hook starts out
 * "ready" rather than flashing a skeleton for one frame.
 */
export function useBlogPosts() {
  const {locale} = useLanguage();
  const [state, setState] = useState(() => ({
    posts: [],
    status: isBlogEnabled() ? "loading" : "ready",
  }));

  useEffect(() => {
    /* Nothing to fetch with the blog off, and the initial state is already
       "ready", so there is no state to correct here. */
    if (!isBlogEnabled()) return undefined;

    let isActive = true;

    loadBlogPosts(locale)
      .then((posts) => {
        if (isActive) setState({posts: orderPosts(posts ?? []), status: "ready"});
      })
      .catch(() => {
        if (isActive) setState({posts: [], status: "error"});
      });

    return () => {
      isActive = false;
    };
  }, [locale]);

  return useMemo(() => state, [state]);
}
