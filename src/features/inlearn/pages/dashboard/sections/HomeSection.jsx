import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import {ActiveCoursesIcon, CompletedIcon, ProgressIcon} from "./homeIcons.jsx";
import {CalendarIcon, ChevronIcon, ClockIcon} from "./courseIcons.jsx";
import {MODES} from "./courseModes.js";
import {fetchMyCourses} from "../../../services/learning.js";
import {getInlearnCourses} from "../../../inlearnContent.js";
import {routes} from "../../../../../app/routes.js";

/* The dashboard's first page: where somebody stands, in one screen.
 *
 * It adds nothing to what the server already says. The same call the Courses
 * page makes answers all of this - three figures, every course with its bar,
 * and every lesson still to come - so there is one request behind the section
 * and no second version of "how far through am I" to drift out of step.
 *
 * Nothing here is a destination. Every row hands over to the Courses page at
 * the course it names, because that is where a course can actually be opened;
 * this page is the map, not the room.
 */

/* Shown in place of a figure that is not known yet. Three dashes are honest
   about waiting in a way that three zeros are not. */
const UNKNOWN = "—";

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

/* --------------------------------------------------------------- the sums */

/* Every course this account paid for, in one list, whether or not its lessons
   have been written yet.
 *
 * A course with no content is not dropped: it was bought, and a bought course
 * missing from the page looks like the money went nowhere. It arrives with no
 * sessions and nothing finished, which is the truth about it.
 */
function ownedCourses(data) {
  const described = new Map(data.courses.map((course) => [course.courseId, course]));
  return data.owned.map(
    (courseId) =>
      described.get(courseId) ?? {
        courseId,
        mode: "online",
        sessions: [],
        totals: {sessions: 0, open: 0, complete: 0, percent: 0},
        isWaiting: true,
      },
  );
}

/* The three figures.
 *
 * The average is the mean of the courses' own percentages rather than every
 * finished lesson over every lesson: a two-lesson course and a twenty-lesson
 * one are two courses, and weighing them by length would let one long course
 * decide the number on its own.
 *
 * Courses with no lessons yet are left out of the average and only out of the
 * average. Counting them as nought would report somebody as falling behind on
 * work that does not exist; they still count as active, because an unstarted
 * course is exactly what active means.
 */
function summarise(courses) {
  const measurable = courses.filter((course) => course.totals.sessions > 0);

  const percent = measurable.length
    ? Math.round(
        measurable.reduce((total, course) => total + course.totals.percent, 0) /
          measurable.length,
      )
    : 0;

  return {
    percent,
    completed: courses.reduce((total, course) => total + course.totals.complete, 0),
    active: courses.filter((course) => course.totals.percent < 100).length,
  };
}

/* Every lesson whose door is still shut, nearest first.
 *
 * The server has already decided what shut means - published, and its day come
 * - and sends a closed lesson with its title and its time and nothing else. So
 * this is a sort, not a judgement.
 *
 * A lesson with no date yet goes last rather than nowhere. It has been paid
 * for; "we have not said when" is a thing to tell somebody, and dropping the
 * row would say nothing at all.
 */
function upcomingSessions(courses) {
  const rows = [];

  for (const course of courses) {
    for (const session of course.sessions) {
      if (session.isOpen) continue;
      rows.push({
        key: `${course.courseId}:${session.id}`,
        courseId: course.courseId,
        mode: course.mode,
        session,
      });
    }
  }

  /* Undated rows sort to the end in one comparison rather than two passes: a
     missing date is treated as the furthest future there is. */
  const when = (row) => {
    const value = row.session.startsAt ? new Date(row.session.startsAt).getTime() : NaN;
    return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
  };

  return rows.sort((a, b) => when(a) - when(b));
}

/* --------------------------------------------------------------- the parts */

/* One face of a figure card. Written twice per card - see below. */
function StatFace({Icon, value, label}) {
  return (
    <span className="inlearn-home-stat-face">
      <span className="inlearn-home-stat-value">{value}</span>
      <span className="inlearn-home-stat-label">
        <Icon size={16} />
        <span>{label}</span>
      </span>
    </span>
  );
}

function StatCard({Icon, value, label}) {
  return (
    /* An item, not a button: it counts something, it does not lead anywhere.
       The dark state it takes on hover is the card acknowledging the pointer,
       so it is written in CSS and there is nothing here to press.
     *
     * The card says the same thing twice, in the same place. The second copy
     * is white on black and lies exactly over the first; hovering uncovers it
     * from the bottom up, so the dark rises through the card while the figure
     * and its label do not move at all.
     *
     * Two copies rather than one whose colour transitions, because a single
     * copy would have to turn white exactly as the dark passed under it - and
     * it passes under the top of the text before the bottom, so for part of
     * the way there is no one colour that is right.
     *
     * The second is hidden from assistive technology. It is the same figure
     * and the same words; read out twice it would sound like two.
     */
    <li className="inlearn-home-stat">
      <StatFace Icon={Icon} value={value} label={label} />
      <span className="inlearn-home-stat-face is-over" aria-hidden="true">
        <span className="inlearn-home-stat-value">{value}</span>
        <span className="inlearn-home-stat-label">
          <Icon size={16} />
          <span>{label}</span>
        </span>
      </span>
    </li>
  );
}

/* A course, and the way back to it.
 *
 * A button rather than a link, because it does not go to an address a visitor
 * could usefully copy - it goes to the Courses page AND asks it to open one
 * card. That second half cannot live in a URL without inventing a route, and a
 * route that only ever redirects is a route that will rot.
 */
function CourseRow({course, details, onOpen}) {
  const mode = MODES[course.mode] ?? MODES.online;
  const {Icon} = mode;

  return (
    <li>
      <button
        type="button"
        className="inlearn-home-row"
        onClick={() => onOpen(course.courseId)}
      >
        {details?.image ? (
          <img className="inlearn-home-row-image" src={details.image} alt="" loading="lazy" />
        ) : (
          <span className="inlearn-home-row-image" aria-hidden="true" />
        )}

        <span className="inlearn-home-row-main">
          <span className="inlearn-home-row-title">{details?.title ?? course.courseId}</span>
          <span className="inlearn-home-row-sub">
            <Icon size={14} />
            {mode.label}
          </span>
        </span>

        <span className="inlearn-home-row-progress">
          <span className="inlearn-home-row-percent">
            {course.isWaiting ? UNKNOWN : `${course.totals.percent}%`}
          </span>
          <span className="inlearn-course-bar" aria-hidden="true">
            <span style={{width: `${course.totals.percent}%`}} />
          </span>
          <span className="inlearn-home-row-caption">
            {course.isWaiting ? "Being prepared" : "Course Progress"}
          </span>
        </span>

        {/* Leaning right because this row hands over to another page; the
            Courses page's own chevron points down because its panel opens in
            place. Same mark, two directions, two different promises. */}
        <span className="inlearn-home-row-go" aria-hidden="true">
          <ChevronIcon size={15} />
        </span>
      </button>
    </li>
  );
}

function UpcomingRow({row, details, onOpen}) {
  const mode = MODES[row.mode] ?? MODES.online;
  const {Icon} = mode;
  const {session} = row;

  return (
    <li>
      <button
        type="button"
        className="inlearn-home-row is-upcoming"
        onClick={() => onOpen(row.courseId)}
      >
        {details?.image ? (
          <img className="inlearn-home-row-image" src={details.image} alt="" loading="lazy" />
        ) : (
          <span className="inlearn-home-row-image" aria-hidden="true" />
        )}

        <span className="inlearn-home-row-main">
          <span className="inlearn-home-row-title">{details?.title ?? row.courseId}</span>
          <span className="inlearn-home-row-sub">
            <Icon size={14} />
            {session.title}
          </span>
        </span>

        <span className="inlearn-home-row-when">
          {session.startsAt ? (
            <>
              <span>
                <CalendarIcon /> {formatDay(session.startsAt)}
              </span>
              <span>
                <ClockIcon /> {formatSpan(session.startsAt, session.endsAt)}
              </span>
            </>
          ) : (
            /* Said rather than left blank: an empty cell reads as a fault, and
               "not scheduled yet" is a real answer to when this happens. */
            <span className="inlearn-home-row-undated">Date to be announced</span>
          )}
        </span>

        <span className="inlearn-home-row-go" aria-hidden="true">
          <ChevronIcon size={15} />
        </span>
      </button>
    </li>
  );
}

/* --------------------------------------------------------------- the page */

function HomeSection() {
  const navigate = useNavigate();

  const catalogue = useMemo(() => {
    const {courses} = getInlearnCourses();
    return new Map(courses.map((course) => [course.id, course]));
  }, []);

  const [data, setData] = useState({owned: [], courses: []});
  const [status, setStatus] = useState("loading");
  const [problem, setProblem] = useState("");
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

  const courses = useMemo(() => ownedCourses(data), [data]);
  const stats = useMemo(() => summarise(courses), [courses]);
  const upcoming = useMemo(() => upcomingSessions(courses), [courses]);

  /* The Courses page is told which card to open in router state rather than in
     the address. State survives the navigation and is then gone, which is what
     this is: something said once on the way, not a property of the page being
     arrived at. A visitor who reloads gets the Courses page plainly, which is
     right - the click that meant "this one" is long over. */
  const openCourse = useCallback(
    (courseId) => {
      navigate(routes.inlearnDashboardCourses, {state: {focusCourse: courseId}});
    },
    [navigate],
  );

  if (status === "error") {
    return (
      <section className="inlearn-home" aria-label="Dashboard">
        <div className="inlearn-courses-notice">
          <p className="inlearn-courses-problem" role="status">
            {problem}
          </p>
          <button
            type="button"
            className="inlearn-courses-retry"
            onClick={() => {
              setStatus("loading");
              setProblem("");
              load();
            }}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const isLoading = status === "loading";

  return (
    <section className="inlearn-home" aria-label="Dashboard">
      {/* Drawn even while the request is in flight, holding their own space
          with dashes in them. A spinner where they will be moves the whole
          page down and then back up the moment the answer lands, and that
          jump is worse than a short wait looking at the right shape. */}
      <ul className="inlearn-home-stats" aria-busy={isLoading}>
        <StatCard
          Icon={ProgressIcon}
          value={isLoading ? UNKNOWN : `${stats.percent}%`}
          label="Average Progress"
        />
        <StatCard
          Icon={CompletedIcon}
          value={isLoading ? UNKNOWN : stats.completed}
          label="Completed Sessions"
        />
        <StatCard
          Icon={ActiveCoursesIcon}
          value={isLoading ? UNKNOWN : stats.active}
          label="Active Courses"
        />
      </ul>

      {isLoading ? (
        <p className="inlearn-courses-notice" role="status">
          Loading your courses&hellip;
        </p>
      ) : null}

      {!isLoading && !courses.length ? (
        <p className="inlearn-home-empty">
          Courses you buy will appear here, with how far through them you are.
        </p>
      ) : null}

      {!isLoading && courses.length ? (
        <>
          <h2 className="inlearn-home-heading">Courses in Progress</h2>
          <ul className="inlearn-home-list">
            {courses.map((course) => (
              <CourseRow
                key={course.courseId}
                course={course}
                details={catalogue.get(course.courseId)}
                onOpen={openCourse}
              />
            ))}
          </ul>

          <h2 className="inlearn-home-heading">Upcoming Classes</h2>
          {upcoming.length ? (
            <ul className="inlearn-home-list">
              {upcoming.map((row) => (
                <UpcomingRow
                  key={row.key}
                  row={row}
                  details={catalogue.get(row.courseId)}
                  onOpen={openCourse}
                />
              ))}
            </ul>
          ) : (
            <p className="inlearn-home-empty">
              Nothing scheduled. Every lesson you own is already open.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}

export default HomeSection;
