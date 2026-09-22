/* The six marks in the dashboard rail.

   PLACEHOLDERS. Every one of these is drawn here to the right weight and the
   right box so the rail can be built and judged, and every one is meant to be
   replaced by the real artwork. When that arrives, this is the only file that
   changes: the rail names its icons through dashboard.config.js and never
   reaches for a file of its own.

   They share one shape on purpose, so that swapping any single one in does not
   leave it looking like a different set:

     a 20x20 box, a 24-unit viewBox, strokes rather than fills, 1.6 wide with
     round caps and joins, and currentColor throughout - which is what lets one
     mark be white on green, black on grey and red on white without a second
     copy of it existing anywhere. */

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/* Home: four panes, the dashboard's own sign. */
export function HomeIcon() {
  return (
    <svg {...base}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

/* Bill: a receipt with its torn edge, rather than a card or a coin - what this
   page lists is orders, not a means of payment. */
export function BillIcon() {
  return (
    <svg {...base}>
      <path d="M5 3.5h14v17l-2.8-1.8-2.8 1.8-2.8-1.8L7.8 20.5 5 18.7z" />
      <path d="M9 9h6M9 13h4" />
    </svg>
  );
}

/* Courses: an open book. */
export function CoursesIcon() {
  return (
    <svg {...base}>
      <path d="M12 6.5C10.4 5.2 8.4 4.6 6 4.6H3.5v13H6c2.4 0 4.4.6 6 1.9" />
      <path d="M12 6.5c1.6-1.3 3.6-1.9 6-1.9h2.5v13H18c-2.4 0-4.4.6-6 1.9" />
      <path d="M12 6.5v13.9" />
    </svg>
  );
}

/* Save: a bookmark, the same mark the course cards already use for saving. */
export function SaveIcon() {
  return (
    <svg {...base}>
      <path d="M6 3.8h12v17l-6-4.2-6 4.2z" />
    </svg>
  );
}

/* Profile: a person. */
export function ProfileIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="8" r="3.9" />
      <path d="M4.5 20.5c0-3.6 3.4-6.1 7.5-6.1s7.5 2.5 7.5 6.1" />
    </svg>
  );
}

/* Exit: the arrow leaves the frame. It points left because this is the one row
   that takes the visitor out rather than further in. */
export function ExitIcon() {
  return (
    <svg {...base}>
      <path d="M14.5 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h8" />
      <path d="M18.5 12h-9" />
      <path d="M12.5 8 8.5 12l4 4" />
    </svg>
  );
}

/* The chevron on the row that is open. Not in the set above: it is not one of
   the six, it belongs to the rail itself. */
export function RailChevron() {
  return (
    <svg {...base} width={16} height={16}>
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

/* The three lines that fold the rail away and bring it back. Not one of the
   six either - it acts on the rail rather than naming a section - and it keeps
   the same box and stroke so it does not read as a different set. */
export function MenuIcon() {
  return (
    <svg {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/* The camera on the profile portrait. Filled rather than stroked, because it
   sits on a dark disc over the picture rather than in a row of line icons. */
export function CameraIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9.2 4h5.6l1.2 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4z" />
      <circle cx="12" cy="13" r="3.6" fill="#050505" />
    </svg>
  );
}
