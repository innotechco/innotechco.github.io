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
  const normalTextColor = isDarkMode ? "text-white" : "text-black";

  return (
    <article
      className={`group relative flex h-40 w-full min-w-0 items-center justify-center overflow-hidden rounded-[26px] p-3 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-[#37B478] hover:shadow-[0_18px_42px_-20px_rgba(55,180,120,0.72)] sm:h-44 sm:p-4 xl:w-[250px] ${
        isVisible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-7 opacity-0 blur-sm"
      }`}
    >
      <div className="relative flex size-32 items-center justify-center sm:size-36">
        <img
          loading="lazy"
          src={stat.icon}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-65"
        />
        <div className="relative z-10 flex max-w-28 flex-col items-center text-center">
          <div className="font-['Gotham'] text-2xl font-bold leading-none text-[#37B478] transition-colors duration-300 group-hover:text-white sm:text-3xl">
            +{count}
          </div>
          <div className={`mt-1 font-['Gotham'] text-xs font-bold leading-tight transition-colors duration-300 group-hover:text-white sm:text-sm ${normalTextColor}`}>
            {stat.label}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatsSection({stats, isDarkMode}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationRun, setAnimationRun] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationRun((current) => current + 1);
        } else {
          setIsVisible(false);
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
      className="relative px-6 py-24 md:px-16 xl:px-[120px]"
    >
      <div className="mx-auto grid w-full max-w-[720px] grid-cols-2 items-stretch gap-4 md:max-w-[1600px] xl:flex xl:items-center xl:justify-between">
        {stats.map((stat) => (
          <StatCard
            key={`${stat.id}-${animationRun}`}
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
