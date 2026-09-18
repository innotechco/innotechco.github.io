import {usePointerGlow} from "../../../shared/hooks/usePointerGlow.js";

/* One course, as a card.

   It lives in components/ rather than beside the section that uses it because
   All Courses, Course Detail's related row and the dashboard all draw the same
   card. The shape of a course is defined here once, in the props it reads.

   Everything the hover does - the lift, the zoom, the blur, the label sliding
   out of the arrow - is CSS on .inlearn-course-card:hover. It is written that
   way so it also happens on keyboard focus, which a JavaScript mouseenter
   handler would miss, and so the reduced-motion block at the foot of the
   stylesheet can switch all of it off in one rule. */
function CourseCard({course, readMore, href, isVisible = false}) {
  const Wrapper = href ? "a" : "article";
  const linkProps = href ? {href} : {};
  const {position, handlers} = usePointerGlow();

  return (
    <Wrapper className="inlearn-course-card" {...linkProps} {...handlers}>
      {/* The frame is the picture's own box, and the light is a sheet of
          exactly that size sitting behind it - the same way Live Insights on
          the home page does it.

          Exactly that size, not larger: the picture is opaque and covers it, so
          what shows is the rim that the blur carries past the edge. A bigger
          sheet does not glow more, it glows further out, and then it reads as a
          lamp behind the page rather than as an edge catching the light.

          Only the pointer's position is inline; it changes on every mouse move
          and a stylesheet cannot follow a pointer. */}
      <div className="inlearn-course-frame">
        <span
          className="inlearn-course-glow"
          aria-hidden="true"
          style={{
            opacity: position.active ? 1 : 0,
            /* Stronger than Live Insights' 0.7, and holding its colour further
               out before it fades. Both make the light brighter without making
               it reach further: how far it reaches is the blur and the inset in
               the stylesheet, and those have to stay where they are or the row
               clips the rim into a straight line again. */
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 1.00), transparent 90%)`,
          }}
        />

        <div className="inlearn-course-media">
          {/* The cards already on screen load straight away; the ones waiting
              off the side wait with them. lazy on every card means the four a
              visitor is looking at only start downloading once something else
              has finished, which is the wait that showed. */}
          <img
            src={course.image}
            alt={course.imageAlt || ""}
            loading={isVisible ? "eager" : "lazy"}
            fetchPriority={isVisible ? "high" : "auto"}
          />

          {/* One control in two states rather than two elements swapped over:
              the circle is the pill with its label collapsed, so the green
              shape grows out of itself instead of one thing replacing
              another. */}
          <span className="inlearn-course-more" aria-hidden="true">
            <span className="inlearn-course-more-label">{readMore}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
              <path
                d="M9 4l8 8-8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="inlearn-course-body">
        <h3 className="inlearn-course-title">{course.title}</h3>
        <p className="inlearn-course-summary">{course.summary}</p>

        <ul className="inlearn-course-meta">
          {course.date ? (
            <li>
              <CalendarIcon />
              <span>{course.date}</span>
            </li>
          ) : null}
          {course.effort ? (
            <li>
              <ClockIcon />
              <span>{course.effort}</span>
            </li>
          ) : null}
        </ul>
      </div>
    </Wrapper>
  );
}

/* Inline SVG rather than two more files: each is a dozen characters of path
   data, they take the card's own colour through currentColor, and a file each
   would be two more requests for something this small. */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 10h17M8 3.5v3M16 3.5v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CourseCard;
