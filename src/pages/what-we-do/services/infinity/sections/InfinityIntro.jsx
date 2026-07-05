import {useTheme} from "../../../../../context/useTheme";
import IntroRevealText from "../../../../../components/ui/IntroRevealText";
import infinityIcon from "../../../../../assets/icons/Subtract.svg";
import infinityExclude from "../../../../../assets/images/excludes/infinity/Exclude.webp";
import infinityExcludeBlack from "../../../../../assets/images/excludes/infinity/ExcludeBlack.webp";

function InfinityIntro() {
  const {isDarkMode} = useTheme();

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const excludeImage = isDarkMode ? infinityExclude : infinityExcludeBlack;

  return (
    <main
      className={`relative flex min-h-[720px] w-full items-start justify-center overflow-hidden px-6 pt-36 md:min-h-[820px] md:pt-40 lg:min-h-screen lg:items-center lg:pt-28 ${pageBg}`}
    >
      <img loading="lazy"
        src={excludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[56%] z-10 w-[min(940px,130vw)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none lg:bottom-[-20px] lg:top-auto lg:w-[min(1280px,150vw)] lg:translate-y-0"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img loading="lazy"
          src={infinityIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />

        <IntroRevealText
          as="h1"
          variant="heading"
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INFINITY
        </IntroRevealText>

        <IntroRevealText
          variant="copy"
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Digital transformation is not software installation. It is the
          redesign of how organizations sense problems, connect processes,
          automate decisions, and scale intelligent operations across teams,
          assets, and business units.
        </IntroRevealText>
      </section>
    </main>
  );
}

export default InfinityIntro;
