/* Reads the copy for the language in use and hands back one object per page.

   import.meta.glob with eager: true is what makes this work on static hosting:
   Vite resolves every locale at build time, so the three translations ship as
   part of the bundle and no request has to succeed for the page to have words.

   localizedModule falls back to English when a translation is missing, so a
   half-translated locale shows English sentences rather than blank space. */

import {localizedModule} from "../../shared/i18n/locale.js";
import {
  courseImageFallback,
  courseImages,
  inlearnConfig,
  learningSolutionsImage,
} from "./inlearn.config.js";

/* How many of the catalogue's courses the first page's row carries. */
const TOP_COURSES_COUNT = 8;

function inlearnModules() {
  return import.meta.glob("../../content/{en,ar,tr}/pages/inlearn/*.json", {
    eager: true,
    import: "default",
  });
}

/* Every course the module knows about, in one list, in one file per locale.

   The first page used to carry its own eight courses and All Courses would have
   carried sixteen, with the first eight written twice - two owners for the same
   sentences, and the day one of them is edited they disagree. The catalogue is
   the owner now; the first page takes the first eight from it.

   This is also the shape WordPress will fill later: one list of courses, each
   carrying the id of its tag. */
export function getInlearnCourses() {
  const catalogue = localizedModule(
    inlearnModules(),
    "../../content/en/pages/inlearn/all-courses.json",
  );

  return {
    ...catalogue,
    courses: (catalogue.courses ?? []).map((course) => ({
      ...course,
      image: courseImages[course.id] ?? courseImageFallback,
      /* The delivery mode is stored as an id and turned into words here, so a
         course carries no language of its own in that field and a translator
         edits one line per locale rather than sixteen. */
      modeLabel: catalogue.modes?.[course.mode] ?? "",
    })),
  };
}

export function getInlearnFirstPage() {
  const page = localizedModule(
    inlearnModules(),
    "../../content/en/pages/inlearn/first-page.json",
  );
  const catalogue = getInlearnCourses();

  return {
    ...page,
    topCourses: {
      ...page.topCourses,
      /* The row shows the head of the catalogue. Which eight is a decision, so
         it lives here rather than in the section that draws them. */
      items: catalogue.courses.slice(0, TOP_COURSES_COUNT),
    },
    learningSolutions: page.learningSolutions
      ? {...page.learningSolutions, image: learningSolutionsImage}
      : null,
    decorations: inlearnConfig.firstPage.decorations,
    decorationsOnSmallScreens: inlearnConfig.firstPage.decorationsOnSmallScreens,
  };
}

