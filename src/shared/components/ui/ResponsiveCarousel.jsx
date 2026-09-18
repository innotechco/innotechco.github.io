import {useCallback, useEffect, useRef, useState} from "react";
import {t} from "../../i18n/ui.js";
import useCarousel from "../../hooks/useCarousel.js";

/* Two ways of moving a row of cards, behind one component.
 *
 * "scroll" is the original: a scroll-snap track, moved by the browser. Every
 * section that was using this carousel before keeps it.
 *
 * "travel" is what INLEARN's New Event card does - a transform on the track,
 * with a wide empty road between the cards, taken slowly enough that one card
 * is gone before the next one arrives. See useCarousel for the gesture rules
 * both variants would like to have and only this one does. */

/* The empty road between two cards, as a share of the card's own width, and the
   same number the travel below is calculated from. A percentage so the distance
   keeps its proportion at every width. */
const TRAVEL_GAP = "34%";

function CarouselControls({
  count,
  activeIndex,
  isDarkMode,
  onPrevious,
  onNext,
  onGoTo,
  className = "",
}) {
  const buttonClassName = `flex size-11 items-center justify-center rounded-full border backdrop-blur-md transition hover:border-[#37B478] hover:text-[#37B478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37B478] ${
    isDarkMode
      ? "border-white/20 bg-white/10 text-white"
      : "border-black/15 bg-white/70 text-black"
  }`;

  return (
    <div className={`mt-5 flex items-center justify-center gap-4 ${className}`}>
      <button
        type="button"
        className={buttonClassName}
        onClick={onPrevious}
        aria-label={t("previousCard")}
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          ‹
        </span>
      </button>

      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({length: count}, (_, index) => (
          <button
            key={index}
            type="button"
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-[#37B478]" : "w-3 bg-[#37B478]/35"
            }`}
            onClick={() => onGoTo(index)}
            aria-label={`${t("goToCard")} ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        className={buttonClassName}
        onClick={onNext}
        aria-label={t("nextCard")}
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          ›
        </span>
      </button>
    </div>
  );
}

function TravelArrow({direction, isDarkMode, orderClassName, onClick, disabled}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === "prev" ? t("previousCard") : t("nextCard")}
      /* Over the track, at the viewport's own edges, while there is room beside
         the card for them to stand. Below 620 they come down and join the dots:
         still one arrow left and one right, still one set of them - a second
         set for phones would be two controls doing one job and a screen reader
         would read both. The centring lives in the transform, so the small
         screen has to undo it or the arrow sits half a row high. */
      className={`absolute top-1/2 z-[2] flex size-11 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition hover:border-[#37B478] hover:text-[#37B478] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37B478] disabled:opacity-35 max-[620px]:static max-[620px]:size-9 max-[620px]:translate-y-0 ${orderClassName} ${
        direction === "prev"
          ? "left-[var(--carousel-gutter)]"
          : "right-[var(--carousel-gutter)]"
      } ${
        isDarkMode
          ? "border-white/20 bg-white/10 text-white"
          : "border-black/15 bg-white/70 text-black"
      }`}
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {direction === "prev" ? "‹" : "›"}
      </span>
    </button>
  );
}

function TravelCarousel({
  ariaLabel,
  items,
  className,
  controlsClassName,
  isDarkMode,
  bleedClassName = "",
}) {
  const {index, viewportRef, go, step, handlers} = useCarousel(items.length);

  return (
    <div
      /* No w-full here, deliberately: a width of 100% is 100% of the container
         the negative margins are reaching out of, so the two cancel and the
         track slides sideways instead of widening. Left to size itself, it
         takes the room the margins give it. */
      className={`relative ${bleedClassName} max-[620px]:flex max-[620px]:flex-wrap max-[620px]:items-center max-[620px]:justify-center max-[620px]:gap-3 ${className}`}
      /* Where the arrows stand, and - through the slide's padding below - the
         room the card gives up for them. One value, so the two can never
         disagree and leave an arrow lying on the card. */
      style={{"--carousel-gutter": "clamp(20px, 5vw, 96px)"}}
      aria-label={ariaLabel}
    >
      <TravelArrow
        direction="prev"
        isDarkMode={isDarkMode}
        orderClassName="max-[620px]:order-2"
        disabled={items.length < 2}
        onClick={() => step(-1)}
      />

      {/* clip, not hidden: the neighbouring cards have to be trimmed without
          turning this into a scroll container that swallows the page's own
          scrolling and breaks any sticky element inside it.

          A flex item does not shrink below its contents, and the contents are
          the whole track - hence min-w-0 once this row becomes a flex row. */}
      <div
        ref={viewportRef}
        {...handlers}
        className="overflow-x-clip touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#37B478] max-[620px]:order-1 max-[620px]:min-w-0 max-[620px]:basis-full"
      >
        <div
          /* Slow on purpose: a long journey taken quickly reads as a flick,
             taken slowly it reads as one card passing and another arriving.
             motion-reduce drops the travel for anyone who asked the system for
             less movement - the card still changes, it just does not fly. */
          className="flex transition-transform duration-[1400ms] ease-[cubic-bezier(0.33,0,0.2,1)] motion-reduce:transition-none"
          style={{
            gap: TRAVEL_GAP,
            /* One step is the card plus the empty road beside it. Both come
               from the same constant, so they cannot fall out of step. */
            transform: `translate3d(calc(${-index} * (100% + ${TRAVEL_GAP})), 0, 0)`,
          }}
        >
          {items.map((child, slideIndex) => (
            <div
              key={slideIndex}
              /* The gutter plus an arrow and 10px of daylight, so the arrows
                 stand clear of the card at rest and only cross it while it is
                 travelling past them. Below 620 the arrows have gone down to
                 the dots, so the card takes their room back and keeps only the
                 page's own margin - the room above is owed to the arrows, not
                 to the edge of the screen. A class rather than an inline style
                 on purpose: an inline value cannot be beaten by a media query,
                 and the phone case has to beat it. */
              className="w-full flex-none px-[calc(var(--carousel-gutter)+54px)] max-[620px]:px-[var(--carousel-gutter)]"
              /* Hidden from the reading order while off-screen, so a screen
                 reader is not handed three headlines for one visible card. */
              aria-hidden={slideIndex !== index}
            >
              {/* The slide runs to the edges of the section so a card can leave
                  the screen; the card itself stops short of them, which is what
                  makes the movement read as one card leaving rather than two
                  panels sliding as a strip. */}
              {/* 1320 wide at most, less the arrow and its gap at each end -
                  the width the card had when the arrows stood beside it in a
                  row rather than on top of the track. */}
              <div className="mx-auto max-w-[1224px]">{child}</div>
            </div>
          ))}
        </div>
      </div>

      <TravelArrow
        direction="next"
        isDarkMode={isDarkMode}
        orderClassName="max-[620px]:order-4"
        disabled={items.length < 2}
        onClick={() => step(1)}
      />

      <div
        className={`mt-5 flex items-center justify-center gap-2 max-[620px]:order-3 max-[620px]:mt-0 ${controlsClassName}`}
        aria-hidden="true"
      >
        {items.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            className={`h-1.5 rounded-full transition-all ${
              index === dotIndex ? "w-8 bg-[#37B478]" : "w-3 bg-[#37B478]/35"
            }`}
            onClick={() => go(dotIndex)}
            aria-label={`${t("goToCard")} ${dotIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ScrollCarousel({ariaLabel, items, className, controlsClassName, isDarkMode}) {
  const trackRef = useRef(null);
  const dragRef = useRef({active: false, startX: 0, startY: 0, startIndex: 0, horizontal: null, captured: false});
  const [activeIndex, setActiveIndex] = useState(0);

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
      startY: event.clientY,
      startIndex: activeIndex,
      horizontal: null,
      captured: false,
    };
  };

  const handlePointerMove = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (drag.horizontal === null) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      drag.horizontal = Math.abs(deltaX) > Math.abs(deltaY);
      if (!drag.horizontal) {
        drag.active = false;
        return;
      }
      track.setPointerCapture?.(event.pointerId);
      drag.captured = true;
    }

    if (!drag.horizontal) return;

    event.preventDefault();
  };

  const stopDrag = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag.active) {
      if (drag.captured) {
        track.releasePointerCapture?.(event.pointerId);
      }
      return;
    }

    const delta = event.clientX - drag.startX;
    const startIndex = drag.startIndex;
    drag.active = false;
    if (drag.captured) {
      track.releasePointerCapture?.(event.pointerId);
      drag.captured = false;
    }

    const threshold = Math.min(72, track.clientWidth * 0.14);
    const nextIndex = Math.max(0, Math.min(
      items.length - 1,
      startIndex + (Math.abs(delta) >= threshold ? (delta < 0 ? 1 : -1) : 0),
    ));
    scrollToIndex(nextIndex);
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

  return (
    <div className={`w-full ${className}`} aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex touch-pan-y snap-x snap-mandatory gap-4 overflow-x-hidden pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <CarouselControls
        count={items.length}
        activeIndex={activeIndex}
        isDarkMode={isDarkMode}
        onPrevious={() => move(-1)}
        onNext={() => move(1)}
        onGoTo={scrollToIndex}
        className={controlsClassName}
      />
    </div>
  );
}

function ResponsiveCarousel({
  ariaLabel,
  children,
  className = "",
  controlsClassName = "",
  isDarkMode,
  variant = "scroll",
  /* "travel" only: how far the track reaches past its section, so a card can
     leave the screen rather than stop short of it. The section owns its own
     padding, so it is the only thing that can say what that distance is. */
  bleedClassName = "",
}) {
  const items = Array.isArray(children) ? children : [children];
  const Carousel = variant === "travel" ? TravelCarousel : ScrollCarousel;

  return (
    <Carousel
      ariaLabel={ariaLabel}
      items={items}
      className={className}
      controlsClassName={controlsClassName}
      isDarkMode={isDarkMode}
      bleedClassName={bleedClassName}
    />
  );
}

export default ResponsiveCarousel;
