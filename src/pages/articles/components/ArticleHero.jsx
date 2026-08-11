function ArticleHero({article, image}) {
  return (
    <header className="article-hero" aria-labelledby="article-title">
      <div className="article-hero-copy">
        <p className="article-category">{article.category}</p>
        <h1 id="article-title">{article.title}</h1>
        <div className="article-meta">
          {article.date ? <time>{article.date}</time> : null}
          {article.readTime ? <span>{article.readTime}</span> : null}
        </div>
      </div>
      <div className="article-hero-media">
        {image ? <img loading="lazy" src={image} alt={article.title} /> : null}
      </div>
    </header>
  );
}

export default ArticleHero;
