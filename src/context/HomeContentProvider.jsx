import {useEffect, useMemo, useState} from "react";

import {useLanguage} from "./useLanguage";
import {HomeContentContext} from "./home-content-context";
import {fetchHomePage} from "../services/content/homeContent";
import {getHomePage} from "../services/contentApi";
import {
  buildLatestNewsFromPost,
  buildLiveInsightCards,
} from "../services/content/blogSections";
import {useBlogPosts} from "../hooks/useBlogPosts";
import {HOME_LIVE_INSIGHTS_START_INDEX} from "../config/articleCards.config";

export function HomeContentProvider({children}) {
  const {locale} = useLanguage();
  const fallbackContent = useMemo(() => getHomePage(), []);
  const {posts} = useBlogPosts();
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

  const value = useMemo(() => {
    if (!posts.length) return state;

    return {
      ...state,
      content: {
        ...state.content,
        latestNews: buildLatestNewsFromPost(state.content.latestNews, posts[0]),
        liveInsights: {
          ...state.content.liveInsights,
          cards: buildLiveInsightCards(
            state.content.liveInsights?.cards,
            posts.slice(HOME_LIVE_INSIGHTS_START_INDEX),
          ),
        },
      },
    };
  }, [posts, state]);

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
}
