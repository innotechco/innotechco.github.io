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
/*
 * `limit` is how many posts the caller will actually draw. A section showing
 * three cards asks for three: the request is an order of magnitude smaller and
 * arrives in a third of the time. Leave it out to get every post, which is what
 * the archive, What We Think and the industry pages need in order to filter.
 */
export function useBlogPosts({limit} = {}) {
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

    loadBlogPosts(locale, limit)
      .then((posts) => {
        if (isActive) setState({posts: orderPosts(posts ?? []), status: "ready"});
      })
      .catch(() => {
        if (isActive) setState({posts: [], status: "error"});
      });

    return () => {
      isActive = false;
    };
  }, [locale, limit]);

  return useMemo(() => state, [state]);
}
