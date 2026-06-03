import {useEffect, useRef, useState} from "react";
import {useTheme} from "../../../../../context/useTheme";
import roadLine from "../../../../../assets/icons/vector2.svg";

const modules = [
  {
    title: "Module 1",
    subtitle: "Maturity Assessment",
    position: {x: 174, y: 228},
  },
  {
    title: "Module 2",
    subtitle: "Process Design",
    position: {x: 353, y: 124},
  },
  {
    title: "Module 3",
    subtitle: "Innovation OS Enablement",
    position: {x: 583, y: 7},
  },
  {
    title: "Module 4",
    subtitle: "Tech Monitoring",
    position: {x: 788, y: 124},
  },
  {
    title: "Innovation Management System",
    subtitle: "",
    position: {x: 971, y: 228},
  },
];

const LINE_REVEAL_DELAY = 300;
const LINE_REVEAL_DURATION = 1800;
const STEP_DURATION = 1400;
const COMPLETED_HOLD_DURATION = 3000;
const RESET_HOLD_DURATION = 1200;

function InceptionRoad() {
  const {isDarkMode} = useTheme();

  const sectionRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(-1);

  const pageBg = isDarkMode ? "bg-black" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  // Start animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      {
        threshold: 0.35,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Animation sequence
  useEffect(() => {
    if (!hasStarted) return;

    const timers = [];
    const addTimer = (callback, delay) => {
      const timer = setTimeout(callback, delay);
      timers.push(timer);
    };

    const runCircleSequence = () => {
      modules.forEach((_, index) => {
        addTimer(() => setAnimationPhase(index), index * STEP_DURATION);
      });

      addTimer(() => setAnimationPhase(modules.length), modules.length * STEP_DURATION);

      addTimer(
        () => setAnimationPhase(modules.length + 1),
        modules.length * STEP_DURATION + COMPLETED_HOLD_DURATION,
      );

      addTimer(
        runCircleSequence,
        modules.length * STEP_DURATION +
          COMPLETED_HOLD_DURATION +
          RESET_HOLD_DURATION,
      );
    };

    addTimer(() => {
      setLineVisible(true);
    }, LINE_REVEAL_DELAY);

    addTimer(
      runCircleSequence,
      LINE_REVEAL_DELAY + LINE_REVEAL_DURATION + 150,
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [hasStarted]);

  return (
    <section
      ref={sectionRef}
      className={`w-full px-[120px] py-[60px] ${pageBg}`}
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
      <div className="flex flex-col items-start gap-8">
        {/* Title */}
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className={`${textColor} font-['Gotham'] text-4xl font-normal`}>
            Inception Road
          </h2>
        </div>

        {/* Road */}
        <div className="relative h-[320px] w-full">
          <div className="relative mx-auto h-full max-w-[1166px]">
            {/* Road line reveal */}
            <div
              className={`absolute left-[1px] top-[4px] overflow-hidden transition-all duration-[1800ms] ease-out ${
                lineVisible ? "w-[1164px]" : "w-0"
              }`}
            >
              <img
                src={roadLine}
                alt=""
                aria-hidden
                className="w-[1164px] max-w-none select-none"
              />
            </div>

            {/* Modules */}
            {modules.map((module, index) => {
              const isResetPhase = animationPhase === modules.length;
              const isCompletedPhase = animationPhase === modules.length;
              const isBlankLoopPhase = animationPhase === modules.length + 1;
              const isVisible =
                isResetPhase || isCompletedPhase || animationPhase >= index;
              const isFilled =
                isCompletedPhase ||
                (!isBlankLoopPhase && animationPhase >= index);
              const isActive =
                !isCompletedPhase &&
                !isBlankLoopPhase &&
                animationPhase === index;
              const isTextVisible =
                !isBlankLoopPhase && animationPhase >= index;

              return (
                <div
                  key={module.title}
                  className={`absolute ${
                    isVisible ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-500`}
                  style={{
                    left: `${module.position.x}px`,
                    top: `${module.position.y}px`,
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
                      className={`${textColor} text-center font-['Gotham'] text-xl font-normal leading-tight`}
                    >
                      {module.title}
                    </h3>

                    {module.subtitle ? (
                      <p
                        className={`${textColor} text-center font-['Gotham'] text-base leading-tight`}
                      >
                        {module.subtitle}
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

export default InceptionRoad;
