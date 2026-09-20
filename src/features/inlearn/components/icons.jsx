/* Every small mark INLEARN draws, in one file.

   They are components rather than .svg files on purpose: each is a line or two
   of path data, and a file each would be one more request for something this
   small. Written here they are inlined into the bundle, so the bundle is the
   same size it was when each card carried its own copy - and now there is one
   copy to edit.

   (The word for a picture element is left out of this comment deliberately:
   the lazy-loading test scans raw source for it and a comment containing it
   fails the test. That has happened before.)

   Every one takes its colour from the text around it through currentColor, so
   a card, a spec row and a chip all draw the same mark in their own colour.

   Size is a prop because the same mark is drawn at three sizes: 15px beside a
   card's date, 16px in a course's specification list, 14px in the mode pill.
   The default is the most common one. */

export function CalendarIcon({size = 16}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
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

export function ClockIcon({size = 16}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
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

/* A place, for a course taught in one. */
export function OnSiteIcon({size = 15}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* A globe, for one taught over the network. */
export function GlobeIcon({size = 15}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* Filled once the course is saved, so the state is visible without colour
   alone carrying it. */
export function BookmarkIcon({filled, size = 17}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareIcon({size = 17}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="18" cy="5.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="18.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m8.4 10.8 7.2-4.1M8.4 13.2l7.2 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CertificateIcon({size = 16}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LanguageIcon({size = 16}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M3.5 6h9M8 4v2c0 4-2 6.5-4.5 8M6 10c1 2.5 3 4.5 6 5.5M13 20l4-10 4 10M14.5 17h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TagIcon({size = 16}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d="M11.5 3.5H20v8.5l-8.7 8.7a1.5 1.5 0 0 1-2.1 0l-6.4-6.4a1.5 1.5 0 0 1 0-2.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16.2" cy="7.8" r="1.6" fill="currentColor" />
    </svg>
  );
}

/* The chevron a carousel arrow carries. Separate from the button around it
   because the "Read more" control on a card draws the same mark at its own
   size with no button of its own. */
export function ChevronIcon({direction = "next", size = 20, strokeWidth = 1.8}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        d={direction === "prev" ? "M15 4L7 12l8 8" : "M9 4l8 8-8 8"}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
