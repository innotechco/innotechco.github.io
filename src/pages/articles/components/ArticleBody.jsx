import ArticleSection from "./ArticleSection";
import TableOfContents from "./TableOfContents";

function ArticleBody({article, assets}) {
  const hasTableOfContents = article.sections.some(
    (section) => section.showInBody !== false && section.showInToc !== false,
  );

  return (
    <div className={`article-body-layout ${hasTableOfContents ? "" : "article-body-layout--without-toc"}`}>
      <TableOfContents sections={article.sections} />
      <div className="article-copy">
        <p className="article-lede">{article.description}</p>
        {(article.introduction ?? []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {article.sections
          .filter((section) => section.showInBody !== false)
          .map((section) => <ArticleSection key={section.id} section={section} assets={assets} />)}
      </div>
    </div>
  );
}

export default ArticleBody;
