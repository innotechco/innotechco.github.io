import {useState} from "react";
import {useTheme} from "../../../context/useTheme";
import techInsightLeft from "../../../assets/images/industries/hightech1.png";
import techInsightTop from "../../../assets/images/industries/hightech2.png";
import techInsightBottom from "../../../assets/images/industries/hightech3.png";

function LiveTechInsights() {
  const {isDarkMode} = useTheme();

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
      <div className="flex flex-col gap-8 relative z-10">
        {/* TITLE section */}
        <div className="relative inline-flex items-center gap-3.5">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <div
            className={`relative z-10 text-4xl font-normal font-['Gotham'] transition-colors duration-500 ease-in-out ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            LIVE TECH INSIGHTS
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
                src={techInsightLeft}
                alt="Live tech insights"
                className="w-full h-96 object-cover"
              />

              <div className="w-[500px] h-60 px-10 pt-8 flex flex-col gap-4">
                <div
                  className={`text-2xl font-['Gotham'] leading-[1.25] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  AI infrastructure races from experimentation to scale
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
                  High-tech companies are rethinking compute, data, and product strategy as AI moves deeper into customer and enterprise workflows.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 h-[702px] flex flex-col justify-center gap-8">
            {/* CARD 1 (right - top) with its own neon glow */}
            <div className="relative flex-1">
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
                className={`w-full h-full rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                onMouseMove={handleMouseMove2}
                onMouseLeave={handleMouseLeave2}
              >
                <img
                  src={techInsightTop}
                  className="w-[55%] h-full object-cover"
                />
                <div className="w-80 h-60 px-6 flex flex-col gap-4">
                  <div
                    className={`text-2xl font-['Gotham'] leading-[1.2] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Platform shifts create new software growth paths
                  </div>
                  <div className="flex justify-between items-center">
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
                    Product teams are tracking adoption signals across cloud, automation, cybersecurity, and developer ecosystems.
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 (right - bottom) with its own neon glow */}
            <div className="relative flex-1">
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
                className={`w-full h-full rounded-[50px] border border-[#37B478] overflow-hidden flex items-center transition-colors duration-500 ease-in-out relative z-10 ${
                  isDarkMode ? "bg-black" : "bg-white"
                }`}
                onMouseMove={handleMouseMove3}
                onMouseLeave={handleMouseLeave3}
              >
                <img
                  src={techInsightBottom}
                  className="w-[55%] h-full object-cover"
                />
                <div className="w-80 h-60 px-6 flex flex-col gap-4">
                  <div
                    className={`text-2xl font-['Gotham'] leading-[1.2] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Semiconductor strategy turns more regional
                  </div>
                  <div className="flex justify-between items-center">
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
                    Supply chain resilience, advanced packaging, and capacity planning are shaping the next wave of technology leadership.
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

export default LiveTechInsights;
