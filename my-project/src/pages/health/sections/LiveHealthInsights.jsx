import {useState} from "react";
import {useTheme} from "../../../context/useTheme";
import healthInsightLeft from "../../../assets/images/industries/health1.png";
import healthInsightTop from "../../../assets/images/industries/health2.png";
import healthInsightBottom from "../../../assets/images/industries/health3.png";
import insightExcludeImage from "../../../assets/icons/InsightExclude.png";
import insightExcludeBlackImage from "../../../assets/icons/InsightExcludeBlack.png";

function LiveHealthInsights() {
  const {isDarkMode} = useTheme();
  const insightExclude = isDarkMode
    ? insightExcludeImage
    : insightExcludeBlackImage;

  /* For first card (left side) */
  const [pos1, setPos1] = useState({x: 0, y: 0, active: false});
  /* For second card (right - top) */
  const [pos2, setPos2] = useState({x: 0, y: 0, active: false});
  /* For third card (right - bottom) */
  const [pos3, setPos3] = useState({x: 0, y: 0, active: false});

  const handleMouseMove1 = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos1({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave1 = () => {
    setPos1((p) => ({...p, active: false}));
  };

  const handleMouseMove2 = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos2({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave2 = () => {
    setPos2((p) => ({...p, active: false}));
  };

  const handleMouseMove3 = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos3({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave3 = () => {
    setPos3((p) => ({...p, active: false}));
  };

  return (
    <section
      className={`w-full px-28 py-14 overflow-hidden relative transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <img
        src={insightExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-300px] top-[180px] z-0 max-w-none"
        style={{
          width: "2147.087px",
          height: "2851.58px",
          transform: "rotate(73.001deg)",
          transformOrigin: "top left",
        }}
      />
      <div className="flex flex-col gap-8 relative z-10">
        {/* TITLE section */}
        <div className="relative inline-flex items-center gap-3.5">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <div
            className={`relative z-10 text-4xl font-bold font-['Gotham'] transition-colors duration-500 ease-in-out ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            LIVE HEALTH INSIGHTS
          </div>
        </div>

        {/* CONTENT section */}
        <div className="flex items-start gap-11 relative">
          {/* LEFT BIG CARD with its own neon glow */}
          <div className="relative">
            {/* 🌟 NEON GLOW BEHIND LEFT CARD */}
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
              onMouseMove={handleMouseMove1}
              onMouseLeave={handleMouseLeave1}
            >
              <img
                src={healthInsightLeft}
                alt="Live health insights"
                className="w-full h-96 object-cover"
              />

              <div className="w-[500px] flex-1 px-10 py-8 flex flex-col gap-3">
                <div
                  className={`text-2xl font-bold font-['Gotham'] leading-tight transition-colors duration-500 ease-in-out ${
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
                    June 4, 2026
                  </div>
                  <div className="text-[#37B478] text-base font-['Gotham']">
                    2 minutes read
                  </div>
                </div>

                <div
                  className={`text-base font-['Gotham'] leading-[1.4] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Inventions combining AI and biotechnology have grown
                  significantly in recent years. Specifically, the number of
                  inventions in this field has increased twelvefold over the
                  past 20 years, far outpacing the general growth rate across
                  all other technology sectors.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 h-[702px] flex flex-col justify-center gap-8">
            {/* CARD 1 (right - top) with its own neon glow */}
            <div className="relative h-[335px]">
              {/* 🌟 NEON GLOW BEHIND RIGHT CARD 1 */}
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
                className={`w-full h-[335px] rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                onMouseMove={handleMouseMove2}
                onMouseLeave={handleMouseLeave2}
              >
                <img
                  src={healthInsightTop}
                  className="w-[55%] h-[335px] self-start object-cover"
                />
                <div className="min-w-0 flex-1 min-h-60 px-6 py-6 flex flex-col justify-center gap-3">
                  <div
                    className={`text-2xl font-bold font-['Gotham'] leading-tight transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Mental Health Diagnostics Using Audio Data
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      November 15, 2025
                    </div>
                    <div className="text-[#37B478] text-base font-['Gotham']">
                      2 minutes read
                    </div>
                  </div>
                  <div
                    className={`text-base font-['Gotham'] leading-[1.4] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    AI-Powered Audio Analysis utilizes artificial intelligence
                    to analyze vocal patterns, speech cadence, and tone from
                    patient interactions to identify potential mental health
                    conditions.
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 (right - bottom) with its own neon glow */}
            <div className="relative h-[335px]">
              {/* 🌟 NEON GLOW BEHIND RIGHT CARD 2 */}
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
                className={`w-full h-[335px] rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                onMouseMove={handleMouseMove3}
                onMouseLeave={handleMouseLeave3}
              >
                <img
                  src={healthInsightBottom}
                  className="w-[55%] h-[335px] self-start object-cover"
                />
                <div className="min-w-0 flex-1 min-h-60 px-6 py-6 flex flex-col justify-center gap-3">
                  <div
                    className={`text-2xl font-bold font-['Gotham'] leading-tight transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Probiotics
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      June 4, 2026
                    </div>
                    <div className="text-[#37B478] text-base font-['Gotham']">
                      2 minutes read
                    </div>
                  </div>
                  <div
                    className={`text-base font-['Gotham'] leading-[1.4] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    China leads globally in patent registrations, demonstrating
                    a remarkable volume of patents registered each year in the
                    Probiotics sector.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-end">
          <button className="group flex flex-col items-end transition-all duration-900">
            <div
              className={`transition-colors duration-300 group-hover:text-[#37B478] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Read all insights
            </div>
            <div className="mt-1 h-[2px] w-0 bg-[#37B478] rounded-full transition-all duration-300 group-hover:w-full" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default LiveHealthInsights;
