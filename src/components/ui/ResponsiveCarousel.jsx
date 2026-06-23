import {useCallback, useEffect, useRef, useState} from "react";

function ResponsiveCarousel({
  ariaLabel,
  children,
  className = "",
  controlsClassName = "",
  isDarkMode,
}) {
  const trackRef = useRef(null);
  const dragRef = useRef({active: false, startX: 0, scrollLeft: 0});
  const [activeIndex, setActiveIndex] = useState(0);
  const items = Array.isArray(children) ? children : [children];

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstSlide = track.querySelector("[data-carousel-slide]");
    if (!firstSlide) return;

    const style = window.getComputedStyle(track);
    const gap = Number.parseFloat(style.columnGap || style.gap || "0");
    const slideWidth = firstSlide.getBoundingClientRect().width + gap;

    setActiveIndex(
      Math.max(0, Math.min(items.length - 1, Math.round(track.scrollLeft / slideWidth))),
    );
  }, [items.length]);

  const scrollToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;

      const slide = track.querySelectorAll("[data-carousel-slide]")[index];
      if (!slide) return;

      track.scrollTo({left: slide.offsetLeft - track.offsetLeft, behavior: "smooth"});
      setActiveIndex(index);
    },
    [],
  );

  const move = (direction) => {
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    scrollToIndex(nextIndex);
  };

  const handlePointerDown = (event) => {
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
    };
    track.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;

    track.scrollLeft =
      dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };

  const stopDrag = (event) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;

    dragRef.current.active = false;
    track.releasePointerCapture?.(event.pointerId);
    updateActiveIndex();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, {passive: true});
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  const buttonClassName = `flex size-11 items-center justify-center rounded-full border backdrop-blur-md transition hover:border-[#37B478] hover:text-[#37B478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37B478] ${
    isDarkMode
      ? "border-white/20 bg-white/10 text-white"
      : "border-black/15 bg-white/70 text-black"
  }`;

  return (
    <div className={`w-full ${className}`} aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
      >
        {items.map((child, index) => (
          <div
            key={index}
            data-carousel-slide
            className="min-w-full snap-center"
          >
            {child}
          </div>
        ))}
      </div>

      <div
        className={`mt-5 flex items-center justify-center gap-4 ${controlsClassName}`}
      >
        <button
          type="button"
          className={buttonClassName}
          onClick={() => move(-1)}
          aria-label="Previous card"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            ‹
          </span>
        </button>

        <div className="flex items-center gap-2" aria-hidden="true">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index ? "w-8 bg-[#37B478]" : "w-3 bg-[#37B478]/35"
              }`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={buttonClassName}
          onClick={() => move(1)}
          aria-label="Next card"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            ›
          </span>
        </button>
      </div>
    </div>
  );
}

export default ResponsiveCarousel;
