import {Link} from "react-router-dom";
import ReadMoreLink from "../../../../components/ui/ReadMoreLink";
import ResponsiveCarousel from "../../../../components/ui/ResponsiveCarousel";
import {useTheme} from "../../../../context/useTheme";
import {routes} from "../../../../routes";
import {usePointerGlow} from "../../../../hooks/usePointerGlow";
import {liveInsights} from "./data";

function MobileInsightCard({insight, isDarkMode}) {
  return (
    <article
      className={`flex min-h-[520px] flex-col overflow-hidden rounded-[32px] border border-[#37B478] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <img
        loading="lazy"
        src={insight.image}
        alt={insight.imageAlt || ""}
        className="h-56 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3
          className={`font-['Gotham'] text-[clamp(1.25rem,5vw,1.75rem)] font-medium leading-tight ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {insight.title}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`font-['Gotham'] text-sm font-light ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {insight.date}
          </span>
          <span className="font-['Gotham'] text-sm text-[#37B478]">
            {insight.readTime}
          </span>
        </div>
        <p
          className={`font-['Gotham'] text-sm leading-relaxed ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {insight.description}
        </p>
        <ReadMoreLink isDarkMode={isDarkMode} className="mt-auto" />
      </div>
    </article>
  );
}

function LiveInsightsSection() {
  const {isDarkMode} = useTheme();
  const [featuredInsight, topInsight, bottomInsight] = liveInsights.cards;

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
            className={`relative z-10 font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold transition-colors duration-500 ease-in-out ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {liveInsights.title}
          </div>
        </div>

        {/* CONTENT section */}
        <div className="xl:hidden">
          <ResponsiveCarousel
            ariaLabel={liveInsights.title}
            isDarkMode={isDarkMode}
          >
            {liveInsights.cards.map((insight) => (
              <MobileInsightCard
                key={insight.title}
                insight={insight}
                isDarkMode={isDarkMode}
              />
            ))}
          </ResponsiveCarousel>
        </div>

        <div className="relative hidden items-start gap-11 xl:flex">
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
              <img loading="lazy"
                src={featuredInsight.image}
                alt={featuredInsight.imageAlt}
                className="w-full h-96 object-cover"
              />

              <div className="flex min-h-0 w-[500px] flex-1 flex-col justify-center gap-3 px-10 py-7">
                <div
                  className={`text-3xl font-['Gotham'] leading-[1.25] font-medium transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {featuredInsight.title}
                </div>

                <div className="inline-flex items-center gap-8">
                  <div
                    className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {featuredInsight.date}
                  </div>
                  <div className="text-[#37B478] text-base font-['Gotham']">
                    {featuredInsight.readTime}
                  </div>
                </div>

                <div
                  className={`text-base font-['Gotham'] leading-[1.45] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {featuredInsight.description}
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
                <img loading="lazy"
                  src={topInsight.image}
                  alt={topInsight.imageAlt}
                  className="h-full w-[45%] shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch px-5 py-4">
                  <div
                    className={`whitespace-pre-line text-3xl font-medium font-['Gotham'] leading-[1.2] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {topInsight.title}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div
                      className={`text-sm font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {topInsight.date}
                    </div>
                    <div className="text-sm font-['Gotham'] text-[#37B478]">
                      {topInsight.readTime}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-['Gotham'] leading-[1.35] font-extralight transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {topInsight.description}
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
                <img loading="lazy"
                  src={bottomInsight.image}
                  alt={bottomInsight.imageAlt}
                  className="h-full w-[45%] shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch px-5 py-4">
                  <div
                    className={`text-3xl font-medium font-['Gotham'] leading-[1.2] py-1 -translate-y-8 transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {bottomInsight.title}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div
                      className={`text-sm font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {bottomInsight.date}
                    </div>
                    <div className="text-sm font-['Gotham'] text-[#37B478]">
                      {bottomInsight.readTime}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-['Gotham'] leading-[1.35] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {bottomInsight.description}
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
            to={routes.archives}
            className="group flex flex-col items-end transition-all duration-900"
          >
            <div
              className={`transition-colors duration-300 group-hover:text-[#37B478] ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {liveInsights.ctaLabel}
            </div>
            <div className="mt-1 h-[2px] w-0 bg-[#37B478] rounded-full transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LiveInsightsSection;
