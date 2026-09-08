import {useEffect, useMemo, useState} from "react";

import {useLanguage} from "../language/useLanguage.js";
import {HomeContentContext} from "./home-content-context.js";
import {fetchHomePage, getHomePage} from "../../../features/home/homeContent.js";
import {
  buildLatestNewsFromPost,
  buildLiveInsightCards,
} from "../../../shared/content/blogSections.js";
import {useBlogPosts} from "../../../shared/hooks/useBlogPosts.js";
import {HOME_LIVE_INSIGHTS_START_INDEX} from "../../../shared/config/articleCards.config.js";
import {
  fetchWordPressHomeHero,
  isHomeHeroEnabled,
} from "../../../integrations/wordpress/client/wordpressHomeHero.js";

export function HomeContentProvider({children}) {
  const {locale} = useLanguage();
  const fallbackContent = useMemo(() => getHomePage(), []);
  const {posts, status: postsStatus} = useBlogPosts();
  const [state, setState] = useState({
    content: fallbackContent,
    source: "local",
    error: null,
  });
  /* Edited by the CEO under WordPress > INNOTECH Home. */
  const [hero, setHero] = useState(null);
  /* The hero waits on this rather than painting the bundled copy and swapping
     it a moment later. Nothing to wait for when the CMS is off, so it starts
     "ready" and no skeleton flashes for a frame. */
  const [heroStatus, setHeroStatus] = useState(() =>
    isHomeHeroEnabled() ? "loading" : "ready",
  );

  useEffect(() => {
    if (!isHomeHeroEnabled()) return undefined;

    const controller = new AbortController();

    fetchWordPressHomeHero(locale, {signal: controller.signal})
      .then((remoteHero) => {
        if (remoteHero) setHero(remoteHero);
        setHeroStatus("ready");
      })
      .catch((error) => {
        /* An aborted request is a locale change or unmount, not a failure -
           the next effect run owns the status from here. */
        if (error?.name === "AbortError") return;
        setHeroStatus("error");
      });

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

    return {
      ...state,
      content,
      /* "loading" | "ready" | "error" - see useBlogPosts for what each means.
         Sections backed by WordPress render a skeleton while loading and only
         fall back to the bundled copy on "error". */
      postsStatus,
      heroStatus,
    };
  }, [hero, heroStatus, posts, postsStatus, state]);

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
}
