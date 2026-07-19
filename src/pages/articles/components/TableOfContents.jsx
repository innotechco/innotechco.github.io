import {useEffect, useRef} from "react";
import {t} from "../../../i18n/ui";

const relatedNewsGap = 32;

function TableOfContents({sections}) {
  const visibleSections = sections.filter(
    (section) => section.showInBody !== false,
  );
  const tocRef = useRef(null);
  const shellRef = useRef(null);

  useEffect(() => {
    const toc = tocRef.current;
    const shell = shellRef.current;
    const navbar = document.querySelector("nav.fixed");
    const relatedNews = document.querySelector(".related-news");

    if (!toc || !shell || !navbar || !relatedNews) return undefined;

    let frameId = 0;

    const applyStyle = (styles) => {
      Object.assign(toc.style, styles);
    };

    const update = () => {
      frameId = 0;

      if (window.matchMedia("(max-width: 700px)").matches) {
        toc.removeAttribute("style");
        return;
      }

      const scrollY = window.scrollY;
      const navbarHeight = navbar.getBoundingClientRect().height || 0;
      const stickyTop = navbarHeight + 20;
      const shellRect = shell.getBoundingClientRect();
      const shellTop = shellRect.top + scrollY;
      const relatedNewsTop = relatedNews.getBoundingClientRect().top + scrollY;
      const tocHeight = toc.offsetHeight;
      const stopTop = relatedNewsTop - tocHeight - relatedNewsGap;

      if (scrollY < shellTop - stickyTop) {
        applyStyle({
          position: "static",
          top: "auto",
          left: "auto",
          width: "auto",
          zIndex: "auto",
        });
        return;
      }

      if (scrollY + stickyTop >= stopTop) {
        applyStyle({
          position: "absolute",
          top: `${Math.max(0, stopTop - shellTop)}px`,
          left: "0px",
          width: `${shellRect.width}px`,
          zIndex: "20",
        });
        return;
      }

      applyStyle({
        position: "fixed",
        top: `${stickyTop}px`,
        left: `${shellRect.left}px`,
        width: `${shellRect.width}px`,
        zIndex: "20",
      });
    };

    const scheduleUpdate = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    window.addEventListener("resize", scheduleUpdate, {passive: true});

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frameId);
    };
  }, [sections]);

  return (
    <div className="article-toc-shell" ref={shellRef}>
      <nav ref={tocRef} className="article-toc" aria-label={t("tableOfContents")}>
        <h2>{t("tableOfContentsHeading")}</h2>
        <ol>
          {visibleSections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                {section.tocLabel ?? section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default TableOfContents;
