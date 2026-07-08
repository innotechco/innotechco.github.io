function ArticleHero({article, image}) {
  return (
    <header className="article-hero" aria-labelledby="article-title">
      <div className="article-hero-copy">
        <p className="article-category">{article.category}</p>
        <h1 id="article-title">{article.title}</h1>
        <div className="article-meta"><time>{article.date}</time><span>{article.readTime}</span></div>
      </div>
      <div className="article-hero-media">
        <img loading="lazy" src={image} alt="Strategic product portfolio planning" />
      </div>
    </header>
  );
}

export default ArticleHero;
