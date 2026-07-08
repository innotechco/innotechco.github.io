import {fetchJsonFromApi} from "./utils";

const articleModules = import.meta.glob("../../content/en/articles/*.json", {
  eager: true,
  import: "default",
});

const articlesBySlug = Object.values(articleModules).reduce((articles, article) => {
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
