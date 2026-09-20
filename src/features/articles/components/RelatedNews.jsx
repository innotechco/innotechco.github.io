import {t} from "../../../shared/i18n/ui.js";
import RemoteImage from "../../../shared/components/ui/RemoteImage.jsx";

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.6 19 12 5 20.4V3.6Z" fill="currentColor" /></svg>;
}

function RelatedNews({article}) {
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
              {item.image ? (
                <RemoteImage
                  className="article-card-image-crop"
                  src={item.image}
                  srcSet={item.imageSrcSet}
                  sizes="(max-width: 767px) 100vw, 33vw"
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="related-card-copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="related-card-meta">
                {item.date ? <span>{item.date}</span> : null}
                {item.readTime ? <span>{item.readTime}</span> : null}
                <ArrowIcon />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default RelatedNews;
