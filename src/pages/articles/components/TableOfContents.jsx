import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {t} from "../../../i18n/ui";

const relatedNewsGap = 32;

/**
 * The article H1 (the title above the hero image) is never a TOC entry:
 * only H2 headings become top-level items, and each H3 is nested under the
 * H2 it follows.
 */
function buildTocTree(sections = []) {
  const visible = sections.filter(
    (section) =>
      section.showInBody !== false &&
      section.showInToc !== false &&
      (section.level ?? 2) >= 2,
  );

  return visible.reduce((tree, section) => {
    const level = section.level ?? 2;
    const parent = tree[tree.length - 1];

    if (level >= 3 && parent) {
      parent.children.push(section);
      return tree;
    }

    tree.push({...section, children: []});
    return tree;
  }, []);
}

/* Anchor navigation would push a history entry, which remounts the route and
   flashes the loading overlay. The TOC scrolls the page itself instead. */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

function TocEntry({entry, isOpen, onToggle}) {
  const hasChildren = entry.children.length > 0;
  const subtreeRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  /* The dropdown animates between 0 and the measured height of its H3 list,
     so opening one H2 slides the rest of the list instead of jumping. */
  useLayoutEffect(() => {
    const subtree = subtreeRef.current;
    const list = subtree?.firstElementChild;
    if (!subtree || !list) return undefined;

    const measure = () => setContentHeight(list.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [entry.children.length]);

  return (
    <li className={`article-toc-item ${hasChildren ? "has-children" : ""} ${isOpen ? "is-open" : ""}`}>
      <div className="article-toc-item-header">
        <a
          href={`#${entry.id}`}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection(entry.id);
          }}
        >
          {entry.tocLabel ?? entry.heading}
        </a>
        {hasChildren ? (
          /* Toggling only changes this entry's own height - it never scrolls the page. */
          <button
            type="button"
            className="article-toc-toggle"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Hide" : "Show"} sections of ${entry.tocLabel ?? entry.heading}`}
            onClick={() => onToggle(entry.id)}
          >
            <span className="article-toc-chevron" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <div
          className="article-toc-subtree"
          ref={subtreeRef}
          style={{maxHeight: isOpen ? contentHeight : 0}}
        >
          <ol>
            {entry.children.map((child) => (
              <li key={child.id}>
                <a
                  href={`#${child.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(child.id);
                  }}
                >
                  {child.tocLabel ?? child.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </li>
  );
}

function TableOfContents({sections}) {
  const entries = useMemo(() => buildTocTree(sections), [sections]);
  const [openIds, setOpenIds] = useState([]);
  const tocRef = useRef(null);
  const shellRef = useRef(null);

  const toggleEntry = (id) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));

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

    /* Opening an H3 dropdown changes the TOC height, so the sticky maths reruns. */
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(toc);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [sections]);

  if (!entries.length) return null;

  return (
    <div className="article-toc-shell" ref={shellRef}>
      <nav ref={tocRef} className="article-toc" aria-label={t("tableOfContents")}>
        <h2>{t("tableOfContentsHeading")}</h2>
        <ol>
          {entries.map((entry) => (
            <TocEntry
              key={entry.id}
              entry={entry}
              isOpen={openIds.includes(entry.id)}
              onToggle={toggleEntry}
            />
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default TableOfContents;
