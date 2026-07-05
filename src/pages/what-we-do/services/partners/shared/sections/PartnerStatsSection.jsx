import {useEffect, useRef, useState} from "react";

function StatCard({assets, isDarkMode, isVisible, stat}) {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const hasPartnerExclude = Boolean(assets.excludeDark && assets.excludeLight);
  const iconFilter = isDarkMode
    ? "opacity-20 group-hover:opacity-70"
    : "opacity-15 group-hover:opacity-65 [filter:brightness(0)_saturate(100%)_invert(56%)_sepia(51%)_saturate(599%)_hue-rotate(96deg)_brightness(94%)_contrast(88%)]";

  return (
    <article
      className={`group relative flex min-h-[190px] min-w-0 items-center justify-center rounded-[32px] p-4 transition-all duration-1000 ease-out hover:-translate-y-2 hover:bg-[#37B478] hover:shadow-[0_18px_45px_-24px_rgba(55,180,120,0.9)] ${
        isVisible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-7 opacity-0 blur-sm"
      }`}
    >
      <div
        className={`absolute left-1/2 top-1/2 size-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
          isDarkMode ? "bg-neutral-900" : "bg-neutral-100"
        }`}
      />
      <img
        loading="lazy"
        src={assets.circleIcon}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 size-[150px] -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-300 group-hover:scale-105 group-hover:[filter:none] ${iconFilter}`}
      />
      {hasPartnerExclude ? null : (
        <span className="absolute bottom-8 left-1/2 size-2 -translate-x-[67px] rounded-full bg-[#37B478] transition-colors duration-300 group-hover:bg-white" />
      )}
      <div className="relative z-10 flex w-[124px] flex-col items-center gap-1 text-center">
        <div className="font-['Gotham'] text-3xl font-bold leading-none text-[#37B478] transition-colors duration-300 group-hover:text-white">
          {stat.value}
        </div>
        <p
          className={`font-['Gotham'] text-sm font-bold leading-tight transition-colors duration-300 group-hover:text-white md:text-[15px] ${textColor}`}
        >
          {stat.label}
        </p>
      </div>
    </article>
  );
}

function PartnerStatsSection({assets, content, isDarkMode}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const partnerExclude = isDarkMode ? assets.excludeDark : assets.excludeLight;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.3},
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-visible px-6 py-16 md:px-16 md:py-[60px] xl:px-[120px]"
    >
      {partnerExclude ? (
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 flex w-screen -translate-x-1/2 items-center justify-center">
          <img
            aria-hidden
            src={partnerExclude}
            alt=""
            className="max-h-[890px] w-full max-w-[1600px] translate-y-72 object-fill object-center md:translate-y-64 xl:translate-y-55 -translate-x-1"
          />
        </div>
      ) : (
        <>
          <div
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-[-520px] z-0 h-[900px] w-[1800px] -translate-x-1/2 rounded-[50%] border-[34px] ${
              isDarkMode ? "border-white" : "border-black"
            }`}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-16 top-8 z-0 size-9 rounded-full bg-[#37B478] shadow-[0_0_32px_rgba(55,180,120,0.65)] md:left-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[calc(120px+36px)] top-[25px] z-0 hidden h-px w-[calc(100%-260px)] bg-[#37B478] md:block"
          />
        </>
      )}
      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-4 md:gap-8 xl:grid-cols-4">
        {content.stats.map((stat) => (
          <StatCard
            key={stat.id}
            assets={assets}
            isDarkMode={isDarkMode}
            isVisible={isVisible}
            stat={stat}
          />
        ))}
      </div>
    </section>
  );
}

export default PartnerStatsSection;
