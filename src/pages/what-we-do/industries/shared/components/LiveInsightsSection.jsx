import ReadMoreLink from "../../../../../components/ui/ReadMoreLink";
import ResponsiveCarousel from "../../../../../components/ui/ResponsiveCarousel";
import {useTheme} from "../../../../../context/useTheme";
import insightExcludeImage from "../../../../../assets/images/excludes/live-insights/InsightExclude.webp";
import insightExcludeBlackImage from "../../../../../assets/images/excludes/live-insights/InsightExcludeBlack.webp";
import {routes} from "../../../../../routes";
import SectionTitle from "../../../../../components/ui/SectionTitle";
import {usePointerGlow} from "../../../../../hooks/usePointerGlow";

function GlowCard({children, className = "", isDarkMode}) {
  const {position, handlers} = usePointerGlow();

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
        {...handlers}
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
      className={`flex min-h-0 min-w-0 flex-1 flex-col ${
        compact
          ? card.compactTight
            ? "h-full gap-1 p-4"
            : "h-full gap-2 p-6"
          : "w-full gap-4 p-9"
      }`}
    >
      <h3
        className={`font-['Gotham'] leading-tight transition-colors duration-500 ease-in-out ${textColor} ${
          compact ? "text-base sm:text-lg md:text-xl font-medium" : "text-base sm:text-lg md:text-xl font-bold"
        } break-words whitespace-normal`}
      >
        {card.title}
      </h3>
      <div
        className={`${
          compact
            ? "flex flex-col items-start gap-2"
            : "inline-flex flex-wrap items-center gap-4"
        }`}
      >
        <p
          className={`font-['Gotham'] text-[10px] sm:text-xs md:text-sm lg:text-sm font-light transition-colors duration-500 ease-in-out ${textColor}`}
        >
          {card.date}
        </p>
        <p className="font-['Gotham'] text-[10px] sm:text-xs md:text-sm lg:text-sm text-[#37B478]">
          {card.readTime}
        </p>
      </div>
      <p
        className={`font-['Gotham'] text-[10px] sm:text-xs md:text-sm lg:text-sm transition-colors duration-500 ease-in-out ${textColor} ${
          compact ? "leading-[1.3]" : "leading-[1.4]"
        } break-words whitespace-normal`}
      >
        {card.description}
      </p>
      <ReadMoreLink
        isDarkMode={isDarkMode}
        className="mt-auto shrink-0 text-[10px] sm:text-[11px] md:text-sm"
      />
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
const renderCarouselCard = (card) => (
    <GlowCard
      key={card.id}
      // تغییر ارتفاع به h-full برای تبعیت از ارتفاع کل اسلایدر
      className="h-full" 
      isDarkMode={isDarkMode}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="h-48 w-full shrink-0 overflow-hidden sm:h-60 "> 
          {/* کمی ارتفاع تصویر را در موبایل کمتر کردیم تا فضای بیشتری به متن برسد */}
          <img
            loading="lazy"
            src={card.image}
            alt={card === featuredCard ? alt : ""}
            aria-hidden={card === featuredCard ? undefined : true}
            className={`size-full object-cover ${card.imageClassName ?? ""}`}
          />
        </div>
        <CardCopy card={card} isDarkMode={isDarkMode} />
      </div>
    </GlowCard>
  );

  return (
    <section
      className={`relative w-full overflow-hidden px-6 py-14 transition-colors duration-500 ease-in-out md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <img loading="lazy"
        src={insightExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-330px] top-[75px] z-0 max-w-none"
        style={{width: "2147.087px", height: "2851.58px"}}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-8">
        <SectionTitle textClassName={`transition-colors duration-500 ease-in-out ${textColor}`}>
          {title}
        </SectionTitle>

        <div className="lg:hidden">
          <ResponsiveCarousel ariaLabel={title} isDarkMode={isDarkMode}>
            {cards.map(renderCarouselCard)}
          </ResponsiveCarousel>
        </div>

        <div className="relative hidden w-full grid-cols-1 items-start gap-9 lg:grid lg:grid-cols-2">
          <GlowCard className="h-[702px] min-w-0" isDarkMode={isDarkMode}>
            <div className="flex size-full flex-col">
              <div className="min-h-0 flex-1 overflow-hidden">
                <img loading="lazy"
                  src={featuredCard.image}
                  alt={alt}
                  className={`size-full object-cover object-bottom   ${
                    featuredCard.imageClassName ?? ""
                  }`}
                />
              </div>
              <CardCopy card={featuredCard} isDarkMode={isDarkMode} />
            </div>
          </GlowCard>

          <div className="flex min-w-0 flex-col justify-center gap-9 md:h-[702px]">
            {[topCard, bottomCard].map((card) => (
              <GlowCard
                key={card.id}
                className="h-[702px] min-h-0 md:h-auto md:flex-1"
                isDarkMode={isDarkMode}
              >
                <div className="flex size-full min-w-0 flex-col items-center md:grid md:grid-cols-2">
                  <div className="h-1/2 w-full min-w-0 overflow-hidden md:size-full">
                    <img loading="lazy"
                      src={card.image}
                      alt=""
                      aria-hidden
                      className={`size-full object-cover ${
                        card.imageClassName ?? ""
                      }`}
                    />
                  </div>
                  <CardCopy card={card} isDarkMode={isDarkMode} compact />
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <ReadMoreLink
            to={routes.archives}
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
