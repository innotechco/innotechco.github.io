import {useEffect, useRef, useState} from "react";

import roadLine from "../../../../../assets/icons/Vector2.svg";
import {useTheme} from "../../../../../context/useTheme";

const positions = [
  {x: 174, y: 228},
  {x: 353, y: 130},
  {x: 583, y: 7},
  {x: 788, y: 130},
  {x: 971, y: 228},
];

const LINE_REVEAL_DELAY = 300;
const LINE_REVEAL_DURATION = 1800;
const STEP_DURATION = 1400;
const COMPLETED_HOLD_DURATION = 3000;
const RESET_HOLD_DURATION = 1200;

function ServiceRoad({title, items}) {
  const {isDarkMode} = useTheme();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(-1);
  const activeLineVisible = isInView && lineVisible;
  const activeAnimationPhase = isInView ? animationPhase : -1;

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          return;
        }

        setIsInView(false);
        setLineVisible(false);
        setAnimationPhase(-1);
      },
      {threshold: 0.35},
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return undefined;

    const timers = [];
    const addTimer = (callback, delay) => {
      timers.push(setTimeout(callback, delay));
    };

    const runCircleSequence = () => {
      items.forEach((_, index) => {
        addTimer(() => setAnimationPhase(index), index * STEP_DURATION);
      });
      addTimer(() => setAnimationPhase(items.length), items.length * STEP_DURATION);
      addTimer(
        () => setAnimationPhase(items.length + 1),
        items.length * STEP_DURATION + COMPLETED_HOLD_DURATION,
      );
      addTimer(
        runCircleSequence,
        items.length * STEP_DURATION +
          COMPLETED_HOLD_DURATION +
          RESET_HOLD_DURATION,
      );
    };

    addTimer(() => setLineVisible(true), LINE_REVEAL_DELAY);
    addTimer(runCircleSequence, LINE_REVEAL_DELAY + LINE_REVEAL_DURATION + 150);

    return () => timers.forEach(clearTimeout);
  }, [isInView, items]);

  return (
    <section
      ref={sectionRef}
      className={`w-full overflow-hidden px-4 pb-28 pt-32 sm:px-6 md:px-16 md:pb-[180px] md:pt-[220px] xl:px-[120px] ${pageBg}`}
    >
      <style>
        {`
          @keyframes roadTextLift {
            0% { transform: translate(-50%, 18px); opacity: 0; }
            55% { transform: translate(-50%, -10px); opacity: 1; }
            100% { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
      </style>

      <div className="flex flex-col items-center gap-12">
        <h2 className={`${textColor} text-center font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold`}>
          {title}
        </h2>

        <div className="w-full overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative h-[360px] w-[1166px] shrink-0">
            <div
              className={`absolute left-[1px] top-[4px] overflow-hidden transition-all duration-[1800ms] ease-out ${
                activeLineVisible ? "w-[1164px]" : "w-0"
              }`}
            >
              <img loading="lazy"
                src={roadLine}
                alt=""
                aria-hidden
                className="w-[1164px] max-w-none select-none"
              />
            </div>

          {items.map((item, index) => {
            const isCompletedPhase = activeAnimationPhase === items.length;
            const isBlankLoopPhase = activeAnimationPhase === items.length + 1;
            const isVisible = isCompletedPhase || activeAnimationPhase >= index;
            const isFilled =
              isCompletedPhase ||
              (!isBlankLoopPhase && activeAnimationPhase >= index);
            const isActive =
              !isCompletedPhase &&
              !isBlankLoopPhase &&
              activeAnimationPhase === index;
            const isTextVisible =
              !isBlankLoopPhase && activeAnimationPhase >= index;
            const position = positions[index];

            return (
              <div
                key={`${item.title}-${index}`}
                className={`absolute transition-opacity duration-500 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`mx-auto size-6 rounded-full border-2 border-[#37B478] transition-all duration-500 ${
                    isFilled
                      ? "scale-100 bg-[#37B478]"
                      : isVisible
                        ? "scale-110 bg-transparent"
                        : "scale-75 bg-transparent"
                  }`}
                />

                <div
                  className={`absolute left-1/2 top-14 flex w-48 flex-col items-center text-center transition-opacity duration-300 ease-out ${
                    isTextVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transform: "translateX(-50%)",
                    animation: isActive
                      ? "roadTextLift 1400ms ease-in-out both"
                      : undefined,
                  }}
                >
                  <h3
                    className={`${textColor} text-center font-['Gotham'] text-xl leading-tight ${
                      item.bold ? "font-bold" : "font-normal"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle ? (
                    <p className={`${textColor} text-center font-['Gotham'] text-base font-normal leading-tight`}>
                      {item.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceRoad;
