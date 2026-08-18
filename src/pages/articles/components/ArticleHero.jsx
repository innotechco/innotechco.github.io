import {useState} from "react";

import {ARTICLE_HERO_ASPECT_RATIO} from "../../../config/articleCards.config";

function ArticleHero({article, image}) {
  /* The hero box takes the ratio of the image that was actually uploaded, so no
     upload is ever cropped from the top or bottom. 16:9 (min 1920x1080) stays the
     recommended upload ratio because it matches the layout best. */
  const [aspectRatio, setAspectRatio] = useState(ARTICLE_HERO_ASPECT_RATIO);

  const handleLoad = (event) => {
    const {naturalWidth, naturalHeight} = event.currentTarget;
    if (naturalWidth && naturalHeight) setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
  };

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
      <div className="article-hero-media" style={{aspectRatio}}>
        {image ? (
          <img loading="lazy" src={image} alt={article.title} onLoad={handleLoad} />
        ) : null}
      </div>
    </header>
  );
}

export default ArticleHero;
