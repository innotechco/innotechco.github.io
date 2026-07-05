import {useTheme} from "../../context/useTheme";
import inceptionIcon from "../../assets/icons/Subtract3.svg";
import darkCircle from "../../assets/images/excludes/insight/Exclude.webp";
import lightCircle from "../../assets/images/excludes/insight/BlackExclude.webp";
import {inlearnAcademyContent} from "./data";

function InlearnAcademy() {
  const {isDarkMode} = useTheme();

  return (
    <main
      className={`relative flex min-h-[200px] w-full items-start justify-center overflow-hidden px-6 pb-80 pt-30 transition-colors duration-500 ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <img
        src={isDarkMode ? darkCircle : lightCircle}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[500px] z-10 w-[min(760px,92vw)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
      />

      <section className="relative z-20 mt-[220px] flex w-[min(680px,calc(100vw-48px))] flex-col items-center justify-center gap-7 text-center">
        <p
          className={`font-['Gotham'] text-base font-normal tracking-[0.22em] md:text-lg ${
            isDarkMode ? "text-white/70" : "text-black/60"
          }`}
        >
          {inlearnAcademyContent.eyebrow}
        </p>

        <img
          src={inceptionIcon}
          alt="INLEARN Academy"
          className="size-16 animate-spin object-contain [animation-duration:7s] [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)] md:size-20"
        />

        <h1
          className={`font-['Gotham'] text-5xl font-medium leading-none tracking-tight sm:text-6xl md:text-8xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {inlearnAcademyContent.title}
        </h1>
      </section>
    </main>
  );
}

export default InlearnAcademy;
