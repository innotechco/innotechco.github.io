import {useState} from "react";

const services = [
  {
    title: "Innovation Systems (Governance)",
    description:
      "The energy transition is one of the world's greatest collective challenges. BCG develops solutions with clients by integrating financial, technological, economical, and societal considerations to ensure a just energy transition.",
  },
  {
    title: "Mining Analytics (Forecasting)",
    description:
      "Our technology analytics engines monitor industrial patents, extraction technologies, metallurgy innovation, and mineral infrastructure signals to strengthen mining foresight and strategic operational positioning.",
  },
  {
    title: "Digital Operations (Automation)",
    description:
      "We engineer AI-enabled mining infrastructures integrating operational dashboards, industrial automation, predictive maintenance systems, and connected extraction intelligence across distributed mining environments.",
  },
  {
    title: "Technology Roadmaps (Planning)",
    description:
      "We develop mining transformation roadmaps aligning industrial modernization priorities, digital infrastructure investments, and technology transition pathways across metals and mineral ecosystems.",
  },
  {
    title: "Industrial Intelligence (Enhancement)",
    description:
      "The INFINITY platform automates mining documentation workflows, operational monitoring, industrial intelligence mapping, and extraction analytics to accelerate enterprise-level industrial decision environments.",
  },
];

function ServiceCard({title, description, isWide = false}) {
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
        isWide ? "" : "h-[230px]"
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
        className={`relative z-10 flex min-w-0 items-start justify-end gap-2.5 overflow-hidden rounded-[25px] border border-[#1D5F3F] bg-[#050505] p-9 shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1)] ${
          isWide ? "w-full" : "h-[230px] w-full"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[25px] bg-[#37B478]/5"
        />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start gap-4 text-white">
          <h3 className="font-['Gotham'] text-2xl font-bold leading-normal">
            {title}
          </h3>
          <p className="font-['Gotham'] text-base leading-normal">
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
  return (
    <section className="self-stretch bg-[#050505] px-6 py-14 md:px-16 xl:px-[120px]">
      <div className="flex w-full flex-col items-start gap-8">
        <div className="relative flex w-full flex-col items-start justify-center gap-2">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <h2 className="font-['Gotham'] text-4xl font-bold text-white">
            OUR SERVICES IN
          </h2>
        </div>

        <div className="flex w-full flex-col items-start gap-[42px]">
          <div className="grid w-full grid-cols-1 gap-[42px] overflow-visible lg:grid-cols-2">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={`${service.title}-${index}`} {...service} />
            ))}
          </div>

          <div className="flex w-full items-start">
            <ServiceCard {...services[4]} isWide />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurServicesIn;
