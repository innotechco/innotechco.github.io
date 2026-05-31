import highTechImage from "../../../assets/images/industries/hightech.png";
import industriesExcludeImage from "../../../assets/images/industries/IndustriesExclude.png";
import industriesExcludeBlackImage from "../../../assets/images/industries/IndustriesExcludeBlack.png";
import {useTheme} from "../../../context/useTheme";

function BreadcrumbChevron() {
  return (
    <div className="relative size-4 shrink-0 overflow-hidden">
      <div className="absolute left-[6px] top-[4px] h-2 w-1 rotate-[-45deg] border-b border-r border-[#37B478]" />
    </div>
  );
}

function HighTechPicCard() {
  const {isDarkMode} = useTheme();
  const textColor = "text-white";
  const industriesExclude = isDarkMode
    ? industriesExcludeImage
    : industriesExcludeBlackImage;

  return (
    <main
      className={`flex min-h-screen w-full items-center justify-center px-4 py-16 md:px-8 md:py-30 ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <article className="relative isolate w-full max-w-[1253px] min-h-[480px] overflow-hidden rounded-[50px] md:min-h-[601px]">
        <div className="absolute inset-0 overflow-hidden rounded-[50px]">
          <img
            className="absolute inset-0 size-full object-cover object-center brightness-120"
            src={highTechImage}
            alt=""
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/40 to-black/80" />
          <img
            className={`pointer-events-none absolute left-0 top-0 h-full w-[85%] object-fill ${
              isDarkMode ? "mix-blend-screen" : ""
            }`}
            src={industriesExclude}
            alt=""
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-start gap-2 px-8 py-12 md:px-32 md:py-36">
          <nav
            className="inline-flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <span className={`font-['Gotham'] text-sm font-light ${textColor}`}>
              what we do
            </span>
            <BreadcrumbChevron />
            <span className={`font-['Gotham'] text-sm font-light ${textColor}`}>
              Industries
            </span>
            <BreadcrumbChevron />
            <span className={`font-['Gotham'] text-sm font-light ${textColor}`}>
              High Tech
            </span>
          </nav>

          <h1 className={`font-['Gotham'] text-5xl font-bold leading-none md:text-7xl ${textColor}`}>
            High Tech
          </h1>

          <p className={`max-w-[631px] font-['Gotham'] text-xl leading-relaxed ${textColor}`}>
            Accelerate intelligent digital transformation across AI ecosystems,
            software infrastructures, cloud platforms, automation systems, and
            advanced computing environments through predictive technology
            analytics and scalable innovation architectures.
          </p>
        </div>
      </article>
    </main>
  );
}

export default HighTechPicCard;
