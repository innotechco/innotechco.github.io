import {Link} from "react-router-dom";

import {useTheme} from "../../../../context/useTheme";
import {routes} from "../../../../routes";
import bgImage from "../../../../assets/images/home/Firstpagepic.webp";
import aiAgentExcludeImage from "../../../../assets/images/excludes/home/AIagentExclude.webp";
import aiAgentExcludeWhiteImage from "../../../../assets/images/excludes/home/AIagentExcludeWhite.webp";
import {heroContent} from "./data";

function HeroSection() {
  const {isDarkMode} = useTheme();
  const aiAgentExclude = isDarkMode
    ? aiAgentExcludeImage
    : aiAgentExcludeWhiteImage;

  return (
    <section className="relative z-10 min-h-[100svh] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full bg-black object-cover object-top brightness-125 contrast-110"
      />

      {/* Glass card section */}
      <div className="absolute left-4 top-[clamp(96px,18vh,205px)] z-10 w-[min(300px,calc(100vw-32px))] sm:left-8 sm:w-[380px] md:left-[clamp(40px,8vw,120px)] md:w-[min(577px,44vw)]">
        <div
          className={`relative inline-flex min-h-[260px] w-full flex-col items-start justify-start gap-3 overflow-hidden rounded-[24px] border px-5 py-6 backdrop-blur-[3px] transition-all duration-500 ease-in-out sm:min-h-[330px] sm:gap-4 sm:rounded-[34px] sm:px-8 sm:py-9 lg:h-[477px] lg:gap-6 lg:rounded-[40px] lg:px-20 lg:py-16 ${
            isDarkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/30 border-black/20"
          }`}
        >
          <img
            src={aiAgentExclude}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 left-[-52px] z-0 size-full object-fill sm:left-[-70px] lg:left-[-90px]"
          />

          {/* AI Agent title */}
          <div className="locale-hero-title relative z-10 h-16 w-full sm:h-18 lg:mb-6 lg:h-20">
            <div className="locale-hero-title-circle absolute left-0 top-0 size-16 rounded-full border-2 border-[#37B478] sm:size-18 lg:size-20" />
            <div className="locale-hero-title-dot absolute left-[4px] top-[6px] size-2.5 rounded-full bg-[#37B478] lg:left-[4.72px] lg:top-[7.08px] lg:size-3" />
            <div
                className={`locale-hero-title-text absolute left-[22px] top-3 font-['Gotham'] text-[clamp(2.25rem,9vw,3rem)] font-bold leading-none transition-colors duration-500 ease-in-out sm:left-[25px] lg:left-[27px] lg:top-4 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {heroContent.title}
            </div>
          </div>

          {/* Description text */}
          <div
            className={`relative z-10 mt-2 place-self-auto justify-start pr-0 font-['Gotham'] text-[clamp(0.95rem,4vw,1.5rem)] font-medium leading-tight transition-colors duration-500 ease-in-out sm:mt-4 lg:mt-6 lg:pr-8 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {heroContent.description}
          </div>

          {/* Read more button and underline */}
          <div className="relative z-10 mt-2 lg:mt-4">
            <Link
              to={routes.featuredArticle}
              className="group flex w-fit flex-col items-start cursor-pointer transition-all duration-300"
            >
              <div
                className={`font-['Gotham'] text-sm font-light transition-colors duration-300 group-hover:text-[#37B478] sm:text-base ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {heroContent.linkLabel}
              </div>
              <div className="mt-1 h-0.5 w-20 rounded-full bg-[#37B478] transition-all duration-300 group-hover:w-24" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar spacer */}
      <div className="relative z-20 pt-6 h-full w-full" />

      <div
        className="bg-black bg-blend-overlay"
        style={{
          width: ".66px",
          height: "817.15px",
          left: "187px",
          top: "115px",
          transform: "rotate(178.04deg)",
          transformOrigin: "top left",
          borderRadius: "9999px",
          opacity: 0.9,
          zIndex: 5,
        }}
      />
    </section>
  );
}

export default HeroSection;
