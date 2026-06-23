import {useEffect, useRef, useState} from "react";

const countDuration = 1000;

function useCountUp(target, isActive) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return undefined;

    let frameId;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / countDuration, 1);
      setCount(Math.round(target * progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      }
    };

    frameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameId);
  }, [isActive, target]);

  return count;
}

function StatCard({stat, isVisible, isDarkMode}) {
  const count = useCountUp(stat.value, isVisible);
  const labelColor = isDarkMode ? "text-white" : "text-black";
  const lightIconFilter =
    "[filter:brightness(0)_saturate(100%)_invert(56%)_sepia(51%)_saturate(599%)_hue-rotate(96deg)_brightness(94%)_contrast(88%)]";

  return (
    <div
      className={`group relative flex h-40 min-w-0 flex-col items-center justify-center rounded-[28px] bg-[#37B478]/0 p-4 text-center transition-all duration-1000 ease-out hover:-translate-y-2 hover:bg-[#37B478] hover:shadow-[0_18px_45px_-24px_rgba(55,180,120,0.9)] sm:h-44 sm:p-5 ${
        isVisible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-7 opacity-0 blur-sm"
      }`}
    >
      <img loading="lazy"
        src={stat.icon}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105 sm:h-36 ${
          isDarkMode ? "opacity-90" : "opacity-15 group-hover:opacity-90"
        } ${
          isDarkMode ? "" : `${lightIconFilter} group-hover:[filter:none]`
        }`}
      />
      <div className="relative z-10 mt-8 font-['Gotham'] text-2xl font-bold leading-none text-[#37B478] transition-colors duration-300 group-hover:text-white sm:text-3xl">
        +{count}
      </div>
      <div className={`relative z-10 mt-1 font-['Gotham'] text-xs font-bold transition-colors duration-300 group-hover:text-white sm:text-sm ${labelColor}`}>
        {stat.label}
      </div>
    </div>
  );
}

function StatsSection({stats, isDarkMode}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      {threshold: 0.35},
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-24 md:px-16 xl:px-[120px]"
    >
      <div className="mx-auto grid w-full max-w-[720px] grid-cols-2 items-stretch gap-4 md:max-w-[1600px] xl:flex xl:items-center xl:justify-between">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            isVisible={isVisible}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
