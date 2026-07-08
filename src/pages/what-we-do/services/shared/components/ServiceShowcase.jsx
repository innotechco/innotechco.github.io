import excludeShape from "../../../../../assets/images/excludes/shared/Exclude.svg";
import excludeBlackShape from "../../../../../assets/images/excludes/shared/ExcludeBlack.svg";
import {useTheme} from "../../../../../context/useTheme";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import ResponsiveCarousel from "../../../../../components/ui/ResponsiveCarousel";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";
import {useContactAction} from "../../../../../context/useContactAction";

function ShowcaseCard({
  buttonLabel,
  icon,
  iconClassName = "",
  title,
  subtitle,
  isDarkMode,
  contactActionId,
}) {
  const {position: glowPosition, handlers} = usePointerGlow();
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const openContact = useContactAction();

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
        className={`relative z-10 flex min-h-[230px] min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#37B478] p-4 sm:h-[250px] sm:p-7 xl:p-9 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        }`}
      >
        <img loading="lazy"
          className="pointer-events-none absolute left-[-34px] top-[-52px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={isDarkMode ? excludeShape : excludeBlackShape}
          alt=""
          aria-hidden="true"
        />

        <div className="relative z-10 flex w-full items-end justify-between gap-4">
          <div className="relative size-[94px] shrink-0">
            <span
              aria-hidden
              className={`absolute left-0 top-0 size-9 bg-[#22C55E] ${iconClassName}`}
              style={{
                WebkitMask: `url("${icon}") center / contain no-repeat`,
                mask: `url("${icon}") center / contain no-repeat`,
              }}
            />
          </div>

          <button
            onClick={() => openContact(contactActionId)}
            className={`absolute right-4 top-4 min-h-11 shrink-0 rounded-bl-[24px] rounded-br-[18px] rounded-tr-[18px] bg-[#22C55E] px-3 py-2 font-['Gotham'] text-xs font-bold leading-tight sm:px-4 sm:text-base sm:leading-none ${greenButtonTextColor} shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:scale-95`}
            type="button"
          >
            {buttonLabel}
          </button>
        </div>

        <div
          className={`relative z-10 mt-auto flex w-full flex-col ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3 className="font-['Gotham'] text-lg font-bold leading-tight sm:text-2xl sm:leading-none">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 font-['Gotham'] text-sm font-normal leading-tight sm:text-base sm:leading-none">
              {subtitle}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

function ServiceShowcase({title, cards, icon, iconClassName}) {
  const {isDarkMode} = useTheme();
  const contactActionId = title === "INCEPTION SHOWROOM"
    ? "inception-showroom"
    : title === "SAMPLES AND TRIALS"
      ? "insight-samples"
      : "infinity-engine";

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
              <ShowcaseCard
                key={card.id}
                {...card}
                icon={icon}
                iconClassName={iconClassName}
                isDarkMode={isDarkMode}
                contactActionId={contactActionId}
              />
            ))}
          </ResponsiveCarousel>
        </div>

        <div className="hidden w-full grid-cols-3 items-stretch gap-8 overflow-visible lg:grid">
          {cards.map((card) => (
            <ShowcaseCard
              key={card.id}
              {...card}
              icon={icon}
              iconClassName={iconClassName}
              isDarkMode={isDarkMode}
              contactActionId={contactActionId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceShowcase;
