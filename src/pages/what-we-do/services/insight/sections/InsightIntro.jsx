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
      className={`relative z-20 flex min-h-[640px] w-full items-start justify-center overflow-visible px-6 pt-44 md:min-h-[720px] md:pt-48 lg:min-h-screen lg:items-center lg:pt-28 ${pageBg}`}
    >
      <img loading="lazy"
        src={excludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[350px] z-10 w-[min(700px,92vw)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none lg:top-1/2 lg:w-[min(700px,135vw)] lg:-translate-y-[250px]"
      />

      <section className="relative z-20 flex w-[min(440px,calc(100vw-64px))] flex-col items-center justify-start gap-3 text-center">
        <img loading="lazy"
          src={insightIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />

        <IntroRevealText
          as="h1"
          variant="heading"
          className={`font-['Gotham'] text-4xl font-normal leading-none sm:text-5xl md:text-7xl ${textColor}`}
        >
          INSIGHT
        </IntroRevealText>

        <IntroRevealText
          variant="copy"
          className={`font-['Gotham'] text-sm font-normal leading-tight sm:text-base md:text-xl ${textColor}`}
        >
          Turning intelligence into action. INSIGHT combines AI-driven analysis,
          patent landscape, market research, and science analytics to empower
          R&D, marketing and strategy teams. Shape product roadmaps, prioritize
          investments, and unlock measurable innovation and market value across
          industries.
        </IntroRevealText>
      </section>
    </main>
  );
}

export default InsightIntro;
