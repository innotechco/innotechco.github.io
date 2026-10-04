import {GlobeIcon, PersonPinIcon, ScreenIcon} from "./courseIcons.jsx";

/* Which mark and which word a mode carries, named once, so the page never asks
   "is this online" in three different places - and so that adding a fourth way
   of teaching is one entry here rather than three new branches.

   Its own file because it is data rather than a component, and a module that
   exports both stops hot reloading from working. */

/* `hasLocation` and `hasPlatform` are two flags rather than one word naming
   which box to draw, because they answer a question each: is there a place to
   walk into, and is there somewhere to log in to. A course that is taught in a
   room AND streamed is a real thing, and when one arrives it is this table
   that says so rather than the page learning a fourth name.

   They are never both true today. Online is somewhere you log in, in-person is
   somewhere you go, and offline is a recording that is neither. */
export const MODES = {
  online: {
    label: "Online",
    Icon: GlobeIcon,
    hasLocation: false,
    hasPlatform: true,
    sessionsLabel: "Online Sessions:",
  },
  onsite: {
    label: "In-Person",
    Icon: PersonPinIcon,
    hasLocation: true,
    hasPlatform: false,
    sessionsLabel: "In-Person Sessions:",
  },
  /* Offline is left exactly as it was found, wording included. The label below
     is the one every mode used to share, and it reads oddly over a recording
     that nobody attends - but changing it was not asked for, and a recorded
     course is the one mode this work was told not to touch. */
  offline: {
    label: "Offline",
    Icon: ScreenIcon,
    hasLocation: false,
    hasPlatform: false,
    sessionsLabel: "In-Person Sessions:",
  },
};
