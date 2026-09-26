/* Every image this module uses, re-exported from one place - the same shape as
   home.assets.js and who-we-are.assets.js.

   One door means one list: it is the only file that can answer "how many images
   does INLEARN carry, and is any of them unused?". Importing them from wherever
   they sit loses that answer. */

export {default as firstPageArcTopLeft} from "./assets/first-page/arc-top-left.webp";

/* The arc behind the dashboard rail. Supplied as a 3793px PNG and converted on
   the way in: 99KB became 27KB at 1600 wide, which is wider than it is ever
   drawn, and the shape is two flat tones with no detail to lose. */
export {default as dashboardCurve} from "./assets/dashboard-curve.webp";
export {default as firstPageArcRight} from "./assets/first-page/arc-right.webp";

/* One photograph stands in for every course until the real ones arrive. It is
   named placeholder rather than given a course's name so that nobody has to
   guess later which images are real: the day a course gets its own picture, it
   gets its own export beside this one and its own line in the config. */
export {default as coursePlaceholder} from "./assets/courses/placeholder.webp";

/* One drawing stands in for every instructor until the real portraits arrive -
   the same arrangement the courses have, and for the same reason: a placeholder
   that looks like a real photograph is one nobody notices is still a
   placeholder. */
export {default as instructorPlaceholder} from "./assets/instructors/placeholder.svg";

/* Standing in until the real photograph arrives. See the note inside the file
   itself for what replacing it involves. */
/* The real photograph now. The placeholder beside it is kept as the file it
   replaced, so the day this picture is swapped again there is something to
   compare against rather than a hole. */
export {default as learningSolutionsPhoto} from "./assets/first-page/learning-solutions.webp";
export {default as learningSolutionsPlaceholder} from "./assets/first-page/learning-solutions-placeholder.svg";
