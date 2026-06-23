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
        className="absolute inset-0 size-full bg-black object-contain object-center brightness-125 contrast-110 md:object-cover"
      />

      {/* Glass card section */}
      <div className="absolute inset-x-4 top-[clamp(92px,18vh,205px)] z-10 md:left-[clamp(40px,8vw,120px)] md:right-auto">
        <div
          className={`relative inline-flex min-h-[360px] w-full max-w-[577px] flex-col items-start justify-start gap-4 overflow-hidden rounded-[28px] border px-6 py-8 backdrop-blur-[3px] transition-all duration-500 ease-in-out sm:min-h-[430px] sm:gap-6 sm:rounded-[40px] sm:px-12 sm:py-12 lg:h-[477px] lg:px-20 lg:py-16 ${
            isDarkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/30 border-black/20"
          }`}
        >
          <img
            src={aiAgentExclude}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 size-full object-fill left-[-90px]"
          />

          {/* AI Agent title */}
          <div className="relative z-10 mb-2 h-20 w-64 sm:mb-6">
            <div className="w-20 h-20 left-0 top-0 absolute rounded-full border-2 border-[#37B478]" />
            <div className="w-3 h-3 left-[4.72px] top-[7.08px] absolute bg-[#37B478] rounded-full" />
            <div
                className={`absolute left-[27px] top-4 font-['Gotham'] text-[clamp(2.5rem,10vw,3rem)] font-bold leading-none transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {heroContent.title}
            </div>
          </div>

          {/* Description text */}
          <div
            className={`relative z-10 mt-2 place-self-auto justify-start pr-0 font-['Gotham'] text-[clamp(1.15rem,4.6vw,1.5rem)] font-medium leading-tight transition-colors duration-500 ease-in-out sm:mt-6 sm:pr-8 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {heroContent.description}
          </div>

          {/* Read more button and underline */}
          <div className="relative z-10 mt-4">
            <Link
              to={routes.aiAgent}
              className="group flex w-fit flex-col items-start cursor-pointer transition-all duration-300"
            >
              <div
                className={`text-base font-light font-['Gotham'] transition-colors duration-300 group-hover:text-[#37B478] ${
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
