import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {useLanguage} from "../../../app/providers/language/useLanguage.js";
import InlearnBrand from "./InlearnBrand.jsx";
import chevronDown from "../assets/chevron-down.svg";
import searchIcon from "../assets/search.svg";
import shoppingCart from "../assets/shopping-cart.svg";
import {inlearnLanguages} from "../data/inlearnContent.js";

function SearchIcon() {
  return <img className="inlearn-search-icon" src={searchIcon} alt="" aria-hidden="true" />;
}

function InlearnNavbar({onAuthOpen, session}) {
  const {locale, changeLanguage} = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
        setIsSearchOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const focusId = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusId);
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchValue("");
  };

  return (
    <div className="inlearn-topbar" dir="ltr">
      <InlearnBrand />

      <nav
        ref={navRef}
        className={`inlearn-nav ${isSearchOpen ? "is-searching" : ""} ${
          session ? "is-signed-in" : ""
        }`}
      >
        <div className="inlearn-nav-content">
        <div
          className={`inlearn-nav-links ${session ? "is-signed-in" : ""}`}
          aria-hidden={isSearchOpen}
        >
          {session ? (
            /* The two buttons collapse to one name once there is someone to
               name, which is also the only outward sign that the session
               survived - the token behind it is refreshed silently. */
            <span className="inlearn-nav-account" title={session.user?.email}>
              {session.displayName}
            </span>
          ) : (
            <>
              <button type="button" onClick={() => onAuthOpen("login")}>
                Login
              </button>
              <span className="inlearn-nav-separator" aria-hidden="true" />
              <button type="button" onClick={() => onAuthOpen("register")}>
                Register
              </button>
            </>
          )}
          <Link to="/inlearn/basket" className="inlearn-cart-link" aria-label="Shopping basket">
            <img src={shoppingCart} alt="" loading="lazy" />
          </Link>
          <div className="inlearn-language">
            <button
              type="button"
              aria-expanded={isLanguageOpen}
              onClick={() => setIsLanguageOpen((current) => !current)}
            >
              {locale.slice(0, 2).toUpperCase()}
              <img src={chevronDown} alt="" aria-hidden="true" loading="lazy" />
            </button>
            {isLanguageOpen ? (
              <div className="inlearn-language-menu">
                {inlearnLanguages.map((language) => (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() => {
                      changeLanguage(language.id);
                      setIsLanguageOpen(false);
                    }}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <span className="inlearn-nav-separator" aria-hidden="true" />
        </div>

        {/* Closed, this is a round button with a magnifier in it. Open, the same
            element is a field: the magnifier moves inside it as a label, the
            input fills what is left, and the button at the end becomes the way
            out. One element in two states rather than two that swap over, so
            nothing has to be positioned on top of anything else - which is what
            the old version did, with offsets measured against one pill size. */}
        <div className="inlearn-search-shell">
          <span className="inlearn-search-label" aria-hidden="true">
            <SearchIcon />
          </span>

          <input
            ref={searchInputRef}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeSearch();
            }}
            placeholder="Search"
            aria-label="Search"
            tabIndex={isSearchOpen ? 0 : -1}
          />

          <button
            type="button"
            className="inlearn-search-toggle"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            onClick={() => {
              if (isSearchOpen) {
                closeSearch();
              } else {
                setIsLanguageOpen(false);
                setIsSearchOpen(true);
              }
            }}
          >
            {isSearchOpen ? (
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <SearchIcon />
            )}
          </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default InlearnNavbar;
