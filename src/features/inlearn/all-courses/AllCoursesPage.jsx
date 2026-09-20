import {useEffect, useMemo, useRef, useState} from "react";

import CourseCard from "../components/CourseCard.jsx";
import CourseTags from "./CourseTags.jsx";
import useMediaQuery from "../hooks/useMediaQuery.js";
import {routes} from "../../../app/routes.js";
import {getInlearnCourses} from "../inlearnContent.js";

/* How many cards stand side by side, and how many the page shows before the
   visitor asks for more. The widest entry that matches wins, so the list is
   read from the bottom up.

   The two numbers belong together - a batch that is not a whole number of rows
   leaves a half-filled last row - so they are written on one line each rather
   than in two lists that could drift apart. The stylesheet builds the grid from
   `columns` through a custom property, so there is one number, not two. */
const LAYOUTS = [
  {query: "(min-width: 1024px)", columns: 4, batch: 8},
  {query: "(min-width: 640px)", columns: 3, batch: 6},
];
const PHONE_LAYOUT = {columns: 2, batch: 6};

/* Long enough to be seen, short enough not to be a wait. It stands in for the
   request that will fetch the next courses from WordPress; when that arrives,
   the button's busy state is already wired to it. */
const REVEAL_MS = 450;

function AllCoursesPage() {
  const catalogue = useMemo(() => getInlearnCourses(), []);
  const isDesktop = useMediaQuery(LAYOUTS[0].query);
  const isTablet = useMediaQuery(LAYOUTS[1].query);
  const layout = isDesktop ? LAYOUTS[0] : isTablet ? LAYOUTS[1] : PHONE_LAYOUT;

  const [activeTag, setActiveTag] = useState(null);
  const [visibleCount, setVisibleCount] = useState(layout.batch);
  const [isRevealing, setIsRevealing] = useState(false);
  const revealTimeout = useRef(0);

  const courses = useMemo(
    () =>
      activeTag
        ? catalogue.courses.filter((course) => course.tag === activeTag)
        : catalogue.courses,
    [activeTag, catalogue.courses],
  );

  /* Both of these change how much is on screen, and both have to put the page
     back to one batch: a visitor who filtered down to three courses and then
     cleared the filter should not be handed all sixteen because the count from
     before survived.

     Adjusted while rendering rather than in an effect. An effect would paint
     the wrong number of cards first and correct it on the next frame, which is
     visible as a flash of the old list; this way the wrong frame never
     exists. */
  const batchKey = `${activeTag ?? ""}:${layout.batch}`;
  const [lastBatchKey, setLastBatchKey] = useState(batchKey);

  if (batchKey !== lastBatchKey) {
    setLastBatchKey(batchKey);
    setVisibleCount(layout.batch);
  }

  useEffect(() => () => window.clearTimeout(revealTimeout.current), []);

  const hasMore = visibleCount < courses.length;

  const showMore = () => {
    if (isRevealing) return;
    setIsRevealing(true);
    revealTimeout.current = window.setTimeout(() => {
      setVisibleCount((current) => current + layout.batch);
      setIsRevealing(false);
    }, REVEAL_MS);
  };

  return (
    <div className="inlearn-all-courses">
      <h1 className="inlearn-all-courses-title">{catalogue.title}</h1>

      <CourseTags
        tags={catalogue.tags}
        allLabel={catalogue.allTag}
        activeTag={activeTag}
        /* Clicking the tag that is already on turns it off. The All chip does
           the same thing in a way that can be seen rather than guessed at, and
           between them there are two ways back to the full list. */
        onSelect={(tag) => setActiveTag((current) => (current === tag ? null : tag))}
      />

      {courses.length ? (
        <>
          <ul
            className="inlearn-course-grid"
            style={{"--inlearn-course-columns": layout.columns}}
          >
            {courses.slice(0, visibleCount).map((course, index) => (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  layout="grid"
                  /* The whole card is the link to that course's own page -
                     every course has one, and it is the page a search engine
                     indexes and the SEO editor will own in WordPress. */
                  to={`${routes.inlearnCourses}/${course.id}`}
                  readMore={catalogue.readMore}
                  labels={{save: catalogue.save, share: catalogue.share}}
                  /* The first row is what the visitor is looking at; the rest
                     wait their turn rather than competing with it. */
                  isVisible={index < layout.columns}
                />
              </li>
            ))}
          </ul>

          {hasMore ? (
            <div className="inlearn-all-courses-more">
              <button
                type="button"
                className="inlearn-show-all"
                onClick={showMore}
                /* aria-busy rather than a disabled button: disabling it moves
                   the focus ring off the control the visitor just pressed, and
                   a screen reader is told nothing about why. */
                aria-busy={isRevealing}
              >
                <span className="inlearn-show-all-label">
                  {isRevealing ? catalogue.loading : catalogue.showAll}
                </span>
                {isRevealing ? <span className="inlearn-show-all-spinner" aria-hidden="true" /> : null}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <p className="inlearn-all-courses-empty">{catalogue.empty}</p>
      )}
    </div>
  );
}

export default AllCoursesPage;
