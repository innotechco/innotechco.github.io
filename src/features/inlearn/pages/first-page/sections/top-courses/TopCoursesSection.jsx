import {Link} from "react-router-dom";

import CarouselArrow from "../../../../components/CarouselArrow.jsx";
import CourseCard from "../../../../components/CourseCard.jsx";
import {routes} from "../../../../../../app/routes.js";
import useCarousel from "../../../../../../shared/hooks/useCarousel.js";
import useMediaQuery from "../../../../hooks/useMediaQuery.js";
import {inlearnCoursePath} from "../../../../inlearnContent.js";

/* How many cards stand side by side, and where each count begins. The widest
   entry that matches wins, so the list is read from the bottom up.

   The numbers are the design's: four across a monitor and any laptop, three on
   a tablet, one below 717px - where three cards leave each of them too narrow
   to read. They live here rather than in the stylesheet because the track has to
   move by exactly one card's width, and only JavaScript knows how wide that is.

   The stylesheet has the same 717 in it, for where the arrows stand. Two places,
   one number: if one moves, the other has to move with it. */
const PER_VIEW = [
  {query: "(min-width: 1024px)", cards: 4},
  {query: "(min-width: 717px)", cards: 3},
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
        <CarouselArrow
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
                <CourseCard
                  course={course}
                  /* The same bookmark and share panel All Courses draws. The
                     third meta line stays off here: this row is the "row"
                     layout, and a third line would push the cards' dates out
                     of line with each other. */
                  showActions
                  labels={{save: topCourses.save, share: topCourses.share}}
                  /* Same destination as everywhere else: the course's own
                     page. The row is the newest eight, and this is how a
                     visitor gets from one of them to the whole thing. */
                  to={inlearnCoursePath(course)}
                  readMore={topCourses.readMore}
                  isVisible={cardIndex >= index && cardIndex < index + perView}
                />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow
          direction="next"
          label={topCourses.next}
          disabled={index >= maxIndex}
          onClick={() => step(1)}
        />

        {/* One card fills a phone screen with nothing to say that seven more
            follow it, so the dots come out where the row is one card wide.

            They live inside the row, like the New Event ones, so the arrows can
            come down and stand either side of them rather than disappearing:
            there is no room beside a full-width card, but there is room under
            it. */}
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
      </div>

      {/* The way out of the row. The arrows walk through eight courses one at a
          time; this is for the visitor who would rather see them all at once,
          and it stands under the row where they run out of cards.

          The hero has the same destination at the top of the page. Two ways to
          the same place is not a duplicate here - by the time someone has
          reached the end of this row they are a screen and a half past the
          hero's button. */}
      {topCourses.cta ? (
        <div className="inlearn-courses-cta">
          <Link className="inlearn-hero-cta" to={routes.inlearnCourses}>
            {topCourses.cta}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export default TopCoursesSection;
