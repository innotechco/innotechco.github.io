import {useTheme} from "../../../../../context/useTheme";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";
import PlayToggleButton from "../../../../../components/ui/PlayToggleButton";

function ServiceTitle({title}) {
  const match = title.match(/^(.*?)(\s*\([^)]*\))$/);

  if (!match) {
    return title;
  }

  return (
    <>
      {match[1]}
      <span className="text-base font-normal leading-none">
        {" "}
        {match[2].trim()}
      </span>
    </>
  );
}

function ServiceCard({title, description, isWide = false, isDarkMode}) {
  const {position: glowPosition, handlers} = usePointerGlow();

  return (
    <div
      className={`relative isolate w-full overflow-visible ${
        isWide ? "" : "min-h-[230px]"
      }`}
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
        className={`relative z-10 flex min-w-0 items-start justify-end gap-3 overflow-hidden rounded-[25px] border border-[#37B478] px-4 py-5 sm:px-8 sm:py-8 md:px-9 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        } ${isWide ? "w-full" : "min-h-[230px] w-full"}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[25px] bg-[#37B478]/5"
        />

        <div
          className={`relative z-10 flex min-w-0 flex-1 flex-col items-start gap-3 pb-1 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3 className="font-['Gotham'] text-lg font-bold leading-tight sm:text-2xl">
            <ServiceTitle title={title} />
          </h3>
          <p className="font-['Gotham'] text-sm leading-[1.35] sm:text-base sm:leading-[1.4]">
            {description}
          </p>
        </div>

        <PlayToggleButton label={`Toggle ${title}`} />
      </article>
    </div>
  );
}

function CapabilitiesSection({services}) {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`self-stretch px-6 py-14 md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-8">
        <SectionTitle textClassName={isDarkMode ? "text-white" : "text-black"}>
          OUR CAPABILITIES
        </SectionTitle>

        <div className="flex w-full flex-col items-start gap-[42px]">
          <div className="grid w-full grid-cols-2 gap-4 overflow-visible md:gap-[42px] lg:grid-cols-2">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard
                key={`${service.title}-${index}`}
                {...service}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          <div className="flex w-full items-start">
            <ServiceCard {...services[4]} isWide isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
