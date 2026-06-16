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
  handleSearchToggle,
  isDarkMode,
  isDropdownOpen,
  isLanguageOpen,
  selectedLanguage,
  toggleTheme,
}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <div className="flex h-[73px] items-center px-8">
      <div className="flex shrink-0 items-center">
        <Link to={routes.home}>
          <img
            src={Logo}
            alt="InnoTech Logo"
            className={`h-9 w-auto ${isDarkMode ? "" : "brightness-0"}`}
          />
        </Link>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="hidden items-center gap-10 md:flex">
          <Link
            to={routes.whoWeAre}
            onClick={closePanels}
            className={`font-['Gotham'] text-base transition-colors hover:text-emerald-400 ${textColor}`}
          >
            Who we are
          </Link>

          <button
            type="button"
            onClick={handleDropdownToggle}
            className={`flex items-center gap-1 font-['Gotham'] text-base transition-colors hover:text-emerald-400 ${textColor}`}
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
            className={`font-['Gotham'] text-base transition-colors hover:text-emerald-400 ${textColor}`}
          >
            What we think
          </Link>

          <Link
            to={routes.inlearnAcademy}
            onClick={closePanels}
            className={`font-['Gotham'] text-base transition-colors hover:text-emerald-400 ${textColor}`}
          >
            INLEARN Academy
          </Link>

          <span className={`font-['Gotham'] text-base opacity-70 ${textColor}`}>
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
            className={`flex items-center gap-1 font-['Gotham'] text-base leading-none transition-colors hover:text-emerald-400 ${textColor}`}
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

        <Divider isDarkMode={isDarkMode} />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="group flex h-[30px] w-[30px] items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <img
            src={isDarkMode ? SunMedium : Moon}
            alt=""
            className={`h-[30px] w-[30px] object-contain transition-all duration-500 ease-in-out hover:rotate-12 ${
              isDarkMode ? "" : "brightness-0"
            }`}
          />
        </button>

        <Divider isDarkMode={isDarkMode} />

        <button
          type="button"
          onClick={handleSearchToggle}
          aria-label="Open search"
          className="flex h-6 w-6 items-center justify-center transition-all duration-200"
        >
          <img
            src={SearchIcon}
            alt=""
            className={`h-6 w-6 object-contain transition-transform duration-200 hover:scale-125 active:scale-90 ${
              isDarkMode ? "" : "brightness-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default NavbarMainBar;
