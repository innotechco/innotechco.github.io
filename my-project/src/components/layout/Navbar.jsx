import {useEffect, useMemo, useRef, useState} from "react";
import {useTheme} from "../../context/useTheme";
import Logo from "../../assets/logos/NavbarInnoTech.svg";
import SunMedium from "../../assets/icons/SunMedium.svg";
import Moon from "../../assets/icons/Moon.svg";
import SearchIcon from "../../assets/icons/Search.svg";
import Vector from "../../assets/icons/Vector.svg";
import {Link} from "react-router-dom";
import {routes} from "../../routes";

const searchItems = [
  {title: "Who we are", type: "Page"},
  {title: "What we do", type: "Page"},
  {title: "What we think", type: "Page"},
  {title: "INSIGHT Store", type: "Page"},
  {title: "Innovation and Technology Management", type: "Article"},
  {title: "Digital Transformation Report", type: "Report"},
  {title: "Market Analytics Report", type: "Report"},
];

function Navbar() {
  const {isDarkMode, toggleTheme} = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("En");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navRef = useRef(null);
  const inputRef = useRef(null);

  const isAnyDropdownOpen = isDropdownOpen || isLanguageOpen || isSearchOpen;

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchItems.filter((item) =>
      item.title.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsLanguageOpen(false);
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
    setIsDropdownOpen(false);
    setIsLanguageOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
  };

  const handleLanguageToggle = () => {
    setIsLanguageOpen((prev) => !prev);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="mx-auto w-[min(1265px,calc(100%-32px))]">
        <div
          className={`border shadow-2xl ${
            isLanguageOpen ? "overflow-visible" : "overflow-hidden"
          } transition-all duration-500 ease-in-out ${
            isDarkMode
              ? "bg-black/20 border-white/10 backdrop-blur-[3px]"
              : "bg-white/20 border-black/10 backdrop-blur-[2px]"
          } ${
            isAnyDropdownOpen
              ? isDarkMode
                ? "rounded-[34px] bg-zinc-950/80"
                : "rounded-[34px] bg-white/85"
              : "rounded-[50px]"
          }`}
        >
          <div className="h-[73px] flex items-center px-8">
            <div className="flex items-center shrink-0">
              <Link to={routes.home}>
                <img
                  src={Logo}
                  alt="InnoTech Logo"
                  className={`h-9 w-auto ${isDarkMode ? "" : "brightness-0"}`}
                />
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-10">
                <Link
                  to={routes.whoWeAre}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLanguageOpen(false);
                    setIsSearchOpen(false);
                  }}
                  className={`flex items-center gap-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  <span>Who we are</span>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className={`flex items-center gap-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                  >
                    <span>What we do</span>

                    <img
                      src={Vector}
                      alt=""
                      className={`w-[12px] h-[12px] object-contain translate-y-[1px] translate-x-[5px] transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      } ${isDarkMode ? "" : "brightness-0"}`}
                    />
                  </button>
                </div>

                <Link
                  to={routes.whatWeThink}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLanguageOpen(false);
                    setIsSearchOpen(false);
                  }}
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  What we think
                </Link>

                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base opacity-70`}
                >
                  INLEARN Academy
                </span>

                <span
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base opacity-70`}
                >
                  INSIGHT Store
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleLanguageToggle}
                  aria-expanded={isLanguageOpen}
                  className={`flex items-center gap-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base leading-none hover:text-emerald-400 transition-colors`}
                >
                  <span>{selectedLanguage}</span>

                  <img
                    src={Vector}
                    alt=""
                    className={`w-[9px] h-[9px] object-contain translate-y-[1px] transition-transform duration-300 ${
                      isLanguageOpen ? "rotate-180" : "rotate-0"
                    } ${isDarkMode ? "" : "brightness-0"}`}
                  />
                </button>

                <div
                  className={`absolute right-0 top-9 w-32 overflow-hidden rounded-[18px] border shadow-xl transition-all duration-300 ${
                    isLanguageOpen
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  } ${
                    isDarkMode
                      ? "border-white/10 bg-zinc-950/90"
                      : "border-black/10 bg-white/95"
                  }`}
                >
                  {[
                    {label: "En", name: "English"},
                    {label: "Tr", name: "Türkçe"},
                    {label: "Ar", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629"},
                  ].map((language) => (
                    <button
                      key={language.label}
                      type="button"
                      onClick={() => handleLanguageSelect(language.label)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left font-['Gotham'] text-sm transition-colors ${
                        isDarkMode
                          ? "text-white hover:bg-white/10"
                          : "text-black hover:bg-black/5"
                      }`}
                    >
                      <span>{language.name}</span>
                      <span className="text-xs text-[#37B478]">
                        {language.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`w-[1.5px] h-[21px] ${
                  isDarkMode ? "bg-white/40" : "bg-black/20"
                }`}
              />

              <button
                type="button"
                onClick={toggleTheme}
                className="group flex items-center justify-center w-[30px] h-[30px] transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <img
                  src={isDarkMode ? SunMedium : Moon}
                  alt={isDarkMode ? "Sun" : "Moon"}
                  className={`w-[30px] h-[30px] object-contain transition-all duration-500 ease-in-out transform hover:rotate-12 ${
                    isDarkMode ? "" : "brightness-0"
                  }`}
                />
              </button>

              <div
                className={`w-[1.5px] h-[21px] ${
                  isDarkMode ? "bg-white/40" : "bg-black/20"
                }`}
              />

              <button
                type="button"
                onClick={handleSearchToggle}
                className="flex items-center justify-center w-6 h-6 transition-all duration-200"
              >
                <img
                  src={SearchIcon}
                  alt="Search"
                  className={`w-6 h-6 object-contain transition-transform duration-200 hover:scale-125 active:scale-90 ${
                    isDarkMode ? "" : "brightness-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen
                ? "max-h-[400px] opacity-100 translate-y-0 pb-10 pt-2"
                : "max-h-0 opacity-0 -translate-y-2 pb-0 pt-0"
            }`}
          >
            <div className="px-10 flex justify-center items-start gap-28">
              <div className="py-2 flex justify-center items-start gap-12">
                <div
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-base font-['Gotham']`}
                >
                  Services:
                </div>

                <div className="w-52 inline-flex flex-col justify-start items-start gap-5">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
                    >
                      INCEPTION
                    </div>

                    <div
                      className={`${
                        isDarkMode ? "text-white/70" : "text-black/60"
                      } self-stretch text-xs font-['Gotham'] leading-5`}
                    >
                      Innovation and Technology Management
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
                    >
                      INSIGHT
                    </div>

                    <div
                      className={`${
                        isDarkMode ? "text-white/70" : "text-black/60"
                      } self-stretch text-xs font-['Gotham'] leading-5`}
                    >
                      Science, Technology, Innovation and Market Analytics &
                      Reports
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
                    >
                      INFINITY
                    </div>

                    <div
                      className={`${
                        isDarkMode ? "text-white/70" : "text-black/60"
                      } self-stretch text-xs font-['Gotham'] leading-5`}
                    >
                      Digital Transformation and Industry 4.0
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2 flex justify-center items-start gap-12">
                <div
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-base font-['Gotham']`}
                >
                  Industries:
                </div>

                <div className="w-52 inline-flex flex-col justify-start items-start gap-5">
                  {[
                    {label: "Automotive", to: routes.automotive},
                    {
                      label: "Energy & Materials",
                      to: routes.energyAndMaterials,
                    },
                    {label: "Health", to: routes.health},
                    {label: "High Tech", to: routes.highTech},
                    {
                      label: "Metals & Mining",
                      to: routes.metalsAndMining,
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLanguageOpen(false);
                      }}
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isSearchOpen
                ? "max-h-[350px] opacity-100 translate-y-0 pb-5 pt-5"
                : "max-h-0 opacity-0 -translate-y-2 pb-0 pt-0"
            }`}
          >
            <div className="w-full px-8">
              <form
                onSubmit={handleSubmit}
                className="w-full p-2 flex items-center gap-2.5"
              >
                <div
                  className={`flex-1 px-4 py-3 rounded-[40px] outline outline-1 outline-offset-[-1px] flex items-center gap-2.5 overflow-hidden ${
                    isDarkMode
                      ? "bg-white/10 outline-white/20"
                      : "bg-black/5 outline-black/10"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="search pages, articles, and report"
                    className={`w-full bg-transparent border-none outline-none ${
                      isDarkMode
                        ? "text-white placeholder:text-white/50"
                        : "text-black placeholder:text-black/40"
                    } text-base font-light font-['Gotham']`}
                  />

                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className={`${
                        isDarkMode
                          ? "text-white/70 hover:text-white"
                          : "text-black/50 hover:text-black"
                      } transition-colors`}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#37B478] hover:bg-[#22C55E] active:bg-[#16A34A]
                             text-white text-lg font-['Gotham']
                             rounded-[50px] inline-flex justify-center items-center gap-2.5
                             transition-all duration-200 active:scale-95 hover:scale-[1.03]"
                >
                  Search
                </button>
              </form>

              <div
                className={`mt-4 text-sm ${
                  isDarkMode ? "text-white/80" : "text-black/80"
                } font-['Gotham']`}
              >
                {searchQuery && searchResults.length === 0 ? (
                  <div
                    className={`rounded-[32px] border px-5 py-4 break-words ${
                      isDarkMode
                        ? "border-white/10 bg-white/5"
                        : "border-black/10 bg-black/5"
                    }`}
                  >
                    <div>No results found for:</div>

                    <div
                      className={`${
                        isDarkMode ? "text-white" : "text-black"
                      } break-words`}
                    >
                      "{searchQuery}"
                    </div>
                  </div>
                ) : null}

                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={`${result.title}-${result.type}`}
                        className={`rounded-[32px] border px-5 py-4 transition-colors duration-300 cursor-pointer break-words ${
                          isDarkMode
                            ? "border-white/10 bg-white/5 hover:bg-white/10"
                            : "border-black/10 bg-black/5 hover:bg-black/10"
                        }`}
                      >
                        <div
                          className={`${
                            isDarkMode ? "text-white" : "text-black"
                          } text-sm font-semibold font-['Gotham'] break-words whitespace-normal`}
                        >
                          {result.title}
                        </div>

                        <div
                          className={`${
                            isDarkMode ? "text-white/70" : "text-black/60"
                          } text-xs font-light font-['Gotham']`}
                        >
                          {result.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
