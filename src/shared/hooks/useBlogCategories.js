import {useEffect, useMemo, useState} from "react";

import {loadBlogCategories} from "../../integrations/wordpress/client/blogPostsStore.js";
import {useLanguage} from "../../app/providers/language/useLanguage.js";

/**
 * Categories as defined in WordPress. Returns null until they arrive (and on
 * failure), so callers keep their local list instead of rendering an empty rail.
 */
export function useBlogCategories() {
  const {locale} = useLanguage();
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    let isActive = true;

    loadBlogCategories(locale)
      .then((remote) => {
        if (isActive) setCategories(remote ?? null);
      })
      .catch(() => {
        if (isActive) setCategories(null);
      });

    return () => {
      isActive = false;
    };
  }, [locale]);

  return useMemo(() => ({categories}), [categories]);
}
