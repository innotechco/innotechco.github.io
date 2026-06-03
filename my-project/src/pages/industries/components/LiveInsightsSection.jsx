import {useState} from "react";

import ReadMoreLink from "../../../components/ui/ReadMoreLink";
import {useTheme} from "../../../context/useTheme";
import insightExcludeImage from "../../../assets/images/excludes/insights/InsightExclude.png";
import insightExcludeBlackImage from "../../../assets/images/excludes/insights/InsightExcludeBlack.png";
import {routes} from "../../../routes";

function GlowCard({children, className = "", isDarkMode}) {
  const [position, setPosition] = useState({x: 0, y: 0, active: false});

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-[50px] transition-opacity duration-300"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />
      <article
        onMouseMove={handleMouseMove}
        onMouseLeave={() =>
          setPosition((current) => ({...current, active: false}))
        }
        className={`relative z-10 size-full overflow-hidden rounded-[50px] border border-[#37B478] transition-colors duration-500 ease-in-out ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        {children}
      </article>
    </div>
  );
}

function CardCopy({card, isDarkMode, compact = false}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center gap-3 ${
        compact ? "min-h-60 px-6 py-6" : "w-[500px] px-10 py-8"
      }`}
    >
      <h3
        className={`font-['Gotham'] text-2xl font-bold leading-tight transition-colors duration-500 ease-in-out ${textColor}`}
      >
        {card.title}
      </h3>
      <div
        className={`${
          compact ? "flex items-center justify-between" : "inline-flex items-center gap-8"
        }`}
      >
        <p
          className={`font-['Gotham'] text-base font-light transition-colors duration-500 ease-in-out ${textColor}`}
        >
          {card.date}
        </p>
        <p className="font-['Gotham'] text-base text-[#37B478]">
          {card.readTime}
        </p>
      </div>
      <p
        className={`font-['Gotham'] text-base leading-[1.4] transition-colors duration-500 ease-in-out ${textColor}`}
      >
        {card.description}
      </p>
      <ReadMoreLink isDarkMode={isDarkMode} className="mt-1 text-base" />
    </div>
  );
}

function LiveInsightsSection({title, cards, alt}) {
  const {isDarkMode} = useTheme();
  const insightExclude = isDarkMode
    ? insightExcludeImage
    : insightExcludeBlackImage;
  const textColor = isDarkMode ? "text-white" : "text-black";
  const [featuredCard, topCard, bottomCard] = cards;

  return (
    <section
      className={`relative w-full overflow-hidden px-6 py-14 transition-colors duration-500 ease-in-out md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <img
        src={insightExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-330px] top-[75px] z-0 max-w-none"
        style={{width: "2147.087px", height: "2851.58px"}}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-8">
        <div className="relative inline-flex items-center gap-3.5">
          <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
          <h2
            className={`relative z-10 font-['Gotham'] text-4xl font-bold transition-colors duration-500 ease-in-out ${textColor}`}
          >
            {title}
          </h2>
        </div>

        <div className="relative flex items-start gap-11">
          <GlowCard className="h-[702px] w-[542px]" isDarkMode={isDarkMode}>
            <div className="flex size-full flex-col">
              <img
                src={featuredCard.image}
                alt={alt}
                className="h-96 w-full object-cover"
              />
              <CardCopy card={featuredCard} isDarkMode={isDarkMode} />
            </div>
          </GlowCard>

          <div className="flex h-[702px] flex-1 flex-col justify-center gap-8">
            {[topCard, bottomCard].map((card) => (
              <GlowCard
                key={card.id}
                className="h-[335px]"
                isDarkMode={isDarkMode}
              >
                <div className="flex size-full items-center">
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden
                    className="h-[335px] w-[55%] self-start object-cover"
                  />
                  <CardCopy card={card} isDarkMode={isDarkMode} compact />
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <ReadMoreLink
            to={routes.aiAgent}
            label="Read all insights"
            isDarkMode={isDarkMode}
            align="end"
            className="duration-900"
          />
        </div>
      </div>
    </section>
  );
}

export default LiveInsightsSection;
