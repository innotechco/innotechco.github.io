import {Link} from "react-router-dom";

import {t} from "../../../shared/i18n/ui.js";
import RemoteImage from "../../../shared/components/ui/RemoteImage.jsx";

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.6 19 12 5 20.4V3.6Z" fill="currentColor" /></svg>;
}

/* What a card shows, kept apart from what a card IS.
 *
 * The card is a Link when there is an article behind it and a plain anchor
 * when there is not, and the contents are the same either way - so they are
 * written once here rather than twice inside a conditional. */
function CardBody({item}) {
  return (
    <>
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
    </>
  );
}

function RelatedNews({article}) {
  return (
    <section className="related-news" aria-labelledby="related-news-title">
      <h2 id="related-news-title">{t("relatedNews")}</h2>
      <div className="related-news-grid">
        {article.related.map((item, index) => {
          const key = `${item.title}-${index}`;

          /* No slug, nowhere to go. It stays an anchor to the top of the
             article rather than becoming a link to nothing. */
          if (!item.slug) {
            return (
              <a className="related-card" href="#article-top" key={key}>
                <CardBody item={item} />
              </a>
            );
          }

          /* A Link rather than an anchor with an href.
           *
           * It was an anchor, and an anchor is a full page load: the whole
           * application booted again, every WordPress request was made from
           * scratch and the loading curtain came back over the top - for a
           * move between two articles that the router can do without ever
           * leaving the page. It read as a broken link because for several
           * seconds there was nothing on screen but the curtain.
           *
           * Every other link on the site is already a Link. This one was the
           * exception. */
          return (
            <Link className="related-card" to={`/articles/${item.slug}`} key={key}>
              <CardBody item={item} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedNews;
