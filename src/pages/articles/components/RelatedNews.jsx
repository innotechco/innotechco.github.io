import {t} from "../../../i18n/ui";

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.6 19 12 5 20.4V3.6Z" fill="currentColor" /></svg>;
}

function RelatedNews({article, image}) {
  return (
    <section className="related-news" aria-labelledby="related-news-title">
      <h2 id="related-news-title">{t("relatedNews")}</h2>
      <div className="related-news-grid">
        {article.related.map((item, index) => (
          <a
            className="related-card"
            href={item.slug ? `/articles/${item.slug}` : "#article-top"}
            key={`${item.title}-${index}`}
          >
            <div className="related-card-image">
              <img loading="lazy" src={item.image || image} alt="" aria-hidden="true" /></div>
            <div className="related-card-copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="related-card-meta">
                <span>{item.date || article.date}</span><span>{item.readTime || article.readTime}</span><ArrowIcon />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default RelatedNews;
