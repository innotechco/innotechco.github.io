import {useEffect, useMemo, useState} from "react";

import {useLanguage} from "./useLanguage";
import {HomeContentContext} from "./home-content-context";
import {fetchHomePage} from "../services/content/homeContent";
import {getHomePage} from "../services/contentApi";

export function HomeContentProvider({children}) {
  const {locale} = useLanguage();
  const fallbackContent = useMemo(() => getHomePage(), []);
  const [state, setState] = useState({
    content: fallbackContent,
    source: "local",
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchHomePage(locale, {signal: controller.signal})
      .then((content) => {
        if (!content) return;
        setState({
          content,
          source: "wordpress",
          error: null,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({
          content: fallbackContent,
          source: "local",
          error,
        });
      });

    return () => controller.abort();
  }, [fallbackContent, locale]);

  const value = useMemo(() => state, [state]);

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
}
