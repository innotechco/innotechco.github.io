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
  instructorImageFallback,
  instructorImages,
  learningSolutionsImage,
} from "./inlearn.config.js";

/* How many of the catalogue's courses the first page's row carries. */
const TOP_COURSES_COUNT = 8;

/* Newest first. Sorted here rather than trusted from the file: the file is
   written in that order today, and the day it is filled from WordPress it will
   arrive in whatever order the API felt like.

   publishedAt is the field to sort on, not the written date beside it - that
   one is a sentence in three languages and sorts alphabetically. */
function newestFirst(courses) {
  return [...courses].sort((a, b) =>
    String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")),
  );
}

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
    /* The instructor is written once and pointed at from every course they
       teach, so their portrait is resolved here in one place rather than once
       per course. */
    instructors: Object.fromEntries(
      Object.entries(catalogue.instructors ?? {}).map(([id, instructor]) => [
        id,
        {...instructor, id, image: instructorImages[id] ?? instructorImageFallback},
      ]),
    ),
  };
}

/* One course, with everything its own page draws already joined up: the
   instructor, the words for its categories, and the courses it points at.

   Resolved here rather than in the page because every one of those joins is a
   lookup into the same catalogue, and a page that does its own lookups is a
   page that has to know how the catalogue is shaped. */
export function getInlearnCourse(slug) {
  const catalogue = getInlearnCourses();
  const course = catalogue.courses.find((entry) => entry.id === slug);

  if (!course) return {catalogue, course: null};

  const byId = new Map(catalogue.courses.map((entry) => [entry.id, entry]));
  const labelFor = (id) => catalogue.tags?.find((tag) => tag.id === id)?.label;

  return {
    catalogue,
    course: {
      ...course,
      instructor: catalogue.instructors[course.instructor] ?? null,
      /* The green chip is the category the course is filed under; the grey ones
         are the rest. Both come from the same list the All Courses filters use,
         so a category renamed there is renamed here. */
      categoryChips: (course.categories ?? [])
        .map((id) => ({id, label: labelFor(id), isPrimary: id === course.tag}))
        .filter((chip) => chip.label),
      /* Written as ids, resolved here. A card then reads its own title, price
         and picture from the course it points at - so changing what a card says
         means editing that course, never this one. */
      related: (course.related ?? [])
        .map((id) => byId.get(id))
        .filter(Boolean),
    },
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
      /* The corner controls say the same two words here as they do on All
         Courses, so they are taken from the catalogue rather than written into
         first-page.json as well - one owner, and a translator edits one line
         per locale instead of two. */
      save: catalogue.save,
      share: catalogue.share,
      /* The newest eight in the catalogue - that is what the row on the first
         page means. Which eight is a decision, so it lives here rather than in
         the section that draws them. */
      items: newestFirst(catalogue.courses).slice(0, TOP_COURSES_COUNT),
    },
    learningSolutions: page.learningSolutions
      ? {...page.learningSolutions, image: learningSolutionsImage}
      : null,
    decorations: inlearnConfig.firstPage.decorations,
    decorationsOnSmallScreens: inlearnConfig.firstPage.decorationsOnSmallScreens,
  };
}

