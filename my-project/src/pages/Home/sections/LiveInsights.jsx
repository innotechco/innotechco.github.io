import {Link} from "react-router-dom";
import ReadMoreLink from "../../../components/ui/ReadMoreLink";
import {useTheme} from "../../../context/useTheme";
import {routes} from "../../../routes";
import HealthImage from "../../../assets/images/industries/health/health1.png";
import EnergyAndMaterialsImage from "../../../assets/images/industries/energy-and-materials/energyandmaterials1.png";
import MetalsAndMiningImage from "../../../assets/images/industries/metals-and-mining/metalsandmining1.png";
import {usePointerGlow} from "../../../hooks/usePointerGlow";

function HowWeThink() {
  const {isDarkMode} = useTheme();

  const {position: pos1, handlers: glow1} = usePointerGlow();
  const {position: pos2, handlers: glow2} = usePointerGlow();
  const {position: pos3, handlers: glow3} = usePointerGlow();

  return (
    <section
      className={`w-full px-7 py-14 lg:px-35 overflow-hidden relative transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-8">
        {/* TITLE section */}
        <div className="relative inline-flex items-center gap-3.5">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <div
            className={`relative z-10 text-4xl font-bold font-['Gotham'] transition-colors duration-500 ease-in-out ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            LIVE INSIGHTS
          </div>
        </div>

        {/* CONTENT section */}
        <div className="flex items-start gap-11 relative">
          {/* LEFT BIG CARD with its own neon glow */}
          <div className="relative">
            {/* Neon glow behind left card */}
            <div
              className="pointer-events-none absolute transition-opacity duration-300"
              style={{
                left: 0,
                top: 0,
                width: "542px",
                height: "702px",
                opacity: pos1.active ? 1 : 0,
                background: `
                  radial-gradient(
                    600px circle at ${pos1.x}px ${pos1.y}px,
                    rgba(55, 180, 120, 0.7),
                    transparent 75%
                  )
                `,
                filter: "blur(20px)",
                borderRadius: "50px",
                zIndex: 0,
              }}
            />

            <div
              className={`w-[542px] h-[702px] rounded-[50px] border border-[#37B478] overflow-hidden flex flex-col transition-colors duration-500 ease-in-out relative z-10 ${
                isDarkMode ? "bg-black" : "bg-white"
              }`}
              {...glow1}
            >
              <img
                src={HealthImage}
                alt="How We Think"
                className="w-full h-96 object-cover"
              />

              <div className="flex min-h-0 w-[500px] flex-1 flex-col justify-center gap-3 px-10 py-7">
                <div
                  className={`text-3xl font-['Gotham'] leading-[1.25] font-medium transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  AI-Driven Drug Discovery
                </div>

                <div className="inline-flex items-center gap-8">
                  <div
                    className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    June 1, 2026
                  </div>
                  <div className="text-[#37B478] text-base font-['Gotham']">
                    2 minutes read
                  </div>
                </div>

                <div
                  className={`text-base font-['Gotham'] leading-[1.45] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Inventions combining AI and biotechnology have grown
                  significantly in recent years. Specifically, the number of
                  inventions in this field has increased twelvefold over the
                  past 20 years, far outpacing the general growth rate across
                  all other technology sectors.
                </div>

                <ReadMoreLink isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid h-[702px] flex-1 grid-rows-2 gap-8">
            {/* CARD 1 (right - top) with its own neon glow */}
            <div className="relative min-h-0">
              {/* Neon glow behind right card 1 */}
              <div
                className="pointer-events-none absolute transition-opacity duration-300"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: pos2.active ? 1 : 0,
                  background: `
                    radial-gradient(
                      600px circle at ${pos2.x}px ${pos2.y}px,
                      rgba(55, 180, 120, 0.7),
                      transparent 75%
                    )
                  `,
                  filter: "blur(20px)",
                  borderRadius: "50px",
                  zIndex: 0,
                }}
              />

              <div
                className={`w-full h-full rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                {...glow2}
              >
                <img
                  src={EnergyAndMaterialsImage}
                  alt="Hydrogen Generation from Natural Gas"
                  className="h-full w-[45%] shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch px-5 py-4">
                  <div
                    className={`text-xl font-['Gotham'] leading-[1.2] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Hydrogen Generation
                    <br /> from Natural Gas
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div
                      className={`text-sm font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      June 1, 2026
                    </div>
                    <div className="text-sm font-['Gotham'] text-[#37B478]">
                      2 minutes read
                    </div>
                  </div>
                  <div
                    className={`text-sm font-['Gotham'] leading-[1.35] font-extralight transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    The Hydrogen Generation from Natural Gas Patent Landscape
                    Report provides an in-depth patent landscape analysis,
                    covering 3,006 patents from 2010 to 2026, collected across
                    major global jurisdictions.
                  </div>

                  <ReadMoreLink isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            {/* CARD 2 (right - bottom) with its own neon glow */}
            <div className="relative min-h-0">
              {/* Neon glow behind right card 2 */}
              <div
                className="pointer-events-none absolute transition-opacity duration-300"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: pos3.active ? 1 : 0,
                  background: `
                    radial-gradient(
                      600px circle at ${pos3.x}px ${pos3.y}px,
                      rgba(55, 180, 120, 0.7),
                      transparent 75%
                    )
                  `,
                  filter: "blur(20px)",
                  borderRadius: "50px",
                  zIndex: 0,
                }}
              />

              <div
                className={`w-full h-full rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                {...glow3}
              >
                <img
                  src={MetalsAndMiningImage}
                  alt="Smart Carbon Technology"
                  className="h-full w-[45%] shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch px-5 py-4">
                  <div
                    className={`text-xl font-['Gotham'] leading-[1.2] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Smart Carbon Technology
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div
                      className={`text-sm font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      June 1, 2026
                    </div>
                    <div className="text-sm font-['Gotham'] text-[#37B478]">
                      2 minutes read
                    </div>
                  </div>
                  <div
                    className={`text-sm font-['Gotham'] leading-[1.35] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    InnotechCo introduced INCEPTION, processes, run maturity
                    assessments, and connect AI agents to real business
                    workflows.
                  </div>

                  <ReadMoreLink isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-end">
          <Link
            to={routes.aiAgent}
            className="group flex flex-col items-end transition-all duration-900"
          >
            <div
              className={`transition-colors duration-300 group-hover:text-[#37B478] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Read all insights
            </div>
            <div className="mt-1 h-[2px] w-0 bg-[#37B478] rounded-full transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowWeThink;
