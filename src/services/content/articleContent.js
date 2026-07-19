import {fetchJsonFromApi} from "./utils";
import {getActiveLocale} from "../../i18n/locale";

const articleModules = import.meta.glob("../../content/{en,ar,tr}/articles/*.json", {
  eager: true,
  import: "default",
});

const articlesBySlug = Object.entries(articleModules).reduce((articles, [path, article]) => {
  if (!path.includes(`/content/${getActiveLocale()}/`)) return articles;
  articles[article.slug] = article;
  return articles;
}, {});

export function getArticle(slug) {
  return articlesBySlug[slug] ?? null;
}

export function getArticleSlugs() {
  return Object.keys(articlesBySlug);
}

export async function fetchArticle(slug) {
  return (await fetchJsonFromApi(`/articles/${slug}`)) ?? getArticle(slug);
}
