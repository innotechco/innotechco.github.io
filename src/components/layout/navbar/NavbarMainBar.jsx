import {Link} from "react-router-dom";

import Moon from "../../../assets/icons/Moon.svg";
import SearchIcon from "../../../assets/icons/Search.svg";
import SunMedium from "../../../assets/icons/SunMedium.svg";
import Vector from "../../../assets/icons/Vector.svg";
import Logo from "../../../assets/logos/NavbarInnoTech.svg";
import {routes} from "../../../routes";
import {languageOptions} from "../navData";

function Divider({isDarkMode}) {
  return (
    <div
      className={`h-[21px] w-[1.5px] ${
        isDarkMode ? "bg-white/40" : "bg-black/20"
      }`}
    />
  );
}

function NavbarMainBar({
  closePanels,
  handleDropdownToggle,
  handleLanguageSelect,
  handleLanguageToggle,
  handleMobileMenuToggle,
  handleSearchToggle,
  isDarkMode,
  isDropdownOpen,
  isLanguageOpen,
  isMobileMenuOpen,
  selectedLanguage,
  toggleTheme,
}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <div className="flex h-14 items-center px-4 min-[1400px]:h-[73px] min-[1400px]:px-8">
      <div className="flex shrink-0 items-center">
        <Link to={routes.home}>
          <img
            src={Logo}
            alt="INNOTECH Logo"
            className={`h-8 w-auto transition-transform duration-300 ease-out lg:hover:translate-x-2 min-[1400px]:h-9 ${isDarkMode ? "" : "brightness-0"}`}
          />
        </Link>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="hidden items-center gap-4 lg:flex xl:gap-8 min-[1500px]:gap-10">
          <Link
            to={routes.whoWeAre}
            onClick={closePanels}
            className={`whitespace-nowrap font-['Gotham'] text-sm transition-colors hover:text-emerald-400 min-[1500px]:text-base ${textColor}`}
          >
            Who we are
          </Link>

          <button
            type="button"
            onClick={handleDropdownToggle}
            className={`flex items-center gap-1 whitespace-nowrap font-['Gotham'] text-sm transition-colors hover:text-emerald-400 min-[1500px]:text-base ${textColor}`}
            aria-expanded={isDropdownOpen}
          >
            <span className="relative inline-flex pb-0">
              What we do
              <span
                className={`absolute bottom-0 left-0 h-px w-full rounded-full bg-[#37B478] transition-transform duration-300 ease-out ${
                  isDropdownOpen
                    ? "origin-left scale-x-100"
                    : "origin-right scale-x-0"
                }`}
              />
            </span>
            <img
              src={Vector}
              alt=""
              className={`h-[12px] w-[12px] translate-x-[5px] translate-y-[1px] object-contain transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              } ${isDarkMode ? "" : "brightness-0"}`}
            />
          </button>

          <Link
            to={routes.whatWeThink}
            onClick={closePanels}
            className={`whitespace-nowrap font-['Gotham'] text-sm transition-colors hover:text-emerald-400 min-[1500px]:text-base ${textColor}`}
          >
            What we think
          </Link>

          <Link
            to={routes.inlearnAcademy}
            onClick={closePanels}
            className={`whitespace-nowrap font-['Gotham'] text-sm transition-colors hover:text-emerald-400 min-[1500px]:text-base ${textColor}`}
          >
            INLEARN Academy
          </Link>

          <a
            href="https://stimanalytics.ai"
            target="_blank"
            rel="noreferrer"
            className={`whitespace-nowrap font-['Gotham'] text-sm opacity-70 transition-colors hover:text-emerald-400 min-[1500px]:text-base ${textColor}`}
          >
            INSIGHT Store
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
        <div className="relative block">
          <button
            type="button"
            onClick={handleLanguageToggle}
            aria-expanded={isLanguageOpen}
            className={`flex min-h-11 items-center gap-1 font-['Gotham'] text-sm leading-none transition-colors hover:text-emerald-400 sm:text-base ${textColor}`}
          >
            <span>{selectedLanguage}</span>
            <img
              src={Vector}
              alt=""
              className={`h-[9px] w-[9px] translate-y-[1px] object-contain transition-transform duration-300 ${
                isLanguageOpen ? "rotate-180" : "rotate-0"
              } ${isDarkMode ? "" : "brightness-0"}`}
            />
          </button>

          <div
            className={`absolute right-[-10px] top-10 w-32 overflow-hidden rounded-[18px] border shadow-xl transition-all duration-300 sm:right-0 sm:top-9 ${
              isLanguageOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            } ${
              isDarkMode
                ? "border-white/10 bg-zinc-950/90"
                : "border-black/10 bg-white/95"
            }`}
          >
            {languageOptions.map((language) => (
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
                <span className="text-xs text-[#37B478]">{language.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <Divider isDarkMode={isDarkMode} />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="group flex size-11 items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 min-[1400px]:size-[44px]"
        >
          <img
            src={isDarkMode ? SunMedium : Moon}
            alt=""
            className={`h-7 w-7 object-contain transition-all duration-500 ease-in-out hover:rotate-12 min-[1400px]:h-[30px] min-[1400px]:w-[30px] ${
              isDarkMode ? "" : "brightness-0"
            }`}
          />
        </button>

        <div className="hidden sm:block">
          <Divider isDarkMode={isDarkMode} />
        </div>

        <button
          type="button"
          onClick={handleSearchToggle}
          aria-label="Open search"
          className="flex size-11 items-center justify-center transition-all duration-200"
        >
          <img
            src={SearchIcon}
            alt=""
            className={`h-6 w-6 object-contain transition-transform duration-200 hover:scale-125 active:scale-90 ${
              isDarkMode ? "" : "brightness-0"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className={`flex min-h-11 items-center gap-2 rounded-full border px-3 font-['Gotham'] text-sm transition-colors lg:hidden ${
            isDarkMode
              ? "border-white/15 text-white hover:bg-white/10"
              : "border-black/15 text-black hover:bg-black/5"
          }`}
        >
          <span>Menu</span>
          <span className="relative h-4 w-4">
            <span
              className={`absolute left-0 top-[3px] h-0.5 w-4 rounded-full bg-current transition-transform ${
                isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[8px] h-0.5 w-4 rounded-full bg-current transition-opacity ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[13px] h-0.5 w-4 rounded-full bg-current transition-transform ${
                isMobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export default NavbarMainBar;
