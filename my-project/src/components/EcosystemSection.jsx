import InnotechEcopic from "../assets/InnotechEcopic.png";
import ellipseImg from "../assets/EllipseBlack.png";
import InnoCard from "./InnoCard";

const cards = [
  {
    title: "INCEPTION",
    subtitle: "BY INNOTECH",
    items: [
      {
        label: "ISO56000 Assistant:",
        description:
          "Innovation Management Maturity\nAssessment aligned with ISO56000",
      },
      {
        label: "ITONICS:",
        description: "the End-to-End Innovation\nManagement Systems (IMS)",
      },
      {
        label: "BRIGHTIDEA:",
        description: "Innovation Cloud",
      },
    ],
  },
  {
    title: "INFINITY",
    subtitle: "BY INNOTECH",
    items: [
      {
        label: "Digital Transformation:",
        description:
          "Development of digital\ntransformation strategy and\nroadmap.",
      },
      {
        label: "AI Agent:",
        description:
          "Implementation of AI-powered agents for enhanced\nautomation and intelligence.",
      },
    ],
  },
  {
    title: "INSIGHT",
    subtitle: "BY INNOTECH",
    items: [
      {
        label: "STIMAnalytics:",
        description:
          "AI-powered technology and market trend analysis using patent data.",
      },
      {
        label: "STIMAnalytics for Market Analysis:",
        description:
          "AI-driven market research utilizing both global and local data.",
      },
      {
        label: "Opportunity Study:",
        description:
          "Comprehensive market research, feasibility studies (F S), and business planning (BP).",
      },
    ],
  },
  {
    title: "INLEARN",
    subtitle: "BY INNOTECH",
    items: [
      {
        label: "3-Minute Insights:",
        description:
          "Quick, actionable insights on emerging trends and innovations.",
      },
      {
        label: "Webinars and Workshops:",
        description:
          "Engaging sessions focused on\nthe latest industry innovations\nand market trends.",
      },
    ],
  },
];

function EcosystemSection() {
  return (
    <section className="relative w-full bg-black">
      {/* Ellipse Background */}
      <div className="-mt-20 relative z-10 w-full overflow-x-hidden">
        <img
          src={ellipseImg}
          alt="Ellipse Background"
          className="w-full block"
        />
      </div>

      {/* Content on top of Ellipse */}
      <div className="relative z-20 mt-[-38%] lg:mt-[-33%] pb-28">
        {/* CENTER IMAGE */}
        <div className="flex justify-center pb-16 px-4">
          <div className="overflow-hidden max-h-137.5">
            <img
              src={InnotechEcopic}
              alt="Innotech Ecosystem"
              className="w-auto h-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="w-full max-w-301.25 mx-auto px-4">
          <div className="flex flex-wrap justify-between items-start gap-6">
            {cards.map((card) => (
              <InnoCard
                key={card.title}
                title={card.title}
                subtitle={card.subtitle}
                items={card.items}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
