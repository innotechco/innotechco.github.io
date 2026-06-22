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

function ArticleSection({section, assets}) {
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
