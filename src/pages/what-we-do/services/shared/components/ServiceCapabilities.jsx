import {useTheme} from "../../../../../context/useTheme";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import PlayToggleButton from "../../../../../components/ui/PlayToggleButton";
import ResponsiveCarousel from "../../../../../components/ui/ResponsiveCarousel";

function CapabilityCard({title, description, isDarkMode}) {
  const {position: glowPosition, handlers} = usePointerGlow();

  return (
    <div
      className="relative isolate h-full min-h-[260px] w-full overflow-visible sm:min-h-[230px]"
      {...handlers}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[25px] transition-opacity duration-300"
        style={{
          opacity: glowPosition.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowPosition.x}px ${glowPosition.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(28px)",
        }}
      />
      <article
        className={`relative z-10 flex h-full min-h-[260px] w-full items-start justify-end gap-3 overflow-hidden rounded-[25px] border border-[#37B478] px-4 py-5 shadow-[inset_1px_-1px_2px_0px_#1d5f3f] sm:min-h-[230px] sm:px-8 sm:py-8 md:px-9 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        }`} 
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[25px] bg-[#37B478]/5" />
        <div className={`relative z-10 flex min-w-0 flex-1 flex-col items-start gap-3 ${isDarkMode ? "text-white" : "text-black"}`}>
          <h3 className="font-['Gotham'] text-base sm:text-lg md:text-xl font-bold leading-tight break-words whitespace-normal">
            {title}
          </h3>
          <p className="font-['Gotham'] text-sm sm:text-base md:text-sm font-normal leading-[1.35] sm:leading-[1.4] break-words whitespace-normal">
            {description}
          </p>
        </div>
        <PlayToggleButton label={`Toggle ${title}`} />
      </article>
    </div>
  );
}

function ServiceCapabilities({title, items}) {
  const {isDarkMode} = useTheme();

  return (
    <section className={`self-stretch px-6 py-24 md:px-16 xl:px-[120px] ${isDarkMode ? "bg-[#050505]" : "bg-white"}`}>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-8">
        <SectionTitle textClassName={isDarkMode ? "text-white" : "text-black"}>
          {title}
        </SectionTitle>

        <div className="w-full lg:hidden">
          <ResponsiveCarousel ariaLabel={title} isDarkMode={isDarkMode}>
            {items.map((item) => (
              <CapabilityCard
                key={item.title}
                {...item}
                isDarkMode={isDarkMode}
              />
            ))}
          </ResponsiveCarousel>
        </div>

        <div className="hidden w-full grid-cols-2 gap-[42px] overflow-visible items-stretch lg:grid lg:auto-rows-fr">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`h-full ${index === items.length - 1 ? "lg:col-span-2" : ""}`}
            >
              <CapabilityCard {...item} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceCapabilities;
