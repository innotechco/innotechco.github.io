import {useEffect, useMemo, useState} from "react";

import {useLanguage} from "../language/useLanguage.js";
import {HomeContentContext} from "./home-content-context.js";
import {fetchHomePage} from "../../../features/home/homeContent.js";
import {getHomePage} from "../../../features/home/homeContent.js";
import {
  buildLatestNewsFromPost,
  buildLiveInsightCards,
} from "../../../shared/content/blogSections.js";
import {useBlogPosts} from "../../../shared/hooks/useBlogPosts.js";
import {HOME_LIVE_INSIGHTS_START_INDEX} from "../../../shared/config/articleCards.config.js";
import {fetchWordPressHomeHero} from "../../../integrations/wordpress/client/wordpressHomeHero.js";

export function HomeContentProvider({children}) {
  const {locale} = useLanguage();
  const fallbackContent = useMemo(() => getHomePage(), []);
  const {posts} = useBlogPosts();
  const [state, setState] = useState({
    content: fallbackContent,
    source: "local",
    error: null,
  });
  /* Edited by the CEO under WordPress > INNOTECH Home. */
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchWordPressHomeHero(locale, {signal: controller.signal})
      .then((remoteHero) => {
        if (remoteHero) setHero(remoteHero);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [locale]);

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
    if (!posts.length && !hero) return state;

    const content = {...state.content};

    /* Only filled-in fields are returned, so a blank field keeps the current text. */
    if (hero) content.hero = {...content.hero, ...hero};

    if (posts.length) {
      content.latestNews = buildLatestNewsFromPost(content.latestNews, posts[0]);
      content.liveInsights = {
        ...content.liveInsights,
        cards: buildLiveInsightCards(
          content.liveInsights?.cards,
          posts.slice(HOME_LIVE_INSIGHTS_START_INDEX),
        ),
      };
    }

    return {...state, content};
  }, [hero, posts, state]);

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
}
