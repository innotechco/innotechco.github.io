import CourseCard from "../../../components/CourseCard.jsx";
import useCarousel from "../../../hooks/useCarousel.js";
import useMediaQuery from "../../../hooks/useMediaQuery.js";

/* How many cards stand side by side, and where each count begins. The widest
   entry that matches wins, so the list is read from the bottom up.

   The numbers are the design's: four across a monitor and any laptop, three on
   a tablet, one on a phone. They live here rather than in the stylesheet
   because the track has to move by exactly one card's width, and only
   JavaScript knows how wide that is. */
const PER_VIEW = [
  {query: "(min-width: 1024px)", cards: 4},
  {query: "(min-width: 640px)", cards: 3},
];
const PER_VIEW_ON_PHONE = 1;

/* The course row: one step per arrow click and one step per swipe, whether the
   row shows four cards or one. */
function TopCoursesSection({topCourses}) {
  const isDesktop = useMediaQuery(PER_VIEW[0].query);
  const isTablet = useMediaQuery(PER_VIEW[1].query);
  const perView = isDesktop ? PER_VIEW[0].cards : isTablet ? PER_VIEW[1].cards : PER_VIEW_ON_PHONE;

  const courses = topCourses.items ?? [];
  const {index, maxIndex, viewportRef, go, step, handlers} = useCarousel(courses.length, perView);

  if (!courses.length) return null;

  return (
    <section className="inlearn-courses" aria-labelledby="inlearn-courses-title">
      <h2 id="inlearn-courses-title" className="inlearn-section-title inlearn-courses-title">
        {topCourses.sectionTitle}
      </h2>

      {/* An arrow either side of the row, out at the edges of the page rather
          than over the cards: the row is arrow / cards / arrow, the same shape
          the New Event carousel uses. */}
      <div className="inlearn-courses-row">
        <CoursesArrow
          direction="prev"
          label={topCourses.previous}
          disabled={index === 0}
          onClick={() => step(-1)}
        />

        <div
          className="inlearn-courses-viewport"
          ref={viewportRef}
          {...handlers}
        >
          <div
            className="inlearn-courses-track"
            style={{
              /* One step is a card plus the gap between two cards. Written as a
                 custom property so the stylesheet can size the cards from the
                 same number and the two can never disagree. */
              "--per-view": perView,
              transform: `translate3d(calc(${-index} * (100% + var(--inlearn-course-gap)) / ${perView}), 0, 0)`,
            }}
          >
            {courses.map((course, cardIndex) => (
              <div
                className="inlearn-courses-slide"
                key={course.id ?? cardIndex}
                /* Out of the reading order while it is off the side, so a
                   screen reader is handed the cards actually on show. */
                aria-hidden={cardIndex < index || cardIndex >= index + perView}
              >
                <CourseCard course={course} readMore={topCourses.readMore} />
              </div>
            ))}
          </div>
        </div>

        <CoursesArrow
          direction="next"
          label={topCourses.next}
          disabled={index >= maxIndex}
          onClick={() => step(1)}
        />
      </div>

      {/* On a phone the arrows are gone - there is no room beside a full-width
          card - and without them one card fills the screen with nothing to say
          that seven more follow it. The dots say it, and they are the same dots
          the New Event row uses a screen above, so the two read as one page.

          Only where the arrows are missing: with the arrows there, dots would
          be a second control saying the same thing. */}
      {perView === 1 && courses.length > 1 ? (
        <div className="inlearn-carousel-dots" role="tablist" aria-label={topCourses.sectionTitle}>
          {courses.map((course, dotIndex) => (
            <button
              key={course.id ?? dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`${dotIndex + 1} / ${courses.length}`}
              className={dotIndex === index ? "is-current" : ""}
              onClick={() => go(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CoursesArrow({direction, label, disabled, onClick}) {
  return (
    <button
      type="button"
      className={`inlearn-courses-arrow is-${direction}`}
      aria-label={label}
      disabled={disabled}
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

export default TopCoursesSection;
