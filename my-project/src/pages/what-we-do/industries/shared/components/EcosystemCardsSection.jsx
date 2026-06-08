import excludeShape from "../../../../../assets/images/excludes/shared/Exclude.svg";
import excludeBlackShape from "../../../../../assets/images/excludes/shared/ExcludeBlack.svg";
import {useTheme} from "../../../../../context/useTheme";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";

function EcosystemCard({
  image,
  title,
  subtitle,
  isDarkMode,
  titleClassName = "",
  imageClassName = "",
}) {
  const {position: glowPosition, handlers} = usePointerGlow();

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
        className={`relative z-10 flex h-[250px] min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#37B478] p-6 sm:p-9 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        }`}
      >
        <img
          className="pointer-events-none absolute left-[-34px] top-[-72px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={isDarkMode ? excludeShape : excludeBlackShape}
          alt=""
          aria-hidden="true"
        />
        <div className="relative z-10 flex w-full items-end justify-between gap-4">
          <div className="relative size-[80px] top-[-27px] shrink-0 overflow-hidden rounded-bl-[25px] rounded-br-[100px] rounded-tl-[25px] rounded-tr-[100px]">
            <img
              className={`block size-full object-contain ${imageClassName}`}
              src={image}
              alt=""
            />
          </div>

          <button
            className="shrink-0 rounded-bl-[30px] rounded-br-[20px] rounded-tr-[20px] bg-[#22C55E] px-4 py-2 font-['Gotham'] text-base font-bold leading-none text-black shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:scale-95"
            type="button"
          >
            Exclusive content
          </button>
        </div>

        <div
          className={`relative z-10 mt-auto flex w-full flex-col ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3
            className={`font-['Gotham'] text-2xl font-bold leading-none ${titleClassName}`}
          >
            {title}
          </h3>
          <p className="mt-1 font-['Gotham'] text-base font-normal leading-none">
            {subtitle}
          </p>
        </div>
      </article>
    </div>
  );
}

function EcosystemCardsSection({cards, titleClassName}) {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`self-stretch px-6 py-14 md:px-16 xl:px-[120px] xl:py-[60px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="flex w-full flex-col items-start gap-8">
        <SectionTitle textClassName={isDarkMode ? "text-white" : "text-black"}>
          LATEST IN OUR ECOSYSTEM OF CHANGE
        </SectionTitle>

        <div className="grid w-full grid-cols-1 items-stretch gap-8 overflow-visible lg:grid-cols-3">
          {cards.map((card) => (
            <EcosystemCard
              key={card.id}
              {...card}
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
