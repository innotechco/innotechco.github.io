import {useMemo, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {useTheme} from "../../../context/useTheme";
import SearchIcon from "../../../assets/icons/Search.svg";
import ArchiveLightDecoration from "../../../assets/images/excludes/archives/WhoWeAreExcludeTopMiddle.webp";
import ArchiveDarkDecoration from "../../../assets/images/excludes/archives/WhoWeAreExcludeMiddle.webp";
import {archiveItems, archivePage} from "./data";
import {useBlogPosts} from "../../../hooks/useBlogPosts";
import {useBlogCategories} from "../../../hooks/useBlogCategories";
import {
  buildArchiveCategories,
  buildCategoryLabels,
  isMultilineCategoryLabel,
} from "../../../services/cms/archiveCategories";
import {getCategoryPillColor} from "../../../config/articleCards.config";
import {truncateWords} from "../../../services/content/cardSummary";
import {getArticlePath} from "../../../services/content/blogSections";
import {usePointerGlow} from "../../../hooks/usePointerGlow";
import {t} from "../../../i18n/ui";

/* A post usually sits in several categories. With a filter active the pill shows
   the filtered one, so the card never contradicts the selected pill above the grid.
   Without a filter it falls back to the article topic, skipping the generic
   "what we think" bucket. */
function getCardCategory(item, selectedCategory, categoryLabels) {
  const slugs = item.categories ?? [];
  const slug = slugs.includes(selectedCategory)
    ? selectedCategory
    : slugs.find((value) => value !== "what-we-think") ?? slugs[0];
  if (!slug) return null;
  return {slug, label: categoryLabels[slug] ?? item.category ?? slug};
}

const INITIAL_CARD_COUNT = 9;
const LOAD_MORE_DELAY = 700;

function mergeArchiveItems(wordpressPosts = [], localItems = []) {
  const seen = new Set();

  return [...wordpressPosts, ...localItems]
    .map((item) => ({
      ...item,
      image: item.image || archiveItems[0]?.image,
    }))
    .filter((item) => {
      const key = item.slug || item.id || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function ArchiveCard({item, isDarkMode, selectedCategory, categoryLabels}) {
  const {position, handlers} = usePointerGlow();
  const category = getCardCategory(item, selectedCategory, categoryLabels);
  const readTime = item.readTime ||
    (item.readMinutes ? `${item.readMinutes} minutes read` : "");

  return (
    <div className="archive-card-shell" {...handlers}>
      <div
        className="archive-card-glow"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(340px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.46), transparent 72%)`,
        }}
      />
      <Link
        className={`archive-card ${isDarkMode ? "is-dark" : "is-light"}`}
        to={getArticlePath(item.slug || item.id) ?? "#"}
      >
        <div className="archive-card-image">
          <img src={item.image} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="archive-card-copy">
          <h2>{item.title}</h2>
          <p className="article-card-summary">{truncateWords(item.description)}</p>
          <div className="archive-card-meta article-card-footer">
            <span className="archive-read-time" dir="ltr">
              {readTime}
            </span>
            <span>{item.date}</span>
            {category ? (
              <span
                className={`archive-card-category ${
                  isMultilineCategoryLabel(category.label)
                    ? "archive-card-category--multiline"
                    : ""
                }`}
                style={getCategoryPillColor(category.slug, isDarkMode)}
              >
                {category.label}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}

function Archives() {
  const {isDarkMode} = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const {posts} = useBlogPosts();
  const {categories: remoteCategories} = useBlogCategories();
  const tagsRailRef = useRef(null);
  /* The rail is whatever WordPress defines; new categories land at the end. */
  const categories = useMemo(
    () => buildArchiveCategories(archivePage.categories, remoteCategories),
    [remoteCategories],
  );
  const categoryLabels = useMemo(() => buildCategoryLabels(categories), [categories]);
  const items = useMemo(
    () => mergeArchiveItems(posts, archiveItems),
    [posts],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter(({title, description, categories}) => {
      const matchesQuery = !normalizedQuery ||
        `${title} ${description}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);

      return matchesQuery && matchesCategory;
    });
  }, [items, query, selectedCategory]);

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

    /* Position by index, not by name: the rail now ends wherever WordPress
       says it ends, so the last pill is not a fixed category any more. */
    const index = categories.findIndex((category) => category.id === categoryId);

    if (index <= 1) {
      rail.scrollTo({left: 0, behavior: "smooth"});
      return;
    }

    if (index >= categories.length - 2) {
      rail.scrollTo({left: rail.scrollWidth - rail.clientWidth, behavior: "smooth"});
      return;
    }

    event.currentTarget.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
  }

  const pageClass = isDarkMode ? "archive-page is-dark" : "archive-page is-light";
  const decoration = isDarkMode ? ArchiveDarkDecoration : ArchiveLightDecoration;

  return (
    <main className={pageClass}>
      <img loading="lazy" className="archive-decoration" src={decoration} alt="" aria-hidden="true" />
      <div className="archive-content">
        <header className="archive-heading">
          <span>{archivePage.eyebrow}</span>
          <h1 className="whitespace-nowrap">{archivePage.title}</h1>
          <p>{archivePage.description}</p>
          <label className="archive-search" aria-label="Search archive cards">
            <img loading="lazy" src={SearchIcon} alt="" aria-hidden="true" />
            <input type="search" value={query} onChange={handleSearch} placeholder={archivePage.searchPlaceholder} />
            <span>{t("searchLabel")}</span>
          </label>
        </header>

        <div className="archive-tags" aria-label="Archive categories">
          <div className="archive-tags-rail" ref={tagsRailRef}>
            <div className="archive-tags-track">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`archive-tag ${selectedCategory === category.id ? "is-active" : ""}`}
                  onClick={(event) => handleCategorySelect(category.id, event)}
                  title={category.label}
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
            {visibleItems.map((item) => (
              <ArchiveCard
                key={item.id}
                item={item}
                isDarkMode={isDarkMode}
                selectedCategory={selectedCategory}
                categoryLabels={categoryLabels}
              />
            ))}
          </section>
        ) : (
          <p className="archive-empty">{t("noInsights")}</p>
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
