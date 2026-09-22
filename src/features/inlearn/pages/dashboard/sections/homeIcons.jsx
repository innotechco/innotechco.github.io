/* The three marks above the figures on the dashboard's first page.
 *
 * Drawn here rather than imported as files for the same reason the rail's and
 * the Courses page's are: they take their colour from the text beside them,
 * which is what lets one mark be black on a pale card and white on the same
 * card hovered, without a second copy of it existing.
 *
 * Their own file rather than an addition to courseIcons: these three say what
 * a NUMBER counts, while those say how a course is taught or what a session
 * carries. A file that holds both would be a file about nothing.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/* Progress: a tick inside a ring, because the figure beside it is how much of
   the way round somebody is rather than a count of anything. */
export function ProgressIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.2 12.3l2.6 2.6 5-5.2" />
    </svg>
  );
}

/* Sessions finished: a bag, the same mark the bills carry, because a finished
   session is a thing collected rather than a thing measured. */
export function CompletedIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M4.6 8h14.8l-1 11.2a1.8 1.8 0 0 1-1.8 1.6H7.4a1.8 1.8 0 0 1-1.8-1.6z" />
      <path d="M9 8V6.4a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

/* Active courses: an open book - the one mark here that means a course rather
   than a quantity of them. */
export function ActiveCoursesIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 7.4v12" />
      <path d="M12 7.4C10.4 6.1 8.4 5.5 5.8 5.5H3.4v12h2.4c2.6 0 4.6.6 6.2 1.9" />
      <path d="M12 7.4c1.6-1.3 3.6-1.9 6.2-1.9h2.4v12h-2.4c-2.6 0-4.6.6-6.2 1.9" />
    </svg>
  );
}
