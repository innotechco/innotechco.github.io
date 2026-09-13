import {useEffect, useId, useMemo, useRef, useState} from "react";

/* A native <select> cannot be themed once it is open: the operating system
   draws that list, not the page, so it arrives in system type on a white box no
   matter what the CSS says. This is a button and a list instead - ordinary
   elements that take the site's styling - with the keyboard behaviour a select
   would have given us for free put back by hand.

   Past a couple of dozen options a plain list stops being usable, so anything
   longer gets a search box. */
const SEARCH_THRESHOLD = 12;

function InlearnSelect({value, options, placeholder, onChange, tabIndex = 0}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listId = useId();
  const hasSearch = options.length > SEARCH_THRESHOLD;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    /* Matches that start with what was typed come first: typing "ir" should
       reach Iran before Ireland rather than burying it mid-list. */
    const starts = [];
    const contains = [];
    for (const option of options) {
      const haystack = option.toLowerCase();
      if (haystack.startsWith(needle)) starts.push(option);
      else if (haystack.includes(needle)) contains.push(option);
    }
    return [...starts, ...contains];
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    const focusId = hasSearch
      ? window.setTimeout(() => searchRef.current?.focus(), 40)
      : undefined;
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.clearTimeout(focusId);
    };
  }, [isOpen, hasSearch]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const choose = (option) => {
    onChange(option);
    close();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (isOpen && activeIndex >= 0 && visible[activeIndex]) choose(visible[activeIndex]);
      else if (!isOpen) setIsOpen(true);
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    const step = event.key === "ArrowDown" ? 1 : -1;
    setActiveIndex((current) => {
      const next = current + step;
      if (next < 0) return visible.length - 1;
      if (next >= visible.length) return 0;
      return next;
    });
  };

  return (
    <div className={`inlearn-select ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className={`inlearn-select-trigger ${value ? "" : "is-placeholder"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        tabIndex={tabIndex}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        onKeyDown={handleKeyDown}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="inlearn-select-menu">
          {hasSearch ? (
            <input
              ref={searchRef}
              type="text"
              className="inlearn-select-search"
              placeholder={`Search ${placeholder.toLowerCase()}`}
              value={query}
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
          ) : null}

          <ul role="listbox" id={listId} aria-label={placeholder}>
            {visible.map((option, index) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  className={index === activeIndex ? "is-active" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                >
                  {option}
                </button>
              </li>
            ))}
            {visible.length === 0 ? <li className="inlearn-select-empty">No matches</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default InlearnSelect;
