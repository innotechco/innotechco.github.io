function TableOfContents({sections}) {
  const visibleSections = sections.filter((section) => section.showInBody !== false);

  return (
    <nav className="article-toc" aria-label="Table of contents">
      <h2>Table of Contents</h2>
      <ol>
        {visibleSections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.tocLabel ?? section.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;