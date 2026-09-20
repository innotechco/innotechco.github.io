import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";

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

  /* The chosen categories live in the address, not in a useState.

     Three things need that. A course page opens this page in a new tab with a
     category already chosen, and a new tab starts with no memory - the only
     thing that travels with it is the address. A filtered view can be sent to
     somebody. And the back button then does what the visitor means by it.

     Several at once: the filters are "show me any of these", so choosing
     Engineering and Health shows both rather than the courses that are somehow
     in both, of which there are usually none. */
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTags = useMemo(() => {
    const raw = searchParams.get("tags");
    if (!raw) return [];
    const known = new Set((catalogue.tags ?? []).map((tag) => tag.id));
    /* Anything can be typed into an address bar, and a category that no longer
       exists would otherwise filter the page down to nothing with no way to
       tell why. */
    return raw.split(",").map((id) => id.trim()).filter((id) => known.has(id));
  }, [catalogue.tags, searchParams]);

  const toggleTag = (id) => {
    const next =
      id === null
        ? []
        : activeTags.includes(id)
        ? activeTags.filter((tag) => tag !== id)
        : [...activeTags, id];

    const params = new URLSearchParams(searchParams);
    if (next.length) params.set("tags", next.join(","));
    else params.delete("tags");

    /* replace rather than push: pressing four chips in a row should leave one
       step behind it, not four. */
    setSearchParams(params, {replace: true});
  };

  const [visibleCount, setVisibleCount] = useState(layout.batch);
  const [isRevealing, setIsRevealing] = useState(false);
  const revealTimeout = useRef(0);

  const courses = useMemo(
    () =>
      activeTags.length
        ? catalogue.courses.filter((course) => activeTags.includes(course.tag))
        : catalogue.courses,
    [activeTags, catalogue.courses],
  );

  /* Both of these change how much is on screen, and both have to put the page
     back to one batch: a visitor who filtered down to three courses and then
     cleared the filter should not be handed all sixteen because the count from
     before survived.

     Adjusted while rendering rather than in an effect. An effect would paint
     the wrong number of cards first and correct it on the next frame, which is
     visible as a flash of the old list; this way the wrong frame never
     exists. */
  const batchKey = `${activeTags.join(",")}:${layout.batch}`;
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
        activeTags={activeTags}
        /* Pressing a chip that is already on turns that one off. All clears
           every one of them, in a way that can be seen rather than guessed at. */
        onSelect={toggleTag}
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
