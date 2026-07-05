import careersImage from "../../../../../assets/images/who-we-are/Careers.webp";
import marketResearchLogo from "../../../../../assets/icons/MarketResearch.svg";
import randMLogo from "../../../../../assets/icons/RandM.svg";
import {useTheme} from "../../../../../context/useTheme";

function ReportStoreCard() {
  const {isDarkMode} = useTheme();
  const cardBackground = isDarkMode ? "bg-white" : "bg-black";
  const cardText = isDarkMode ? "text-black" : "text-white";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <section
      className={`flex min-h-[760px] flex-col items-start gap-2.5 overflow-hidden px-6 py-20 md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-start justify-center gap-6 overflow-hidden rounded-[32px] transition-colors duration-500 lg:flex-row lg:rounded-[50px] ${cardBackground}`}
      >
        <div className="order-2 flex flex-1 flex-col items-start justify-start gap-8 self-stretch p-6 sm:p-10 lg:order-1 xl:p-16">
          <h2 className={`font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold ${cardText}`}>
            Report Store
          </h2>
          <div className="flex w-full items-start gap-3">
            <span className="mt-8 size-2.5 shrink-0 rounded-full bg-[#37B478]" />
            <h3
              className={`mt-5 w-full font-['Gotham'] text-lg font-light leading-[1.5] sm:text-2xl ${cardText}`}
            >
              PLRs, MRRs, and SLRs provide precise, data-driven intelligence for
              technology and market decision-making.
            </h3>
          </div>
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center rounded-[50px] bg-[#22C55E] px-6 py-3.5 font-['Gotham'] text-xl font-bold sm:text-2xl ${greenButtonTextColor} shadow-lg transition-all duration-200 hover:bg-[#16A34A] hover:shadow-xl active:scale-95`}
          >
            Go to store
          </button>

          <div className="mt-auto grid w-full grid-cols-2 items-center justify-center gap-6 sm:gap-14">
            <img loading="lazy"
              src={randMLogo}
              alt="R and M"
              className="relative z-10 h-16 w-auto max-w-[180px] object-contain transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-110"
            />
            <img loading="lazy"
              src={marketResearchLogo}
              alt="Market Research"
              className="relative z-10 h-16 w-auto max-w-[180px] object-contain transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-110"
            />
          </div>
        </div>
        <div className="order-1 flex h-72 w-full items-end justify-end self-stretch overflow-hidden lg:order-2 lg:h-auto lg:w-[496px]">
          <img loading="lazy"
            src={careersImage}
            alt=""
            aria-hidden
            className="size-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default ReportStoreCard;
