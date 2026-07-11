import {useEffect, useMemo, useRef, useState} from "react";

import {useTheme} from "../../context/useTheme";
import {searchItems} from "./navData";
import NavbarMainBar from "./navbar/NavbarMainBar";
import {
  MobileMenuPanel,
  SearchPanel,
  WhatWeDoPanel,
} from "./navbar/NavbarPanels";

function Navbar() {
  const {isDarkMode, toggleTheme} = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("En");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);
  const inputRef = useRef(null);

  const searchResults = useMemo(() => {
    const normalizeSearchValue = (value) =>
      String(value)
        .trim()
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const normalizedQuery = searchQuery
      ? normalizeSearchValue(searchQuery)
      : "";
    const queryTokens = normalizedQuery
      .split(" ")
      .filter((token) => token && token !== "and");
    const typePriority = {
      Industry: 0,
      Service: 1,
      Partner: 2,
      Article: 3,
      Page: 4,
    };

    if (queryTokens.length === 0) return [];

    return searchItems
      .map((item) => {
        const matchedPart = item.searchParts?.find((part) => {
          const normalizedPart = normalizeSearchValue(part);

          return queryTokens.every((token) => normalizedPart.includes(token));
        });

        if (!matchedPart) return null;

        const normalizedTitle = normalizeSearchValue(item.title);
        const titleTokensMatch = queryTokens.every((token) =>
          normalizedTitle.includes(token),
        );

        return {
          ...item,
          matchText: matchedPart,
          rank:
            normalizedTitle === normalizedQuery
              ? 0
              : normalizedTitle.includes(normalizedQuery) || titleTokensMatch
                ? 1
                : 2,
          typeRank: typePriority[item.type] ?? 9,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          a.rank - b.rank ||
          a.typeRank - b.typeRank ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 10);
  }, [searchQuery]);

  const closePanels = () => {
    setIsDropdownOpen(false);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closePanels();
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const togglePanel = (panel) => {
    setIsDropdownOpen((current) => panel === "dropdown" && !current);
    setIsLanguageOpen((current) => panel === "language" && !current);
    setIsSearchOpen((current) => panel === "search" && !current);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsDropdownOpen(false);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen((current) => !current);
  };

  const isAnyPanelOpen =
    isDropdownOpen || isLanguageOpen || isSearchOpen || isMobileMenuOpen;

  return (
    <nav ref={navRef} className="fixed inset-x-0 top-0 z-50 pt-3 min-[1400px]:pt-6">
      <div className="mx-auto w-[min(1265px,calc(100%-24px))] min-[1400px]:w-[min(1265px,calc(100%-32px))]">
        <div
          className={`border shadow-2xl transition-all duration-500 ease-in-out ${
            isLanguageOpen ? "overflow-visible" : "overflow-hidden"
          } ${
            isDarkMode
              ? "border-white/10 bg-black/20 backdrop-blur-[3px]"
              : "border-black/10 bg-white/20 backdrop-blur-[2px]"
          } ${
            isAnyPanelOpen
              ? isDarkMode
                ? "rounded-[24px] bg-zinc-950/80 min-[1400px]:rounded-[34px]"
                : "rounded-[24px] bg-white/85 min-[1400px]:rounded-[34px]"
              : "rounded-[28px] min-[1400px]:rounded-[50px]"
          }`}
        >
          <NavbarMainBar
            closePanels={closePanels}
            handleDropdownToggle={() => togglePanel("dropdown")}
            handleLanguageSelect={(language) => {
              setSelectedLanguage(language);
              setIsLanguageOpen(false);
            }}
            handleLanguageToggle={() => togglePanel("language")}
            handleMobileMenuToggle={toggleMobileMenu}
            handleSearchToggle={() => togglePanel("search")}
            isDarkMode={isDarkMode}
            isDropdownOpen={isDropdownOpen}
            isLanguageOpen={isLanguageOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            selectedLanguage={selectedLanguage}
            toggleTheme={toggleTheme}
          />
          <WhatWeDoPanel
            closePanels={closePanels}
            isDarkMode={isDarkMode}
            isOpen={isDropdownOpen}
          />
          <SearchPanel
            closePanels={closePanels}
            inputRef={inputRef}
            isDarkMode={isDarkMode}
            isOpen={isSearchOpen}
            searchQuery={searchQuery}
            searchResults={searchResults}
            setSearchQuery={setSearchQuery}
          />
          <MobileMenuPanel
            closePanels={closePanels}
            isDarkMode={isDarkMode}
            isOpen={isMobileMenuOpen}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
