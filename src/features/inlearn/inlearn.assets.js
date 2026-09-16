/* Every image this module uses, re-exported from one place - the same shape as
   home.assets.js and who-we-are.assets.js.

   One door means one list: it is the only file that can answer "how many images
   does INLEARN carry, and is any of them unused?". Importing them from wherever
   they sit loses that answer. */

export {default as firstPageArcTopLeft} from "./assets/first-page/arc-top-left.webp";
export {default as firstPageArcRight} from "./assets/first-page/arc-right.webp";

/* One photograph stands in for every course until the real ones arrive. It is
   named placeholder rather than given a course's name so that nobody has to
   guess later which images are real: the day a course gets its own picture, it
   gets its own export beside this one and its own line in the config. */
export {default as coursePlaceholder} from "./assets/courses/placeholder.webp";
