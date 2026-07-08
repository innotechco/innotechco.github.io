import excludeShape from "../../../../../assets/images/excludes/shared/Exclude.svg";
import excludeBlackShape from "../../../../../assets/images/excludes/shared/ExcludeBlack.svg";
import {useTheme} from "../../../../../context/useTheme";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import ResponsiveCarousel from "../../../../../components/ui/ResponsiveCarousel";
import {useContactAction} from "../../../../../context/useContactAction";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";

function EcosystemCard({
  image,
  imageLight,
  title,
  subtitle,
  isDarkMode,
  actionLabel = "Exclusive content",
  titleClassName = "",
  imageClassName = "",
  imageLightClassName,
}) {
  const {position: glowPosition, handlers} = usePointerGlow();
  const openContact = useContactAction();
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const activeImageClassName =
    !isDarkMode && imageLight
      ? imageLightClassName ?? imageClassName
      : imageClassName;

  return (
    <div
      className="relative isolate h-full min-w-0 flex-1 overflow-visible"
      {...handlers}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: glowPosition.active ? 1 : 0,
          background: `
            radial-gradient(
              600px circle at ${glowPosition.x}px ${glowPosition.y}px,
              rgba(55, 180, 120, 0.7),
              transparent 75%
            )
          `,
          filter: "blur(28px)",
          borderRadius: "25px",
        }}
      />

      <article
        className={`relative z-10 flex min-h-[230px] min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#37B478] p-4 sm:h-[250px] sm:p-6 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        }`}
      >
        <img loading="lazy"
          className="pointer-events-none absolute left-[-34px] top-[-52px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={isDarkMode ? excludeShape : excludeBlackShape}
          alt=""
          aria-hidden="true"
        />
        {/* تغییر این خط: کلاس‌های flex-col و sm:flex-row را حذف کردیم و از همان ابتدا آن را flex و justify-between کردیم */}
      <div className="relative z-10 flex w-full items-center justify-between gap-3 sm:items-end">
        <div className="relative size-[62px] shrink-0 overflow-hidden rounded-bl-[20px] rounded-br-[70px] rounded-tl-[20px] rounded-tr-[70px] sm:top-[-27px] sm:size-[90px]">
          <img loading="lazy"
            className={`block size-full object-contain ${activeImageClassName}`}
            src={!isDarkMode && imageLight ? imageLight : image}
            alt=""
            />
        </div>

        <button
          className={`absolute right-4 top-4 min-h-8 shrink-0 translate-x-2 translate-y-12 rounded-bl-[24px] rounded-br-[18px] rounded-tr-[18px] bg-[#22C55E] px-3.5 py-1.5 font-['Gotham'] text-xs font-bold leading-tight shadow-lg transition-all duration-200 hover:translate-x-2 hover:translate-y-12 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:translate-x-2 active:translate-y-12 active:scale-95 sm:translate-y-14 sm:px-4 sm:text-sm sm:hover:translate-y-14 sm:active:translate-y-14 ${greenButtonTextColor}`}
          onClick={() => openContact("selected-project")}
          type="button"
        >
          {actionLabel}
        </button>
      </div>

        <div
          className={`relative z-10 mt-auto flex w-full flex-col ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3
            className={`font-['Gotham'] text-xs sm:text-sm md:text-sm lg:text-base xl:text-base font-bold leading-tight sm:leading-snug break-words whitespace-normal ${titleClassName}`}
          >
            {title}
          </h3>
          <p className="mt-1 font-['Gotham'] text-[10px] sm:text-[11px] md:text-sm lg:text-sm xl:text-base font-normal leading-tight sm:leading-snug break-words whitespace-normal">
            {subtitle}
          </p>
        </div>
      </article>
    </div>
  );
}

function EcosystemCardsSection({
  actionLabel = "Exclusive content",
  cards,
  title = "LATEST IN OUR ECOSYSTEM OF CHANGE",
  titleClassName,
}) {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`self-stretch px-6 py-14 md:px-16 xl:px-[120px] xl:py-[60px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="flex w-full flex-col items-start gap-8">
        <SectionTitle textClassName={isDarkMode ? "text-white" : "text-black"}>
          {title}
        </SectionTitle>

        <div className="w-full lg:hidden">
          <ResponsiveCarousel ariaLabel={title} isDarkMode={isDarkMode}>
            {cards.map((card) => (
              <EcosystemCard
                key={card.id}
                {...card}
                actionLabel={actionLabel}
                isDarkMode={isDarkMode}
                titleClassName={titleClassName}
              />
            ))}
          </ResponsiveCarousel>
        </div>

        <div className="hidden w-full grid-cols-3 items-stretch gap-8 overflow-visible lg:grid">
          {cards.map((card) => (
            <EcosystemCard
              key={card.id}
              {...card}
              actionLabel={actionLabel}
              isDarkMode={isDarkMode}
              titleClassName={titleClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EcosystemCardsSection;
