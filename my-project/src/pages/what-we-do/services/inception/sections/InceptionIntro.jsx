import {useTheme} from "../../../../../context/useTheme";
import inceptionIcon from "../../../../../assets/icons/Inception-Icon 1.svg";
import inceptionLeftExclude from "../../../../../assets/images/excludes/inception/LeftExclude.png";
import inceptionLeftExcludeBlack from "../../../../../assets/images/excludes/inception/LeftExcludeBlack.png";
import inceptionRightExclude from "../../../../../assets/images/excludes/inception/RightExclude.png";
import inceptionRightExcludeBlack from "../../../../../assets/images/excludes/inception/RightExcludeBlack.png";

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
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 ${pageBg}`}
    >
      <img
        src={leftExcludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-160px] top-1/2 z-10 h-[min(850px,110vh)] max-w-none -translate-y-1/2 select-none md:left-[0px]"
      />
      <img
        src={rightExcludeImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-260px] top-1/2 z-10 h-[min(850px,110vh)] max-w-none -translate-y-1/2 select-none md:right-[0px]"
      />

      <section className="relative z-20 flex w-[min(466px,calc(100vw-48px))] flex-col items-center justify-start gap-4 text-center">
        <img
          src={inceptionIcon}
          alt=""
          aria-hidden
          className="size-9 object-contain [filter:brightness(0)_saturate(100%)_invert(65%)_sepia(33%)_saturate(1153%)_hue-rotate(93deg)_brightness(86%)_contrast(88%)]"
        />
        <h1
          className={`font-['Gotham'] text-5xl font-normal leading-none md:text-7xl ${textColor}`}
        >
          INCEPTION
        </h1>
        <p
          className={`font-['Gotham'] text-base font-normal leading-tight md:text-xl ${textColor}`}
        >
          Innovation does not fail because companies lack ideas. It fails when
          ideas move through unclear roles, scattered channels, weak governance,
          and invisible value. INCEPTION turns innovation into a measurable
          management system.
        </p>
      </section>
    </main>
  );
}

export default Inception;
