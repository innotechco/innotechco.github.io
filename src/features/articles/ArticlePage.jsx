import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";

import {articleAssets} from "./articles.config.js";
import {routes} from "../../app/routes.js";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import {fetchArticle} from "../../shared/content/articleContent.js";
import {redirectedArticleSlug} from "../../shared/content/articleRedirects.js";
import {t} from "../../shared/i18n/ui.js";
import ArticleBody from "./components/ArticleBody.jsx";
import ArticleHero from "./components/ArticleHero.jsx";
import RelatedNews from "./components/RelatedNews.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";

function ArticlePage() {
  const {slug} = useParams();
  /* An address that was shared before its slug was rewritten. Sending the
     reader on beats showing "not found" for an article that is still there,
     and replace: true keeps the dead address out of their back button. */
  const movedTo = redirectedArticleSlug(slug);
  const {isDarkMode} = useTheme();
  const [result, setResult] = useState({article: null, slug: null, status: "loading"});
  const article = result.slug === slug ? result.article : null;
  const status = result.slug === slug ? result.status : "loading";

  useEffect(() => {
    if (movedTo) return undefined;

    let isActive = true;

    fetchArticle(slug)
      .then((nextArticle) => {
        if (!isActive) return;
        setResult({
          article: nextArticle,
          slug,
          status: nextArticle ? "ready" : "not-found",
        });
      })
      .catch(() => {
        if (isActive) setResult({article: null, slug, status: "not-found"});
      });

    return () => {
      isActive = false;
    };
  }, [slug, movedTo]);

  if (movedTo) return <Navigate to={`${routes.articles}/${movedTo}`} replace />;

  return (
    <>
      <ScrollProgress />
      <main
        id="article-top"
        className={`article-page ${isDarkMode ? "is-dark" : "is-light"}`}
      >
        {status === "not-found" ? (
          <section className="article-status">
            <h1>{t("articleNotFound")}</h1>
            <p>{t("articleUnavailable")}</p>
          </section>
        ) : null}
        {article ? (
          <article>
            <ArticleHero
              article={article}
              image={article.isCmsArticle ? article.image : article.image || articleAssets[article.heroAssetKey]}
            />
            <ArticleBody article={article} assets={articleAssets} />
            {article.related?.length ? (
              <RelatedNews article={article} />
            ) : null}
          </article>
        ) : null}
      </main>
    </>
  );
}

export default ArticlePage;
