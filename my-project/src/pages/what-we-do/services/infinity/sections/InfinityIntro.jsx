import {useTheme} from "../../../../../context/useTheme";
import infinityIcon from "../../../../../assets/icons/Subtract.svg";
import infinityExclude from "../../../../../assets/images/excludes/infinity/Exclude.png";

function InfinityIntro() {
  const {isDarkMode} = useTheme();

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <main
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 ${pageBg}`}
    >
      <img
        src={infinityExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 bottom-[-42vw] z-10 w-[min(1280px,150vw)] max-w-none -translate-x-1/2 select-none md:bottom-[-20px]"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img
          src={infinityIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />

        <h1
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INFINITY
        </h1>

        <p
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Digital transformation is not software installation. It is the
          redesign of how organizations sense problems, connect processes,
          automate decisions, and scale intelligent operations across teams,
          assets, and business units.
        </p>
      </section>
    </main>
  );
}

export default InfinityIntro;
