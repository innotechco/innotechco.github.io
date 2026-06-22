function TableOfContents({sections}) {
  return (
    <nav className="article-toc" aria-label="Table of contents">
      <h2>Table of Contents</h2>
      <ol>
        {sections.map((section) => (
          <li key={section.id}><a href={`#${section.id}`}>{section.tocLabel ?? section.heading}</a></li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;
