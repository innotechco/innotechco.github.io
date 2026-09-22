import {routes} from "../../../../app/routes.js";
import {
  BillIcon,
  CoursesIcon,
  ExitIcon,
  HomeIcon,
  ProfileIcon,
  SaveIcon,
} from "./icons.jsx";

/* The rail, written once.

   The order here is the order on screen, and the icon a row carries is named
   here rather than reached for inside the row - so replacing the placeholder
   artwork in icons.jsx touches nothing else, and adding a seventh section is
   one entry rather than a new branch in the markup.

   `end` marks the row that must only light up on its own address. Without it
   the dashboard's own path is a prefix of every other one, and home would stay
   green while the visitor is reading their bill. */
export const dashboardSections = [
  {id: "home", label: "home", to: routes.inlearnDashboard, Icon: HomeIcon, end: true},
  {id: "bill", label: "Bill", to: routes.inlearnDashboardBill, Icon: BillIcon},
  {id: "courses", label: "Courses", to: routes.inlearnDashboardCourses, Icon: CoursesIcon},
  {id: "save", label: "Save", to: routes.inlearnDashboardSave, Icon: SaveIcon},
  {id: "profile", label: "Profile", to: routes.inlearnDashboardProfile, Icon: ProfileIcon},
];

/* Not one of the sections: it goes nowhere and it ends the session, so it is a
   button rather than a link and it is kept out of the list the rail maps over
   - a row that can never be "current" does not belong among rows that can. */
export const dashboardExit = {id: "exit", label: "Exit", Icon: ExitIcon};

/* The letter in the circle. First letter of the name the site already shows,
   falling back to the email, and to a shape rather than an empty circle when
   there is neither.

   Deliberately not initials from two words: "Reza Hosein pour" would give RH
   or RHP depending on how the name is spaced, and a person who writes their
   name in one word would get one letter while their neighbour gets three. One
   letter is the same promise for everybody. */
export function avatarLetter(session) {
  const source = session?.displayName || session?.user?.email || "";
  const first = source.trim().charAt(0);
  return first ? first.toUpperCase() : "?";
}
