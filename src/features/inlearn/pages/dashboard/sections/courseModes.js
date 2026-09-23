import {GlobeIcon, PersonPinIcon, ScreenIcon} from "./courseIcons.jsx";

/* Which mark and which word a mode carries, named once, so the page never asks
   "is this online" in three different places - and so that adding a fourth way
   of teaching is one entry here rather than three new branches.

   Its own file because it is data rather than a component, and a module that
   exports both stops hot reloading from working. */
export const MODES = {
  online: {label: "Online", Icon: GlobeIcon, hasLocation: true},
  onsite: {label: "In-Person", Icon: PersonPinIcon, hasLocation: true},
  offline: {label: "Offline", Icon: ScreenIcon, hasLocation: false},
};
