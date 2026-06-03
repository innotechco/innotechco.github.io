import {useTheme} from "../../../context/useTheme";
import ReadMoreLink from "../../../components/ui/ReadMoreLink";
import LatestNewsImage from "../../../assets/images/home/LatestNews.jpg";

function LatestNews() {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`relative w-full px-7 py-[60px] lg:px-35 transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className={`flex h-[570px] flex-col overflow-hidden rounded-[50px] transition-colors duration-500 ease-in-out lg:flex-row ${
            isDarkMode ? "bg-white" : "bg-black"
          }`}
        >
          {/* LEFT CONTENT */}
          <div className="flex-1 self-stretch px-[68px] py-[68px] flex flex-col">
            {/* Title */}
            <div className="relative inline-flex items-center">
              <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />

              <div
                className={`relative z-10 text-4xl font-bold font-['Gotham'] leading-none transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                Our latest news
              </div>
            </div>

            <div className="h-8" />

            {/* Headline */}
            <div
              className={`max-w-[690px] text-3xl font-medium font-['Gotham'] leading-[1.28] transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              InnotechCo launches regional collaboration with Cleannconnect.ai
            </div>

            <div className="h-8" />

            {/* Date and read time */}
            <div className="flex items-center gap-8">
              <div
                className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                June 1, 2026
              </div>

              <div className="text-[#37B478] text-base font-['Gotham']">
                2 minutes read
              </div>
            </div>

            {/* Summary */}
            <div
              className={`mt-10 max-w-[690px] text-base font-medium font-['Gotham'] leading-[1.35] transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              The partnership ,sparked at ADIPEC 2025, integrates AI-driven{" "}
              <br />
              clean tech solutions across regional supply chains, accelerating
              sustainability and operational efficiency for industrial clients.
            </div>

            <div className="h-8" />

            {/* Read-more link */}
            <ReadMoreLink
              isDarkMode={!isDarkMode}
              className="mt-8 cursor-pointer text-base font-['Gotham']"
            />
          </div>

          {/* Featured image */}
          <div className="w-full lg:w-[496px] shrink-0 self-stretch overflow-hidden">
            <img
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

export default LatestNews;
