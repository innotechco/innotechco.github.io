import careersImage from "../../../../../assets/images/who-we-are/Careers.png";
import marketResearchLogo from "../../../../../assets/icons/MarketResearch.svg";
import randMLogo from "../../../../../assets/icons/RandM.svg";
import {useTheme} from "../../../../../context/useTheme";

function ReportStoreCard() {
  const {isDarkMode} = useTheme();
  const cardBackground = isDarkMode ? "bg-white" : "bg-black";
  const cardText = isDarkMode ? "text-black" : "text-white";

  return (
    <section
      className={`flex min-h-[760px] flex-col items-start gap-2.5 overflow-hidden px-6 py-24 md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1600px] flex-1 items-start justify-center gap-8 overflow-hidden rounded-[50px] transition-colors duration-500 ${cardBackground}`}
      >
        <div className="flex flex-1 flex-col items-start justify-start gap-8 self-stretch p-16">
          <h2 className={`font-['Gotham'] text-4xl font-bold ${cardText}`}>
            Report Store
          </h2>
          <div className="flex w-full items-start gap-3">
            <span className="mt-3 size-2.5 shrink-0 rounded-full bg-[#37B478]" />
            <h3
              className={`w-full font-['Gotham'] text-3xl leading-[1.2] ${cardText}`}
            >
              PLRs, MRRs, and SLRs provide precise, data-driven intelligence for
              technology and market decision-making.
            </h3>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[50px] bg-[#22C55E] px-6 py-3.5 font-['Gotham'] text-2xl font-normal text-white shadow-lg transition-all duration-200 hover:bg-[#16A34A] hover:shadow-xl active:scale-95"
          >
            Go to store
          </button>

          <div className="mt-auto flex w-full items-center justify-center gap-14">
            <img
              src={randMLogo}
              alt="R and M"
              className="relative z-10 h-16 w-auto max-w-[180px] object-contain transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-110"
            />
            <img
              src={marketResearchLogo}
              alt="Market Research"
              className="relative z-10 h-16 w-auto max-w-[180px] object-contain transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-110"
            />
          </div>
        </div>
        <div className="flex w-[496px] items-end justify-end self-stretch overflow-hidden">
          <img
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
