import {useMemo, useRef, useState} from "react";

import ReadMoreLink from "../../../components/ui/ReadMoreLink";
import {useTheme} from "../../../context/useTheme";
import SearchIcon from "../../../assets/icons/Search.svg";
import ArchiveLightDecoration from "../../../assets/images/archives/WhoWeAreExcludeTopMiddle.webp";
import ArchiveDarkDecoration from "../../../assets/images/archives/WhoWeAreExcludeMiddle.webp";
import {archiveItems, archivePage} from "./data";
import {usePointerGlow} from "../../../hooks/usePointerGlow";

const INITIAL_CARD_COUNT = 9;
const LOAD_MORE_DELAY = 700;

function ArchiveCard({item, isDarkMode}) {
  const {position, handlers} = usePointerGlow();

  return (
    <div className="archive-card-shell" {...handlers}>
      <div
        className="archive-card-glow"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(340px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.46), transparent 72%)`,
        }}
      />
      <article className={`archive-card ${isDarkMode ? "is-dark" : "is-light"}`}>
        <div className="archive-card-image">
          <img src={item.image} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="archive-card-copy">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className="archive-card-meta">
            <span className="archive-read-time" dir="ltr">
              {item.readMinutes} minutes read
            </span>
            <span>{item.date}</span>
            <ReadMoreLink isDarkMode={isDarkMode} className="archive-card-read-more" />
          </div>
        </div>
      </article>
    </div>
  );
}

function Archives() {
  const {isDarkMode} = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const tagsRailRef = useRef(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return archiveItems.filter(({title, description, categories}) => {
      const matchesQuery = !normalizedQuery ||
        `${title} ${description}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredItems.length;

  function handleSearch(event) {
    setQuery(event.target.value);
    setVisibleCount(INITIAL_CARD_COUNT);
  }

  function handleShowMore() {
    setIsLoading(true);
    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 6, filteredItems.length));
      setIsLoading(false);
    }, LOAD_MORE_DELAY);
  }

  function handleCategorySelect(categoryId, event) {
    setSelectedCategory(categoryId);
    setVisibleCount(INITIAL_CARD_COUNT);

    const rail = tagsRailRef.current;
    if (!rail) return;

    if (categoryId === "all" || categoryId === "insight") {
      rail.scrollTo({left: 0, behavior: "smooth"});
      return;
    }

    if (categoryId === "foresight") {
      rail.scrollTo({left: rail.scrollWidth - rail.clientWidth, behavior: "smooth"});
      return;
    }

    event.currentTarget.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
  }

  const pageClass = isDarkMode ? "archive-page is-dark" : "archive-page is-light";
  const decoration = isDarkMode ? ArchiveDarkDecoration : ArchiveLightDecoration;

  return (
    <main className={pageClass}>
      <img className="archive-decoration" src={decoration} alt="" aria-hidden="true" />
      <div className="archive-content">
        <header className="archive-heading">
          <span>{archivePage.eyebrow}</span>
          <h1 className="whitespace-nowrap">{archivePage.title}</h1>
          <p>{archivePage.description}</p>
          <label className="archive-search" aria-label="Search archive cards">
            <img src={SearchIcon} alt="" aria-hidden="true" />
            <input type="search" value={query} onChange={handleSearch} placeholder={archivePage.searchPlaceholder} />
            <span>Search</span>
          </label>
        </header>

        <div className="archive-tags" aria-label="Archive categories">
          <div className="archive-tags-rail" ref={tagsRailRef}>
            <div className="archive-tags-track">
              {archivePage.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`archive-tag ${selectedCategory === category.id ? "is-active" : ""}`}
                  onClick={(event) => handleCategorySelect(category.id, event)}
                  aria-pressed={selectedCategory === category.id}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleItems.length ? (
          <section className="archive-grid" aria-label="Archive articles">
            {visibleItems.map((item) => <ArchiveCard key={item.id} item={item} isDarkMode={isDarkMode} />)}
          </section>
        ) : (
          <p className="archive-empty">No insights match your search.</p>
        )}

        {canShowMore && (
          <div className="archive-load-more">
            <button type="button" onClick={handleShowMore} disabled={isLoading} aria-busy={isLoading}>
              {isLoading && <span className="archive-spinner" aria-hidden="true" />}
              <span>{isLoading ? archivePage.loadingLabel : archivePage.showMoreLabel}</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Archives;
