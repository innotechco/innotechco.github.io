import { useEffect, useRef, useState } from "react";

function TableOfContents({ sections }) {
  const visibleSections = sections.filter((section) => section.showInBody !== false);

  const [tocStyle, setTocStyle] = useState({});
  const tocRef = useRef(null);
  const placeholderRef = useRef(null);
  const shellRef = useRef(null);

  useEffect(() => {
    const toc = tocRef.current;
    const placeholder = placeholderRef.current;
    const shell = shellRef.current;
    if (!toc || !shell) return;

    const nav = document.querySelector("nav");
    const article = document.querySelector("article");

    let originalTop = null;

    const update = () => {
      if (!nav || !article) return;

      const navHeight = nav.getBoundingClientRect().height || 0;
      const scrollY = window.scrollY;
      const shellRect = shell.getBoundingClientRect();
      const articleRect = article.getBoundingClientRect();
      const tocHeight = toc.offsetHeight;

      // محاسبه موقعیت اولیه فقط یک بار
      if (originalTop === null) {
        originalTop = shell.getBoundingClientRect().top + scrollY;
      }

      const stickyStart = originalTop;
      const stickyTop = navHeight + 8;

      // هنوز به نقطه چسبیدن نرسیده
      if (scrollY < stickyStart - stickyTop) {
        setTocStyle({ position: "static" });
        placeholder.style.height = "0px";
        return;
      }

      // محاسبه فاصله تا انتها
      const bottomLimit = articleRect.bottom - scrollY - tocHeight - 50;

      if (bottomLimit <= stickyTop) {
        // چسبیده به پایین مقاله
        setTocStyle({
          position: "absolute",
          top: "auto",
          bottom: "40px",
          left: 0,
          width: "100%",
          zIndex: 150,
        });
      } else {
        // حالت ثابت زیر نوبار
        setTocStyle({
          position: "fixed",
          top: `${stickyTop}px`,
          left: `${shellRect.left}px`,
          width: `${shellRect.width}px`,
          zIndex: 150,
        });
      }

      // Placeholder همیشه فضا را نگه دارد
      placeholder.style.height = `${tocHeight}px`;
    };

    // اولین اجرا
    setTimeout(update, 120);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <div className="article-toc-shell" ref={shellRef}>
      <div ref={placeholderRef} aria-hidden="true" style={{ width: "100%", transition: "height 80ms linear" }} />

      <nav
        ref={tocRef}
        className="article-toc"
        aria-label="Table of contents"
        style={tocStyle}
      >
        <h2>Table of Contents</h2>
        <ol>
          {visibleSections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.tocLabel ?? section.heading}</a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default TableOfContents;