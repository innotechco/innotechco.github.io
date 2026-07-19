import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {articleAssets} from "../../config/articles.config";
import {useTheme} from "../../context/useTheme";
import {fetchArticle} from "../../services/content/articleContent";
import {t} from "../../i18n/ui";
import ArticleBody from "./components/ArticleBody";
import ArticleHero from "./components/ArticleHero";
import RelatedNews from "./components/RelatedNews";
import ScrollProgress from "./components/ScrollProgress";

function ArticlePage() {
  const {slug} = useParams();
  const {isDarkMode} = useTheme();
  const [result, setResult] = useState({article: null, slug: null, status: "loading"});
  const article = result.slug === slug ? result.article : null;
  const status = result.slug === slug ? result.status : "loading";

  useEffect(() => {
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
  }, [slug]);

  return (
    <>
      <ScrollProgress />
      <main
        id="article-top"
        className={`article-page ${isDarkMode ? "is-dark" : "is-light"}`}
      >
        {status === "loading" ? <p className="article-status">{t("loadingArticle")}</p> : null}
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
              image={articleAssets[article.heroAssetKey]}
            />
            <ArticleBody article={article} assets={articleAssets} />
            <RelatedNews article={article} image={articleAssets[article.heroAssetKey]} />
          </article>
        ) : null}
      </main>
    </>
  );
}

export default ArticlePage;
