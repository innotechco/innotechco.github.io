import { useEffect, useRef, useState } from "react";

function TableOfContents({ sections }) {
  const visibleSections = sections.filter((section) => section.showInBody !== false);

  const [tocStyle, setTocStyle] = useState({});
  const [isStuck, setIsStuck] = useState(false);
  const tocRef = useRef(null);
  const shellRef = useRef(null);

  useEffect(() => {
    const toc = tocRef.current;
    const shell = shellRef.current;
    if (!toc || !shell) return;

    const nav = document.querySelector("nav");
    const article = document.querySelector("article");
    const relatedNews = document.querySelector(".related-news");

    if (!nav || !article || !relatedNews) return;

    const update = () => {
      const navHeight = nav.getBoundingClientRect().height || 0;
      const scrollY = window.scrollY;
      
      const shellRect = shell.getBoundingClientRect();
      const articleRect = article.getBoundingClientRect();
      const relatedNewsRect = relatedNews.getBoundingClientRect();
      
      const tocHeight = toc.offsetHeight;
      const stickyTop = navHeight + 20;

      // موقعیت اولیه shell در scroll
      const shellAbsoluteTop = shellRect.top + scrollY;

      // چک کن آیا هنوز به نقطه چسبیدن رسیده
      if (scrollY < shellAbsoluteTop - stickyTop) {
        setTocStyle({ 
          position: "static",
          visibility: "visible",
          opacity: 1,
        });
        setIsStuck(false);
        return;
      }

      // فاصله شروع Related News تا viewport
      const relatedNewsTop = relatedNewsRect.top;
      
      // اگر Related News شروع شده - TOC را متوقف کن
      if (relatedNewsTop < tocHeight + stickyTop + 50) {
        // TOC ثابت می‌ماند
        setTocStyle({
          position: "absolute",
          top: `${stickyTop}px`,
          left: `${shellRect.left}px`,
          width: `${shellRect.width}px`,
          height: `${tocHeight}px`,
          visibility: "visible",
          opacity: 1,
          zIndex: 100,
          overflow: "hidden",
        });
        setIsStuck(true);
      } else {
        // TOC عادی fixed
        setTocStyle({
          position: "fixed",
          top: `${stickyTop}px`,
          left: `${shellRect.left}px`,
          width: `${shellRect.width}px`,
          height: `${tocHeight}px`,
          visibility: "visible",
          opacity: 1,
          zIndex: 100,
          overflow: "hidden",
        });
        setIsStuck(false);
      }
    };

    // اولین اجرا
    setTimeout(update, 100);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <div className="article-toc-shell" ref={shellRef}>
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