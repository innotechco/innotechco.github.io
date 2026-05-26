import {useEffect, useMemo, useRef, useState} from "react";
import { useTheme } from "../../context/useTheme";
import Logo from "../../assets/logos/NavbarInnoTech.svg";
import SunMedium from "../../assets/icons/SunMedium.svg";
import Moon from "../../assets/icons/Moon.svg";
import SearchIcon from "../../assets/icons/Search.svg";
import Vector from "../../assets/icons/Vector.svg";
import { Link } from "react-router-dom";

const searchItems = [
  {title: "What we do", type: "Page"},
  {title: "INSIGHT Store", type: "Page"},
  {title: "Innovation and Technology Management", type: "Article"},
  {title: "Digital Transformation Report", type: "Report"},
  {title: "Market Analytics Report", type: "Report"},
];

function Navbar() {
  const {isDarkMode, toggleTheme} = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navRef = useRef(null);
  const inputRef = useRef(null);

  const isAnyDropdownOpen = isDropdownOpen || isSearchOpen;

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
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="w-[1265px] mx-auto">
        <div
          className={`border shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${
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
                <Link to="/">
                      <img
                        src={Logo}
                        alt="InnoTech Logo"
                        className={`h-9 w-auto ${isDarkMode ? "" : "brightness-0"}`}
                      />
                  </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-10">
                <a
                  href="#"
                  className={`flex items-center gap-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  <span>Who we are</span>
                  <img
                    src={NaN}
                    alt=""
                    className="w-[9px] h-[9px] object-contain translate-y-[1px]"
                  />
                </a>

                <div
                  className="relative"
                  onMouseEnter={() => {
                    setIsDropdownOpen(true);
                    setIsSearchOpen(false);
                  }}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    type="button"
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

                <a
                  href="#"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  What we think
                </a>

                <a
                  href="#"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  INLEARN Academy
                </a>

                <a
                  href="#"
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } font-['Gotham'] text-base hover:text-emerald-400 transition-colors`}
                >
                  INSIGHT Store
                </a>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                className={`flex items-center gap-1 ${
                  isDarkMode ? "text-white" : "text-black"
                } font-['Gotham'] text-base leading-none hover:text-emerald-400 transition-colors`}
              >
                <span>En</span>
                <img
                  src={Vector}
                  alt=""
                  className="w-[9px] h-[9px] object-contain translate-y-[1px]"
                />
              </button>

              <div
                className={`w-[1.5px] h-[21px] ${
                  isDarkMode ? "bg-white/40" : "bg-black/20"
                }`}
              />

              <button
                type="button"
                onClick={toggleTheme} // 👈 استفاده از toggleTheme
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

          {/* Dropdown and Search sections - همین طور که هستن، بدون تغییر */}
          <div
            onMouseEnter={() => {
              setIsDropdownOpen(true);
              setIsSearchOpen(false);
            }}
            onMouseLeave={() => setIsDropdownOpen(false)}
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
              <div className="py-2 flex justify-center items-start gap-12 ">
                <div
                  className={`${
                    isDarkMode ? "text-white" : "text-black"
                  } text-base font-['Gotham']`}
                >
                  Industries:
                </div>
                <div className="w-52 inline-flex flex-col justify-start items-start gap-5">
  {[
    "Automotive",
    "Energy & Materials ",
    "Health",
    "High Tech",
    "Metals & Mining",
  ].map((item) =>
    item === "Automotive" ? (
      <Link
        key={item}
        to="/automotive"
        onClick={() => setIsDropdownOpen(false)}
        className={`${
          isDarkMode ? "text-white" : "text-black"
        } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
      >
        {item}
      </Link>
    ) : (
      <div
        key={item}
        className={`${
          isDarkMode ? "text-white" : "text-black"
        } text-base font-bold font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer`}
      >
        {item}
      </div>
    )
  )}
</div>
              </div>
            </div>
          </div>

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
