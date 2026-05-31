import {useState} from "react";
import {useTheme} from "../../../context/useTheme";

const services = [
  {
    title: "AI Systems (Automation)",
    description:
      "We engineer AI-enabled operational ecosystems integrating intelligent agents, enterprise automation, predictive analytics, and scalable orchestration architectures across distributed digital infrastructures.",
  },
  {
    title: "Cloud Architectures (Infrastructure)",
    description:
      "We design enterprise cloud infrastructures integrating interoperable software systems, connected digital environments, scalable data orchestration, and intelligent operational modernization frameworks.",
  },
  {
    title: "Technology Analytics (Forecasting)",
    description:
      "Our intelligence frameworks analyze patents, emerging technologies, AI ecosystems, and software innovation signals to strengthen strategic foresight and accelerate executive technology positioning.",
  },
  {
    title: "Innovation Platforms (Governance)",
    description:
      "We deploy end-to-end innovation management systems integrating ITONICS, Brightidea, and AI-enabled governance architectures to strengthen technology execution and organizational transformation.",
  },
  {
    title: "Digital Intelligence (Optimization)",
    description:
      "The Innogene platform automates technology monitoring, innovation analytics, AI research synthesis, and digital operations mapping to accelerate enterprise-level strategic intelligence environments.",
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
