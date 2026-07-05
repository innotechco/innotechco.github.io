import {useTheme} from "../../../../../context/useTheme";
import IntroRevealText from "../../../../../components/ui/IntroRevealText";
import inceptionIcon from "../../../../../assets/icons/Inception-Icon 1.svg";
import inceptionLeftExclude from "../../../../../assets/images/excludes/inception/LeftExclude.webp";
import inceptionLeftExcludeBlack from "../../../../../assets/images/excludes/inception/LeftExcludeBlack.webp";
import inceptionRightExclude from "../../../../../assets/images/excludes/inception/RightExclude.webp";
import inceptionRightExcludeBlack from "../../../../../assets/images/excludes/inception/RightExcludeBlack.webp";

function Inception() {
  const {isDarkMode} = useTheme();
  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const leftExcludeImage = isDarkMode
    ? inceptionLeftExclude
    : inceptionLeftExcludeBlack;
  const rightExcludeImage = isDarkMode
    ? inceptionRightExclude
    : inceptionRightExcludeBlack;

  return (
    <main
      className={`relative flex min-h-[720px] w-full items-start justify-center overflow-hidden px-6 pt-36 md:min-h-[820px] md:pt-40 lg:min-h-screen lg:items-center lg:pt-28 ${pageBg}`}
    >
      <img loading="lazy"
        src={leftExcludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-55px] top-1/2 z-10 h-[min(640px,82vh)] max-w-none -translate-y-1/2 select-none md:left-0 lg:h-[min(850px,110vh)]"
      />
      <img loading="lazy"
        src={rightExcludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-55px] top-1/2 z-10 h-[min(640px,82vh)] max-w-none -translate-y-1/2 select-none md:right-0 lg:h-[min(850px,110vh)]"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img loading="lazy"
          src={inceptionIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />
        <IntroRevealText
          as="h1"
          variant="heading"
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INCEPTION
        </IntroRevealText>
        <IntroRevealText
          variant="copy"
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Innovation does not fail because companies lack ideas. It fails when
          ideas move through unclear roles, scattered channels, weak governance,
          and invisible value. INCEPTION turns innovation into a measurable
          management system.
        </IntroRevealText>
      </section>
    </main>
  );
}

export default Inception;
