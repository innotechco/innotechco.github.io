import {useTheme} from "../../../../../context/useTheme";
import IntroRevealText from "../../../../../components/ui/IntroRevealText";
import insightIcon from "../../../../../assets/icons/Subtract2.svg";
import insightDarkExclude from "../../../../../assets/images/excludes/insight/Exclude.webp";
import insightLightExclude from "../../../../../assets/images/excludes/insight/BlackExclude.webp";

function InsightIntro() {
  const {isDarkMode} = useTheme();

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const excludeImage = isDarkMode ? insightDarkExclude : insightLightExclude;

  return (
    <main
      className={`relative flex min-h-[720px] w-full items-start justify-center overflow-hidden px-6 pt-36 md:min-h-[820px] md:pt-40 lg:min-h-screen lg:items-center lg:pt-28 ${pageBg}`}
    >
      <img loading="lazy"
        src={excludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[52%] z-10 w-[min(620px,94vw)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none lg:w-[min(700px,135vw)] lg:-translate-y-[250px]"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img loading="lazy"
          src={insightIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />

        <IntroRevealText
          as="h1"
          variant="heading"
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INSIGHT
        </IntroRevealText>

        <IntroRevealText
          variant="copy"
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Turning intelligence into action. INSIGHT combines AI-driven analysis,
          patent monitoring, market research, and science analytics to empower
          R&D and strategy teams. Shape product roadmaps, prioritize
          investments, and unlock measurable innovation value across industries.
        </IntroRevealText>
      </section>
    </main>
  );
}

export default InsightIntro;
