/* The marks the Courses page uses.
 *
 * Three of them say how a course is taught, and they are the difference
 * between the modes at a glance: a globe for something joined from anywhere, a
 * person for somewhere you walk into, a screen for something already recorded.
 * The rest label what a session carries.
 *
 * Drawn here rather than imported as files for the reason the rail's are: they
 * take their colour from the text around them, which is what lets one mark be
 * green in a row and white on a black button without a second copy existing. */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function GlobeIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 2.6 15.4 0 18-2.6-2.6-2.6-15.4 0-18z" />
    </svg>
  );
}

export function PersonPinIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="9.2" r="2.3" />
      <path d="M8.4 14.6a4.2 4.2 0 0 1 7.2 0" />
    </svg>
  );
}

export function ScreenIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
      <path d="m10.8 8.6 3.6 1.9-3.6 1.9z" />
    </svg>
  );
}

export function MapPinIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function CalendarIcon({size = 14}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

export function ClockIcon({size = 14}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function SpeakerIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
      <path d="M15.6 9.3a4 4 0 0 1 0 5.4M18.2 6.9a7.4 7.4 0 0 1 0 10.2" />
    </svg>
  );
}

export function PlayIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10.6 9.4 4.6 2.6-4.6 2.6z" />
    </svg>
  );
}

export function DocumentIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24">
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19" />
      <path d="M8.8 13h6.4M8.8 16.2h4.4" />
    </svg>
  );
}

export function ChevronIcon({size = 14, isOpen = false}) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        transform: isOpen ? "rotate(180deg)" : "none",
        transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function TickIcon({size = 15}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CloseIcon({size = 16}) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
