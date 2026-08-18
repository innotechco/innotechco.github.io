import {useEffect, useMemo, useState} from "react";

import {loadBlogPosts} from "../services/cms/blogPostsStore";
import {orderPosts} from "../services/cms/blogOrdering";
import {useLanguage} from "../context/useLanguage";

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
