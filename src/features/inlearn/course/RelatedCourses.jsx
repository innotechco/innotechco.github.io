import {useEffect, useRef, useState} from "react";

import CourseCard from "../components/CourseCard.jsx";
import useCarousel from "../../../shared/hooks/useCarousel.js";
import useMediaQuery from "../hooks/useMediaQuery.js";
import {routes} from "../../../app/routes.js";

/* The row under a course: more courses, and it never runs out.

   Four cards side by side on a monitor or a laptop, three on a tablet, two on a
   phone - and it keeps going in whichever direction the visitor presses,
   without ever reaching an end and stopping.

   HOW THE LOOP WORKS
   ------------------
   The list is drawn three times over. The row starts in the middle copy, so
   there are always cards to the left and to the right of what is on screen and
   the track can travel either way with something to show.

   When the travel finishes, the index is brought back into the middle copy by a
   whole list length - and that jump is made with the transition switched off,
   so nothing is seen to move. What is on screen is identical either side of the
   jump, because it is the same card from a different copy.

   Two copies would be enough in one direction only. Three is what makes both
   directions work from the first press. */
const PER_VIEW = [
  {query: "(min-width: 1024px)", cards: 4},
  {query: "(min-width: 640px)", cards: 3},
];
const PER_VIEW_ON_PHONE = 2;
const COPIES = 3;

/* The stylesheet's travel time for this track, plus a little. The index is
   brought home on a timer rather than on transitionend: transitionend does not
   fire in a background tab, and a row left mid-jump there would come back to
   the visitor sitting outside its own list. */
const TRAVEL_MS = 620;

function RelatedCourses({courses, labels}) {
  const isDesktop = useMediaQuery(PER_VIEW[0].query);
  const isTablet = useMediaQuery(PER_VIEW[1].query);
  const perView = isDesktop
    ? PER_VIEW[0].cards
    : isTablet
    ? PER_VIEW[1].cards
    : PER_VIEW_ON_PHONE;

  const count = courses?.length ?? 0;
  /* Below this the loop has nothing to loop: the whole list is on screen at
     once and moving it would only shuffle the same cards. */
  const canLoop = count > perView;

  const {index, viewportRef, step, handlers} = useCarousel(count, perView, {
    loop: canLoop,
  });
  const [isJumping, setIsJumping] = useState(false);
  const jumpTimer = useRef(0);

  /* Where the middle copy begins. Everything below is measured from here. */
  const home = canLoop ? count : 0;
  const slides = canLoop ? Array.from({length: COPIES}, () => courses).flat() : courses;

  /* The index the hook holds runs from `home` and drifts as the visitor moves.
     This is where it lands inside the list, which is what decides which card a
     slide actually shows. */
  const offset = canLoop ? index + home : index;

  useEffect(() => {
    if (!canLoop) return undefined;

    /* Still inside the middle copy: nothing to correct. The ends are excluded -
       at exactly one list away the track is showing the first or last copy's
       edge, and one more press from there would travel into empty space. */
    if (index > -count && index < count) return undefined;

    jumpTimer.current = window.setTimeout(() => {
      setIsJumping(true);
      /* One whole list, in whichever direction it wandered. */
      step(index > 0 ? -count : count);
    }, TRAVEL_MS);

    return () => window.clearTimeout(jumpTimer.current);
  }, [canLoop, count, index, step]);

  /* The jump has been rendered, so the transition can come back. A frame with a
     timer behind it: requestAnimationFrame alone never fires in a background
     tab, and the transition would stay switched off for the rest of the visit. */
  useEffect(() => {
    if (!isJumping) return undefined;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setIsJumping(false);
    };
    const frame = window.requestAnimationFrame(finish);
    const timer = window.setTimeout(finish, 80);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [isJumping]);

  if (!count) return null;

  return (
    <section className="inlearn-courses inlearn-related" aria-labelledby="inlearn-related-title">
      <h2 id="inlearn-related-title" className="inlearn-section-title inlearn-courses-title">
        {labels.related}
      </h2>

      <div className="inlearn-courses-row">
        <RelatedArrow direction="prev" label={labels.previous} onClick={() => step(-1)} />

        <div className="inlearn-courses-viewport" ref={viewportRef} {...handlers}>
          <div
            className={`inlearn-courses-track${isJumping ? " is-jumping" : ""}`}
            style={{
              "--per-view": perView,
              transform: `translate3d(calc(${-offset} * (100% + var(--inlearn-course-gap)) / ${perView}), 0, 0)`,
            }}
          >
            {slides.map((course, slideIndex) => {
              const isVisible = slideIndex >= offset && slideIndex < offset + perView;

              return (
                <div
                  className="inlearn-courses-slide"
                  key={`${course.id}-${slideIndex}`}
                  /* Three copies of the same list would hand a screen reader
                     every course three times over. Only the cards actually on
                     screen are in the reading order. */
                  aria-hidden={!isVisible}
                >
                  <CourseCard
                    course={course}
                    layout="grid"
                    readMore={labels.readMore}
                    labels={{save: labels.save, share: labels.share}}
                    to={`${routes.inlearnCourses}/${course.id}`}
                    isVisible={isVisible}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <RelatedArrow direction="next" label={labels.next} onClick={() => step(1)} />
      </div>
    </section>
  );
}

/* Never disabled: there is always another card in that direction. */
function RelatedArrow({direction, label, onClick}) {
  return (
    <button
      type="button"
      className={`inlearn-courses-arrow is-${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path
          d={direction === "prev" ? "M15 4L7 12l8 8" : "M9 4l8 8-8 8"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default RelatedCourses;
