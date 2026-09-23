import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";

import CourseCard from "../../../components/CourseCard.jsx";
import useMediaQuery from "../../../hooks/useMediaQuery.js";
import {useInlearnCatalogue} from "../../../useInlearnCatalogue.js";
import {getInlearnCourses} from "../../../inlearnContent.js";
import {
  getSavedCourses,
  getServerSavedCourses,
  subscribeToSavedCourses,
} from "../../../services/savedCourses.js";
import {inlearnCoursePath} from "../../../inlearnContent.js";

/* Three cards across, or two, is a question about how much room there is -
   not about what the visitor is pointing with.
 *
 * It used to ask for a fine pointer and hover, and that answered a different
 * question: a wide screen reporting touch - a laptop with a touchscreen, or a
 * desktop browser with device emulation on - fell to two columns with most of
 * the row left empty. The same width is what the stylesheet already uses to
 * decide whether the rail sits beside this grid or lies over it, so asking it
 * here keeps the two in step; when they disagreed, the grid was sized for a
 * rail that was not there. */
const WIDE_QUERY = "(min-width: 901px)";
const REVEAL_MS = 450;

function SaveSection() {
  const snapshot = useInlearnCatalogue();
  const catalogue = useMemo(() => getInlearnCourses(snapshot), [snapshot]);
  const savedIds = useSyncExternalStore(
    subscribeToSavedCourses,
    getSavedCourses,
    getServerSavedCourses,
  );
  const isWide = useMediaQuery(WIDE_QUERY);
  const batch = isWide ? 9 : 6;
  const columns = isWide ? 3 : 2;
  const [visibleCount, setVisibleCount] = useState(batch);
  const [lastBatch, setLastBatch] = useState(batch);
  const [isRevealing, setIsRevealing] = useState(false);
  const revealTimer = useRef(0);

  if (batch !== lastBatch) {
    setLastBatch(batch);
    setVisibleCount(batch);
  }

  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  const byId = useMemo(
    () => new Map(catalogue.courses.map((course) => [course.id, course])),
    [catalogue.courses],
  );
  const courses = savedIds.map((id) => byId.get(id)).filter(Boolean);
  const hasMore = visibleCount < courses.length;

  const showMore = () => {
    if (isRevealing) return;
    setIsRevealing(true);
    revealTimer.current = window.setTimeout(() => {
      setVisibleCount((current) => current + batch);
      setIsRevealing(false);
    }, REVEAL_MS);
  };

  if (!courses.length) {
    return (
      <section className="inlearn-save inlearn-save-empty" aria-labelledby="saved-courses-title">
        <h1 id="saved-courses-title">Saved courses</h1>
        <p>Courses you save will appear here.</p>
      </section>
    );
  }

  return (
    <section className="inlearn-save" aria-label="Saved courses">
      <ul
        className="inlearn-save-grid"
        style={{"--inlearn-save-columns": columns}}
      >
        {courses.slice(0, visibleCount).map((course, index) => (
          <li key={course.id}>
            <CourseCard
              course={course}
              layout="grid"
              readMore={catalogue.readMore}
              labels={{save: catalogue.save, share: catalogue.share}}
              to={inlearnCoursePath(course)}
              isVisible={index < columns}
              showActions
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="inlearn-save-more">
          <button
            type="button"
            className="inlearn-show-all"
            onClick={showMore}
            aria-busy={isRevealing}
          >
            <span>{isRevealing ? catalogue.loading : catalogue.showAll}</span>
            {isRevealing ? <span className="inlearn-show-all-spinner" aria-hidden="true" /> : null}
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default SaveSection;
