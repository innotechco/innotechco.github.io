import {useEffect, useRef} from "react";

function ScrollProgress() {
  const fillRef = useRef(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0
        ? Math.min(1, Math.max(0, scrollTop / docHeight))
        : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const scheduleUpdate = () => {
      if (!frameId) frameId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    window.addEventListener("resize", scheduleUpdate, {passive: true});

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="article-scroll-progress" aria-hidden="true">
      <div ref={fillRef} className="article-scroll-progress__fill" />
    </div>
  );
}

export default ScrollProgress;
