import {useTheme} from "../../../../../context/useTheme";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";
import SectionTitle from "../../../../../components/ui/SectionTitle";

function ActionCard({item, isDarkMode}) {
  const {position: glow, handlers} = usePointerGlow();

  return (
    <div
      className="relative isolate h-full min-w-0 overflow-visible"
      {...handlers}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[25px] transition-opacity duration-300"
        style={{
          opacity: glow.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${glow.x}px ${glow.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(28px)",
        }}
      />

      <article
        className={`relative z-10 flex h-full min-w-0 flex-col gap-4 overflow-hidden rounded-[25px] border border-[#37B478] p-4 shadow-[inset_1px_-1px_2px_0px_#1d5f3f] sm:gap-6 md:p-9 ${
          isDarkMode ? "bg-[#050505] text-white" : "bg-white text-black"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[25px] bg-[#37B478]/5" />

        <header className="relative z-10 min-w-0">
          <h3 className="font-['Gotham'] text-lg font-bold leading-tight sm:text-2xl">
            {item.title}
          </h3>
          <p className="font-['Gotham'] text-sm font-normal leading-tight sm:text-base">
            {item.subtitle}
          </p>
        </header>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-3 px-0 font-['Gotham'] text-sm font-normal leading-[1.35] sm:text-base md:px-4 xl:px-8">
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="min-w-0 wrap-break-words text-left">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}

function ServiceActionSection({title, items}) {
  const {isDarkMode} = useTheme();

  return (
    <section className={`w-full px-6 py-24 md:px-16 xl:px-[120px] ${isDarkMode ? "bg-[#050505]" : "bg-white"}`}>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-8">
        <SectionTitle textClassName={isDarkMode ? "text-white" : "text-black"}>
          {title}
        </SectionTitle>

        <div className="grid w-full grid-cols-2 items-stretch gap-4 md:gap-8 lg:grid-cols-3">
          {items.map((item) => (
            <ActionCard key={item.title} item={item} isDarkMode={isDarkMode} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceActionSection;
