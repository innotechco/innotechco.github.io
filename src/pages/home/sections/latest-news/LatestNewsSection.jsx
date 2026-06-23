import {useTheme} from "../../../../context/useTheme";
import ReadMoreLink from "../../../../components/ui/ReadMoreLink";
import LatestNewsImage from "../../../../assets/images/home/LatestNews.webp";
import {latestNews} from "./data";

function LatestNewsSection() {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`relative w-full px-4 py-[60px] sm:px-6 lg:px-35 transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className={`flex flex-col overflow-hidden rounded-[32px] transition-colors duration-500 ease-in-out lg:h-[570px] lg:flex-row lg:rounded-[50px] ${
            isDarkMode ? "bg-white" : "bg-black"
          }`}
        >
          {/* LEFT CONTENT */}
          <div className="flex flex-1 flex-col self-stretch px-6 py-8 sm:px-10 lg:px-[68px] lg:py-[68px]">
            {/* Title */}
            <div className="relative inline-flex items-center">
              <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />

              <div
                className={`relative z-10 font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold leading-none transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                {latestNews.sectionTitle}
              </div>
            </div>

            <div className="h-8" />

            {/* Headline */}
            <div
              className={`max-w-[690px] font-['Gotham'] text-[clamp(1.4rem,6vw,1.875rem)] font-medium leading-[1.28] transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              {latestNews.headline}
            </div>

            <div className="h-8" />

            {/* Date and read time */}
            <div className="flex items-center gap-8">
              <div
                className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                {latestNews.date}
              </div>

              <div className="text-[#37B478] text-base font-['Gotham']">
                {latestNews.readTime}
              </div>
            </div>

            {/* Summary */}
            <div
              className={`mt-10 max-w-[690px] whitespace-pre-line text-base font-semilight font-['Gotham'] leading-[1.35] transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              {latestNews.summary}
            </div>

            <div className="h-8" />

            {/* Read-more link */}
            <ReadMoreLink
              isDarkMode={!isDarkMode}
              className="mt-8 cursor-pointer text-base font-['Gotham']"
            />
          </div>

          {/* Featured image */}
          <div className="h-72 w-full shrink-0 self-stretch overflow-hidden lg:h-auto lg:w-[496px]">
            <img loading="lazy"
              src={LatestNewsImage}
              alt="Latest news"
              className="h-full w-full object-cover lg:min-h-[640px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestNewsSection;
