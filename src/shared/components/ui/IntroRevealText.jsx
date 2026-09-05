import {useEffect, useState} from "react";

const phaseTimers = {
  heading: {start: 40, done: 820},
  copy: {start: 620, done: 1250},
};

function IntroRevealText({as: Component = "p", children, className = "", variant}) {
  const [phase, setPhase] = useState("hidden");

  useEffect(() => {
    const timing = phaseTimers[variant] ?? phaseTimers.copy;
    const startTimer = setTimeout(() => setPhase("visible"), timing.start);
    const doneTimer = setTimeout(() => setPhase("done"), timing.done);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(doneTimer);
    };
  }, [variant]);

  return (
    <Component
      className={`intro-reveal intro-reveal--${variant} intro-reveal--${phase} ${className}`}
    >
      {children}
    </Component>
  );
}

export default IntroRevealText;
