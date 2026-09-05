import {useEffect, useMemo, useState} from "react";

import {loadBlogPosts} from "../../integrations/wordpress/client/blogPostsStore.js";
import {orderPosts} from "../../integrations/wordpress/adapters/blogOrdering.js";
import {useLanguage} from "../../app/providers/language/useLanguage.js";

/**
 * Shared WordPress post feed for every section that renders article cards.
 * Always returns the same list in the same order (newest first).
 */
export function useBlogPosts() {
  const {locale} = useLanguage();
  const [state, setState] = useState({posts: [], status: "loading"});

  useEffect(() => {
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
