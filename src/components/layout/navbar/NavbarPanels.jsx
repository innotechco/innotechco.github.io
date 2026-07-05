import {useState} from "react";
import {Link} from "react-router-dom";

import {industryMenuItems, serviceMenuItems} from "../navData";
import Vector from "../../../assets/icons/Vector.svg";
import {routes} from "../../../routes";

function PanelArrow({isDarkMode, isOpen}) {
  return (
    <img
      src={Vector}
      alt=""
      className={`h-3 w-3 object-contain transition-transform duration-300 ${
        isOpen ? "rotate-180" : "rotate-0"
      } ${isDarkMode ? "" : "brightness-0"}`}
    />
  );
}

function MobileAccordionGroup({children, isDarkMode, isOpen, onToggle, title}) {
  return (
    <div
      className={`rounded-[18px] border ${
        isDarkMode
          ? "border-white/10 bg-white/[0.03]"
          : "border-black/10 bg-black/[0.03]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between px-4 py-3 font-['Gotham'] text-sm font-bold ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <span>{title}</span>
        <PanelArrow isDarkMode={isDarkMode} isOpen={isOpen} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function WhatWeDoPanel({closePanels, isDarkMode, isOpen}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <div
      className={`hidden overflow-hidden transition-all duration-500 ease-in-out min-[1400px]:block ${
        isOpen
          ? "max-h-[400px] translate-y-0 pb-10 pt-2 opacity-100"
          : "max-h-0 -translate-y-2 pb-0 pt-0 opacity-0"
      }`}
    >
      <div className="flex items-start justify-center gap-28 px-10">
        <div className="flex items-start justify-center gap-12 py-2">
          <div className={`font-['Gotham'] text-base ${textColor}`}>
            Services:
          </div>
          <div className="inline-flex w-52 flex-col items-start gap-5">
            {serviceMenuItems.map((service) => (
              <Link
                key={service.label}
                to={service.to}
                onClick={closePanels}
                className="flex flex-col items-start self-stretch"
              >
                <div
                  className={`cursor-pointer font-['Gotham'] text-base font-bold transition-colors hover:text-emerald-400 ${textColor}`}
                >
                  {service.label}
                </div>
                <div
                  className={`self-stretch font-['Gotham'] text-xs leading-5 ${
                    isDarkMode ? "text-white/70" : "text-black/60"
                  }`}
                >
                  {service.description}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-start justify-center gap-12 py-2">
          <div className={`font-['Gotham'] text-base ${textColor}`}>
            Industries:
          </div>
          <div className="inline-flex w-52 flex-col items-start gap-5">
            {industryMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closePanels}
                className={`cursor-pointer font-['Gotham'] text-base font-bold transition-colors hover:text-emerald-400 ${textColor}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenuPanel({closePanels, isDarkMode, isOpen}) {
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-white/70" : "text-black/60";

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out min-[1400px]:hidden ${
        isOpen
          ? "max-h-[calc(100vh-96px)] translate-y-0 pb-4 opacity-100"
          : "max-h-0 -translate-y-2 pb-0 opacity-0"
      }`}
    >
      <div className="flex max-h-[calc(100vh-120px)] flex-col gap-2 overflow-y-auto px-3 pt-2">
        <Link
          to={routes.whoWeAre}
          onClick={closePanels}
          className={`rounded-[18px] px-4 py-3 font-['Gotham'] text-sm font-bold ${textColor}`}
        >
          Who we are
        </Link>

        <MobileAccordionGroup
          isDarkMode={isDarkMode}
          isOpen={isWhatWeDoOpen}
          onToggle={() => setIsWhatWeDoOpen((current) => !current)}
          title="What we do"
        >
          <MobileAccordionGroup
            isDarkMode={isDarkMode}
            isOpen={isServicesOpen}
            onToggle={() => setIsServicesOpen((current) => !current)}
            title="Services"
          >
            {serviceMenuItems.map((service) => (
              <Link
                key={service.label}
                to={service.to}
                onClick={closePanels}
                className="flex flex-col gap-1"
              >
                <span
                  className={`font-['Gotham'] text-sm font-bold ${textColor}`}
                >
                  {service.label}
                </span>
                <span className={`font-['Gotham'] text-xs ${mutedTextColor}`}>
                  {service.description}
                </span>
              </Link>
            ))}
          </MobileAccordionGroup>

          <MobileAccordionGroup
            isDarkMode={isDarkMode}
            isOpen={isIndustriesOpen}
            onToggle={() => setIsIndustriesOpen((current) => !current)}
            title="Industries"
          >
            {industryMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closePanels}
                className={`font-['Gotham'] text-sm font-bold ${textColor}`}
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordionGroup>
        </MobileAccordionGroup>

        <Link
          to={routes.whatWeThink}
          onClick={closePanels}
          className={`rounded-[18px] px-4 py-3 font-['Gotham'] text-sm font-bold ${textColor}`}
        >
          What we think
        </Link>
        <Link
          to={routes.inlearnAcademy}
          onClick={closePanels}
          className={`rounded-[18px] px-4 py-3 font-['Gotham'] text-sm font-bold ${textColor}`}
        >
          INLEARN Academy
        </Link>
        <span
          className={`rounded-[18px] px-4 py-3 font-['Gotham'] text-sm font-bold opacity-70 ${textColor}`}
        >
          INSIGHT Store
        </span>
      </div>
    </div>
  );
}

function SearchPanel({
  closePanels,
  inputRef,
  isDarkMode,
  isOpen,
  searchQuery,
  searchResults,
  setSearchQuery,
}) {
  const handleSubmit = (event) => event.preventDefault();
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen
          ? "max-h-[350px] translate-y-0 pb-5 pt-5 opacity-100"
          : "max-h-0 -translate-y-2 pb-0 pt-0 opacity-0"
      }`}
    >
      <div className="w-full px-8">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2.5 p-2"
        >
          <div
            className={`flex flex-1 items-center gap-2.5 overflow-hidden rounded-[40px] px-4 py-3 outline outline-1 outline-offset-[-1px] ${
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
              className={`w-full border-none bg-transparent font-['Gotham'] text-base font-light outline-none ${
                isDarkMode
                  ? "text-white placeholder:text-white/50"
                  : "text-black placeholder:text-black/40"
              }`}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className={`transition-colors ${
                  isDarkMode
                    ? "text-white/70 hover:text-white"
                    : "text-black/50 hover:text-black"
                }`}
              >
                ×
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            className={`inline-flex items-center justify-center gap-2.5 rounded-[50px] bg-[#37B478] px-4 py-2 font-['Gotham'] text-lg ${greenButtonTextColor} transition-all duration-200 hover:scale-[1.03] hover:bg-[#22C55E] active:scale-95 active:bg-[#16A34A]`}
          >
            Search
          </button>
        </form>

        <div
          className={`mt-4 font-['Gotham'] text-sm ${
            isDarkMode ? "text-white/80" : "text-black/80"
          }`}
        >
          {searchQuery && searchResults.length === 0 ? (
            <div
              className={`break-words rounded-[32px] border px-5 py-4 ${
                isDarkMode
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-black/5"
              }`}
            >
              <div>No results found for:</div>
              <div className={isDarkMode ? "text-white" : "text-black"}>
                "{searchQuery}"
              </div>
            </div>
          ) : null}

          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((result) => (
                <Link
                  key={`${result.title}-${result.type}`}
                  data-search-result={result.title}
                  to={result.to}
                  onClick={closePanels}
                  className={`cursor-pointer break-words rounded-[32px] border px-5 py-4 transition-colors duration-300 ${
                    isDarkMode
                      ? "border-white/10 bg-white/5 hover:bg-white/10"
                      : "border-black/10 bg-black/5 hover:bg-black/10"
                  }`}
                >
                  <div
                    className={`whitespace-normal break-words font-['Gotham'] text-sm font-semibold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {result.title}
                  </div>
                  <div
                    className={`font-['Gotham'] text-xs font-light ${
                      isDarkMode ? "text-white/70" : "text-black/60"
                    }`}
                  >
                    {result.type}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export {MobileMenuPanel, SearchPanel, WhatWeDoPanel};
