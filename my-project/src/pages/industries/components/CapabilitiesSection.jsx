import {useState} from "react";

import {useTheme} from "../../../context/useTheme";

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

function ServiceCard({title, description, href, isWide = false, isDarkMode}) {
  const [glowPosition, setGlowPosition] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setGlowPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setGlowPosition((previousPosition) => ({
      ...previousPosition,
      active: false,
    }));
  };

  return (
    <div
      className={`relative isolate w-full overflow-visible ${
        isWide ? "" : "min-h-[230px]"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
        className={`relative z-10 flex min-w-0 items-start justify-end gap-3 overflow-hidden rounded-[25px] border border-[#37B478] px-8 py-8 md:px-9 md:py-8 ${
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
          <h3 className="font-['Gotham'] text-2xl font-bold leading-tight">
            <ServiceTitle title={title} />
          </h3>
          <p className="font-['Gotham'] text-base leading-[1.4]">
            {description}
          </p>
        </div>

        {href ? (
          <a
            href={href}
            aria-label={`Open ${title}`}
            className="relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <span
              aria-hidden="true"
              className="h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#37B478]"
            />
          </a>
        ) : (
          <span
            aria-hidden="true"
            className="relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full opacity-70"
          >
            <span className="h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#37B478]" />
          </span>
        )}
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
        <div className="relative flex w-full flex-col items-start justify-center gap-2">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <h2
            className={`font-['Gotham'] text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            OUR CAPABILITIES
          </h2>
        </div>

        <div className="flex w-full flex-col items-start gap-[42px]">
          <div className="grid w-full grid-cols-1 gap-[42px] overflow-visible lg:grid-cols-2">
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
