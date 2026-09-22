import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";

import CourseCard from "../../../components/CourseCard.jsx";
import useMediaQuery from "../../../hooks/useMediaQuery.js";
import {getInlearnCourses} from "../../../inlearnContent.js";
import {
  getSavedCourses,
  getServerSavedCourses,
  subscribeToSavedCourses,
} from "../../../services/savedCourses.js";
import {routes} from "../../../../../app/routes.js";

const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";
const REVEAL_MS = 450;

function SaveSection() {
  const catalogue = useMemo(() => getInlearnCourses(), []);
  const savedIds = useSyncExternalStore(
    subscribeToSavedCourses,
    getSavedCourses,
    getServerSavedCourses,
  );
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const batch = isDesktop ? 9 : 6;
  const columns = isDesktop ? 3 : 2;
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
              to={`${routes.inlearnCourses}/${course.id}`}
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
