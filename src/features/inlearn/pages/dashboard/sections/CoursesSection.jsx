import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLocation} from "react-router-dom";

import MediaDialog from "./MediaDialog.jsx";
import {
  CalendarIcon,
  ChevronIcon,
  ClockIcon,
  DocumentIcon,
  MapPinIcon,
  PlayIcon,
  SpeakerIcon,
  TickIcon,
} from "./courseIcons.jsx";
import {MODES} from "./courseModes.js";
import {fetchMyCourses, setSessionComplete} from "../../../services/learning.js";
import {useInlearnCatalogue} from "../../../useInlearnCatalogue.js";
import {getInlearnCourses} from "../../../inlearnContent.js";

/* Courses: what this account bought, and everything inside it.
 *
 * The server decides what may be seen. A session that has not been published,
 * or whose day has not come, arrives with its media stripped off rather than
 * hidden by this page - so there is nothing here to inspect your way past.
 *
 * The titles and pictures still come from the catalogue in this repo, because
 * that is where they live; the server sends what it owns, which is the
 * sessions, the place and how far through them somebody is.
 */

/* The handle the dashboard's first page reaches this card by.
 *
 * A course id is written by whoever fills the catalogue, so it is not safe to
 * drop straight into an id attribute - a space or a slash in one would make a
 * selector that finds nothing. Prefixed and encoded, it is always a legal id
 * and always the same one for the same course.
 */
function courseAnchorId(courseId) {
  return `course-${encodeURIComponent(courseId)}`;
}

function formatDay(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
}

function formatSpan(startsAt, endsAt) {
  if (!startsAt) return "";
  const time = (value) =>
    new Date(value).toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});
  return endsAt ? `${time(startsAt)} – ${time(endsAt)}` : time(startsAt);
}

/* Opening and closing a panel by its real height.
 *
 * The CSS-only way - a grid row moving from 0fr to 1fr - did not survive
 * contact with this card: the row settled at 199px while the content inside
 * ran to 727, and because the box it lives in has to clip during the movement,
 * everything past that line was simply cut off. "Open in maps" happened to sit
 * on the cut.
 *
 * So the height is measured instead of inferred. Opening animates to exactly
 * the content's height and is then released to `none`, which matters: left at
 * a fixed pixel height the panel would clip again the moment anything inside
 * it changed - a session marked finished, a longer address, a second line of
 * type on a narrower screen. Closing puts the measured height back first,
 * because a transition from `none` has nothing to travel from.
 */
function useReveal(isOpen) {
  const ref = useRef(null);
  const [height, setHeight] = useState(isOpen ? "none" : "0px");

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (isOpen) {
      setHeight(`${el.scrollHeight}px`);
      /* Released only once the movement is over, and only for the property
         that moved - a transition on something else finishing here would let
         go of the height while the panel was still travelling. */
      const done = (event) => {
        if (event.target === el && event.propertyName === "max-height") setHeight("none");
      };
      el.addEventListener("transitionend", done);
      return () => el.removeEventListener("transitionend", done);
    }

    /* From `none` there is nothing to animate, so the current height is
       written first and the collapse starts on the next frame - by which time
       the browser has a number to leave from. */
    setHeight(`${el.scrollHeight}px`);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setHeight("0px"));
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen]);

  return [ref, height];
}

function SessionRow({courseId, mode, session, onOpen, onToggle, isBusy}) {
  const {Icon} = MODES[mode] ?? MODES.online;

  return (
    <li className={`inlearn-course-session${session.isComplete ? " is-complete" : ""}`}>
      <span className="inlearn-course-session-mark" aria-hidden="true">
        <Icon size={18} />
      </span>

      <div className="inlearn-course-session-body">
        <p className="inlearn-course-session-title">
          <strong>{session.title}:</strong> {session.address}
        </p>
        <p className="inlearn-course-session-when">
          {session.startsAt ? (
            <>
              <span>
                <CalendarIcon /> {formatDay(session.startsAt)}
              </span>
              <span>
                <ClockIcon /> {formatSpan(session.startsAt, session.endsAt)}
              </span>
            </>
          ) : null}
        </p>
      </div>

      {session.isOpen ? (
        <div className="inlearn-course-session-actions">
          {/* The three ways into this session, kept as their own group. The
              finished control is not one of them - it changes nothing about
              what you can open - so it sits apart, after a divider, rather
              than becoming a fourth identical circle in the same row. */}
          <span className="inlearn-course-media-group">
          {session.media.audio ? (
            <button
              type="button"
              className="inlearn-course-media-button"
              onClick={() => onOpen(session, "audio")}
              aria-label={`Listen to ${session.title}`}
              title="Audio"
            >
              <SpeakerIcon />
            </button>
          ) : null}

          {session.media.video ? (
            <button
              type="button"
              className="inlearn-course-media-button is-video"
              onClick={() => onOpen(session, "video")}
              aria-label={`Watch ${session.title}`}
              title="Video"
            >
              <PlayIcon />
            </button>
          ) : null}

          <button
            type="button"
            className="inlearn-course-media-button"
            onClick={() => onOpen(session, "notes")}
            aria-label={`Open the notes for ${session.title}`}
            title="Notes"
          >
            <DocumentIcon />
          </button>

          </span>

          <span className="inlearn-course-session-divider" aria-hidden="true" />

          {/* Finishing is the visitor's to declare. Nothing here can tell
              whether a video was watched or skipped through, and a bar that
              filled itself on play would be measuring the wrong thing. */}
          <button
            type="button"
            className={`inlearn-course-done${session.isComplete ? " is-on" : ""}`}
            onClick={() => onToggle(courseId, session)}
            disabled={isBusy}
            aria-pressed={session.isComplete}
            title={session.isComplete ? "Mark as not finished" : "Mark as finished"}
          >
            <TickIcon />
            <span>{session.isComplete ? "Finished" : "Mark finished"}</span>
          </button>
        </div>
      ) : (
        <span className="inlearn-course-upcoming">Upcoming</span>
      )}
    </li>
  );
}

function CourseCardRow({course, catalogue, isOpen, onToggleOpen, onOpenMedia, onToggleDone, busyId}) {
  const [detailRef, detailHeight] = useReveal(isOpen);
  const mode = MODES[course.mode] ?? MODES.online;
  const {Icon} = mode;
  const details = catalogue.get(course.courseId);

  return (
    <li
      id={courseAnchorId(course.courseId)}
      className={`inlearn-course-owned${isOpen ? " is-open" : ""}`}
    >
      <div className="inlearn-course-owned-head">
        {details?.image ? (
          <img
            className="inlearn-course-owned-image"
            src={details.image}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className="inlearn-course-owned-image" aria-hidden="true" />
        )}

        <div className="inlearn-course-owned-main">
          <div className="inlearn-course-owned-title-row">
            <h2 className="inlearn-course-owned-title">
              {details?.title ?? course.courseId}
            </h2>
            <span className={`inlearn-course-mode is-${course.mode}`}>
              <Icon size={15} />
              {mode.label}
            </span>
          </div>

          <p className="inlearn-course-percent">{course.totals.percent}%</p>

          {/* The bar is the same number the figure above it shows, drawn.
              aria hides it because the figure has already said it. */}
          <div className="inlearn-course-bar" aria-hidden="true">
            <span style={{width: `${course.totals.percent}%`}} />
          </div>
          <p className="inlearn-course-bar-label">Course Progress</p>
        </div>
      </div>

      {/* Two boxes for one panel, and both are needed.
       *
       * The outer one is the animation: a grid whose single row goes from 0fr
       * to 1fr, which is the only way to move between "nothing" and "however
       * tall this happens to be" smoothly - a max-height guess either cuts the
       * content off or races through empty space on the way back.
       *
       * The inner one is what gets measured, so it must not be given padding
       * or a border of its own; those live on the section inside it.
       *
       * inert rather than hidden: hidden would remove it from the layout and
       * there would be nothing left to animate, while inert leaves it in place
       * and still keeps every control in it off the tab order. */}
      <div
        ref={detailRef}
        className="inlearn-course-owned-detail"
        data-open={isOpen ? "true" : "false"}
        style={{maxHeight: detailHeight}}
        inert={isOpen ? undefined : ""}
      >
        <div className="inlearn-course-owned-detail-inner">
          <div className="inlearn-course-owned-panel">
        {mode.hasLocation && course.location?.address ? (
          <div className="inlearn-course-location">
            <span className="inlearn-course-location-mark" aria-hidden="true">
              <MapPinIcon size={18} />
            </span>
            <div>
              <p className="inlearn-course-location-label">Location:</p>
              <p className="inlearn-course-location-address">{course.location.address}</p>
              {course.location.mapUrl ? (
                <a
                  className="inlearn-course-location-link"
                  href={course.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in maps
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        {course.sessions.length ? (
          <>
            <p className="inlearn-course-sessions-label">In-Person Sessions:</p>
            <ul className="inlearn-course-sessions">
              {course.sessions.map((session) => (
            <SessionRow
              key={session.id}
              courseId={course.courseId}
              mode={course.mode}
              session={session}
              onOpen={(entry, kind) => onOpenMedia(course.courseId, entry, kind)}
              onToggle={onToggleDone}
              isBusy={busyId === `${course.courseId}:${session.id}`}
            />
              ))}
            </ul>
          </>
        ) : (
          <p className="inlearn-course-not-started">This course has not started yet.</p>
        )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="inlearn-course-show-detail"
        onClick={() => onToggleOpen(course.courseId)}
        aria-expanded={isOpen}
      >
        <ChevronIcon isOpen={isOpen} />
        Show Detail
      </button>
    </li>
  );
}

function CoursesSection() {
  const snapshot = useInlearnCatalogue();
  const catalogue = useMemo(() => {
    const {courses} = getInlearnCourses(snapshot);
    return new Map(courses.map((course) => [course.id, course]));
  }, [snapshot]);

  const [data, setData] = useState({owned: [], courses: []});
  const [status, setStatus] = useState("loading");
  const [problem, setProblem] = useState("");
  const [openId, setOpenId] = useState("");
  const [media, setMedia] = useState(null);
  const [busyId, setBusyId] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(() => {
    fetchMyCourses()
      .then((answer) => {
        if (!isMounted.current) return;
        setData(answer);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted.current) return;
        setProblem(error.message);
        setStatus("error");
      });
  }, []);

  useEffect(load, [load]);

  /* Arriving here from the dashboard's first page, which names one course.
   *
   * It waits for the list to exist. The card cannot be scrolled to while the
   * request is still in flight, and asking early would quietly do nothing -
   * so the effect runs again when the status changes and finds the card then.
   *
   * Opening and scrolling both happen, and in that order: landing on a closed
   * card after asking for a particular one means pressing it a second time to
   * see what you came for. The top edge does not move as the panel opens, so
   * the two do not fight.
   *
   * Done once per arrival. The key is remembered because router state stays
   * put across re-renders, and without it marking a session finished would
   * yank the page back up to this card.
   */
  const {state} = useLocation();
  const focusCourse = state?.focusCourse;
  const focusedRef = useRef("");

  useEffect(() => {
    if (!focusCourse || status !== "ready") return undefined;
    if (focusedRef.current === focusCourse) return undefined;
    focusedRef.current = focusCourse;

    setOpenId(focusCourse);

    /* Scrolled straight away rather than a frame later. The card is already in
       the document by the time this runs - opening it changes a class, not
       whether it exists - and waiting on a frame that a background tab never
       grants would mean arriving at the top of the list instead. */
    const card = document.getElementById(courseAnchorId(focusCourse));
    if (!card) return undefined;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({behavior: still ? "auto" : "smooth", block: "start"});
    return undefined;
  }, [focusCourse, status]);

  const retry = () => {
    setStatus("loading");
    setProblem("");
    load();
  };

  /* The answer is written back rather than the list re-fetched: the server
     returns the finished list, so the bar can move immediately and nothing
     else on the page has to be rebuilt to see it. */
  const toggleDone = async (courseId, session) => {
    const key = `${courseId}:${session.id}`;
    setBusyId(key);
    try {
      const answer = await setSessionComplete(courseId, session.id, !session.isComplete);
      const done = new Set(answer.completed.map(String));

      setData((current) => ({
        ...current,
        courses: current.courses.map((course) => {
          if (course.courseId !== courseId) return course;
          const sessions = course.sessions.map((entry) => ({
            ...entry,
            isComplete: done.has(String(entry.id)),
          }));
          const complete = sessions.filter((entry) => entry.isComplete).length;
          return {
            ...course,
            sessions,
            totals: {
              ...course.totals,
              complete,
              percent: sessions.length ? Math.round((complete / sessions.length) * 100) : 0,
            },
          };
        }),
      }));
    } catch (error) {
      setProblem(error.message);
    } finally {
      if (isMounted.current) setBusyId("");
    }
  };

  if (status === "error") {
    return (
      <section className="inlearn-courses-owned" aria-label="Courses">
        <div className="inlearn-courses-notice">
          <p className="inlearn-courses-problem" role="status">
            {problem}
          </p>
          <button type="button" className="inlearn-courses-retry" onClick={retry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section className="inlearn-courses-owned" aria-label="Courses">
        <p className="inlearn-courses-notice" role="status">
          Loading your courses…
        </p>
      </section>
    );
  }

  if (!data.owned.length) {
    return (
      <section className="inlearn-courses-owned is-empty" aria-labelledby="courses-empty">
        <h1 id="courses-empty">No courses yet</h1>
        <p>Courses you buy will appear here with everything inside them.</p>
      </section>
    );
  }

  /* Bought, but nobody has put the lessons in yet. Said plainly rather than
     left out of the list - a course that vanishes after being paid for looks
     like the money went nowhere. */
  const described = new Set(data.courses.map((course) => course.courseId));
  const waiting = data.owned.filter((id) => !described.has(id));

  return (
    <section className="inlearn-courses-owned" aria-label="Courses">
      <ul className="inlearn-courses-list">
        {data.courses.map((course) => (
          <CourseCardRow
            key={course.courseId}
            course={course}
            catalogue={catalogue}
            isOpen={openId === course.courseId}
            onToggleOpen={(id) => setOpenId((current) => (current === id ? "" : id))}
            onOpenMedia={(courseId, session, kind) => setMedia({courseId, session, kind})}
            onToggleDone={toggleDone}
            busyId={busyId}
          />
        ))}

        {waiting.map((id) => (
          <li key={id} id={courseAnchorId(id)} className="inlearn-course-owned is-waiting">
            <div className="inlearn-course-owned-head">
              {/* The picture belongs to the catalogue, which knows this course
                  perfectly well - only its lessons are missing. Leaving a grey
                  square here made a bought course look broken rather than
                  merely unfinished. */}
              {catalogue.get(id)?.image ? (
                <img
                  className="inlearn-course-owned-image"
                  src={catalogue.get(id).image}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <span className="inlearn-course-owned-image" aria-hidden="true" />
              )}
              <div className="inlearn-course-owned-main">
                <h2 className="inlearn-course-owned-title">
                  {catalogue.get(id)?.title ?? id}
                </h2>
                <p className="inlearn-course-bar-label">
                  The lessons for this course are being prepared.
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {media ? (
        <MediaDialog
          courseId={media.courseId}
          session={media.session}
          kind={media.kind}
          onClose={() => setMedia(null)}
        />
      ) : null}
    </section>
  );
}

export default CoursesSection;
