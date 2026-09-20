import {Link} from "react-router-dom";

import {usePointerGlow} from "../../../shared/hooks/usePointerGlow.js";
import {
  BookmarkIcon,
  CalendarIcon,
  ChevronIcon,
  ClockIcon,
  GlobeIcon,
  OnSiteIcon,
  ShareIcon,
} from "./icons.jsx";

/* One course, as a card.

   It lives in components/ rather than beside the section that uses it because
   All Courses, Course Detail's related row and the dashboard all draw the same
   card. The shape of a course is defined here once, in the props it reads.

   Everything the hover does - the lift, the zoom, the blur, the label sliding
   out of the arrow - is CSS on .inlearn-course-card:hover. It is written that
   way so it also happens on keyboard focus, which a JavaScript mouseenter
   handler would miss, and so the reduced-motion block at the foot of the
   stylesheet can switch all of it off in one rule. */
function CourseCard({
  course,
  readMore,
  /* An in-site destination. A Link rather than a plain <a>, or every card press
     would reload the whole application to show a page it already has. */
  to,
  isVisible = false,
  /* "row" is the first page's carousel, as drawn: the picture, the words, and
     a Read more that grows out of its own circle.

     "grid" is All Courses, which adds the two controls in the corner and the
     line saying how the course is taught. They are not in the row's design, and
     a card that quietly grows a third line would push the row's dates out of
     alignment with each other. */
  layout = "row",
  labels,
  onSave,
  onShare,
  isSaved = false,
}) {
  const Wrapper = to ? Link : "article";
  const linkProps = to ? {to} : {};
  const {position, handlers} = usePointerGlow();
  const hasActions = layout === "grid";

  return (
    <Wrapper
      className={`inlearn-course-card is-${layout}`}
      {...linkProps}
      {...handlers}
    >
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

          {/* The two corner controls, on one green panel rather than two loose
              circles: that is how they are drawn, and it is also what lets them
              slide in as a single piece.

              Real buttons, not decorated spans: they are separate actions from
              opening the course, they have to be reachable by keyboard, and a
              screen reader has to be told which is which. Both stop the click
              from reaching the card, because the card is the link. */}
          {hasActions ? (
            <div className="inlearn-course-actions">
              <button
                type="button"
                className={`inlearn-course-action${isSaved ? " is-on" : ""}`}
                aria-pressed={isSaved}
                aria-label={labels?.save}
                title={labels?.save}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSave?.(course);
                }}
              >
                <BookmarkIcon filled={isSaved} />
              </button>

              <span className="inlearn-course-action-divider" aria-hidden="true" />

              <button
                type="button"
                className="inlearn-course-action"
                aria-label={labels?.share}
                title={labels?.share}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onShare?.(course);
                }}
              >
                <ShareIcon />
              </button>
            </div>
          ) : null}

          {/* One control in two states rather than two elements swapped over:
              the circle is the pill with its label collapsed, so the green
              shape grows out of itself instead of one thing replacing
              another. */}
          <span className="inlearn-course-more" aria-hidden="true">
            <span className="inlearn-course-more-label">{readMore}</span>
            <ChevronIcon size={16} strokeWidth={2} />
          </span>
        </div>
      </div>

      <div className="inlearn-course-body">
        <h3 className="inlearn-course-title">{course.title}</h3>
        <p className="inlearn-course-summary">{course.summary}</p>

        <ul className="inlearn-course-meta">
          {course.date ? (
            <li>
              <CalendarIcon size={15} />
              <span>{course.date}</span>
            </li>
          ) : null}
          {course.effort ? (
            <li>
              <ClockIcon size={15} />
              <span>{course.effort}</span>
            </li>
          ) : null}
          {hasActions && course.modeLabel ? (
            <li>
              {/* The mark follows the meaning: a place for a course taught in
                  one, a globe for one taught over the network. */}
              {course.mode === "on-site" ? <OnSiteIcon /> : <GlobeIcon size={15} />}
              <span>{course.modeLabel}</span>
            </li>
          ) : null}
        </ul>
      </div>
    </Wrapper>
  );
}

export default CourseCard;
