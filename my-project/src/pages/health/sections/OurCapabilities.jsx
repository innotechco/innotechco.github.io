import {useState} from "react";
import {useTheme} from "../../../context/useTheme";

const services = [
  {
    title: "Clinical Intelligence (Optimization)",
    description:
      "We deploy AI healthcare systems to unify distributed clinical operations, strengthen diagnostics acceleration, optimize care coordination, and modernize healthcare infrastructure across enterprise hospital ecosystems.",
  },
  {
    title: "Diagnostics Analytics (Forecasting)",
    description:
      "Energy development has a whole new meaning today, as companies search for the right strategies, investments, and operating models to deliver low-carbon solutions and renewable energy. BCG’s approach equips companies to maximize value from participation.",
  },
  {
    title: "Biomedical Strategy (Research)",
    description:
      "The energy transition is one of the world’s greatest collective challenges. BCG develops solutions with clients by integrating financial, technological, economical, and societal considerations to ensure a just energy transition.",
  },
  {
    title: "MedTech Systems (Infrastructure)",
    description:
      "Energy development has a whole new meaning today, as companies search for the right strategies, investments, and operating models to deliver low-carbon solutions and renewable energy. BCG's approach equips companies to maximize value from participation.",
  },
  {
    title: "AI Automation (Enhancement)",
    description:
      "The INFINITY platform automates clinical documentation workflows, biomedical intelligence mapping, diagnostics research synthesis, and healthcare operations reporting to accelerate AI-enabled healthcare decision environments."
  },
];

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
  const [pos, setPos] = useState({x: 0, y: 0, active: false});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setPos((prev) => ({...prev, active: false}));
  };

  return (
    <div
      className={`relative isolate w-full overflow-visible ${
        isWide ? "" : "min-h-[230px]"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* neon ambient glow — behind card (blur spills outside edges) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `
            radial-gradient(
              600px circle at ${pos.x}px ${pos.y}px,
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
        } ${
          isWide ? "w-full" : "min-h-[230px] w-full"
        }`}
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

        <span
          aria-hidden="true"
          className="relative z-10 mt-1 h-0 w-0 shrink-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#37B478]"
        />
      </article>
    </div>
  );
}

function OurServicesIn() {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`self-stretch px-6 py-14 md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="flex w-full flex-col items-start gap-8">
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

export default OurServicesIn;
