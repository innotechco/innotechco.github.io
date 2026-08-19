import {useCallback} from "react";

function Paragraphs({items = []}) {
  return items.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

function Subsections({items = []}) {
  return items.map((item) => (
    <div className="article-subsection" key={item.heading}>
      <h3>{item.heading}</h3>
      <Paragraphs items={item.paragraphs} />
    </div>
  ));
}

/**
 * Body images are fitted into a fixed 16:9 block. A portrait upload would be
 * shrunk to a stamp inside that block, so it is marked and keeps its own shape
 * instead (see `img[data-orientation]` in articles.css).
 */
function tagImageOrientation(image) {
  const {naturalWidth, naturalHeight} = image;
  if (!naturalWidth || !naturalHeight) return;
  image.dataset.orientation = naturalHeight > naturalWidth ? "portrait" : "landscape";
}

function WordPressSection({section}) {
  const observeImages = useCallback((node) => {
    if (!node) return undefined;

    const images = Array.from(node.querySelectorAll("img"));
    images.forEach((image) => {
      if (image.complete) tagImageOrientation(image);
      else image.addEventListener("load", () => tagImageOrientation(image), {once: true});
    });
  }, []);

  return (
    <section id={section.id} className="article-section article-wordpress-content">
      {/* key: the ref callback has to run again when the article changes. */}
      <div key={section.id} ref={observeImages} dangerouslySetInnerHTML={{__html: section.html}} />
    </section>
  );
}

function ArticleSection({section, assets}) {
  if (section.type === "wordpress") return <WordPressSection section={section} />;

  return (
    <section id={section.id} className="article-section">
      <h2>{section.heading}</h2>
      {section.content ? <p>{section.content}</p> : null}
      <Paragraphs items={section.paragraphs} />
      {section.bullets?.length ? (
        <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
      ) : null}
      <Paragraphs items={section.afterBullets} />
      <Subsections items={section.subsections} />
      {section.type === "image" ? (
        <figure>
          <img loading="lazy" src={assets[section.assetKey]} alt="Product portfolio decision framework" />
          {section.caption ? <figcaption>{section.caption}</figcaption> : null}
        </figure>
      ) : null}
      {section.subheading ? <h3>{section.subheading}</h3> : null}
      <Paragraphs items={section.after} />
    </section>
  );
}

export default ArticleSection;
