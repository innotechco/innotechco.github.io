import {useTheme} from "../../../../../context/useTheme";
import insightIcon from "../../../../../assets/icons/Subtract2.svg";
import insightDarkExclude from "../../../../../assets/images/excludes/insight/Exclude.png";
import insightLightExclude from "../../../../../assets/images/excludes/insight/BlackExclude.png";

function InsightIntro() {
  const {isDarkMode} = useTheme();

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const excludeImage = isDarkMode ? insightDarkExclude : insightLightExclude;

  return (
    <main
      className={`relative flex min-h-screen w-full items-center justify-center overflow-visible px-6 pt-28 ${pageBg}`}
    >
      <img
        src={excludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(700px,135vw)] max-w-none -translate-x-1/2 -translate-y-[250px] select-none"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img
          src={insightIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />

        <h1
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INSIGHT
        </h1>

        <p
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Turning intelligence into action. INSIGHT combines AI-driven analysis,
          patent monitoring, market research, and science analytics to empower
          R&D and strategy teams. Shape product roadmaps, prioritize
          investments, and unlock measurable innovation value across industries.
        </p>
      </section>
    </main>
  );
}

export default InsightIntro;
