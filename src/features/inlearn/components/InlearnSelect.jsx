import {useEffect, useId, useRef, useState} from "react";

/* A native <select> cannot be themed once it is open: the operating system
   draws that list, not the page, so it arrives in system type on a white box no
   matter what the CSS says. This is a button and a list instead - ordinary
   elements that take the site's styling - with the keyboard behaviour a select
   would have given us for free put back by hand. */
function InlearnSelect({value, options, placeholder, onChange, tabIndex = 0}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const choose = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen && activeIndex >= 0) choose(options[activeIndex]);
      else setIsOpen(true);
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
      if (next < 0) return options.length - 1;
      if (next >= options.length) return 0;
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
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span>{value || placeholder}</span>
        <svg viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <ul className="inlearn-select-menu" role="listbox" id={listId} aria-label={placeholder}>
          {options.map((option, index) => (
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
        </ul>
      ) : null}
    </div>
  );
}

export default InlearnSelect;
