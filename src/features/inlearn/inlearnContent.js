/* Reads the copy for the language in use and hands back one object per page.

   import.meta.glob with eager: true is what makes this work on static hosting:
   Vite resolves every locale at build time, so the three translations ship as
   part of the bundle and no request has to succeed for the page to have words.

   localizedModule falls back to English when a translation is missing, so a
   half-translated locale shows English sentences rather than blank space. */

import {getCatalogueSnapshot} from "./services/catalogueStore.js";
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
/* `remote` is the catalogue Strapi sent, and it is a parameter rather than
   something this function reaches for on its own.
 *
 * A page works its list out inside a useMemo, and a memo can only be told to
 * recompute by naming what it depends on. Hidden module state cannot be named,
 * so it would have gone on drawing the bundled copy after Strapi had answered.
 * Passed in, it is an ordinary dependency and the page redraws.
 *
 * It still defaults to the store, for the callers that are not React - the
 * build script among them. */
export function getInlearnCourses(remote = getCatalogueSnapshot()) {
  const bundled = localizedModule(
    inlearnModules(),
    "../../content/en/pages/inlearn/all-courses.json",
  );

  /* Strapi owns the courses, the filter buttons and the teachers. Everything
     else in this file - the headings, the words for the modes, the labels in
     the detail box - is page copy and stays with the page.

     Null until the request has answered, and null again if it never does, in
     which case what follows runs on the copy the site shipped with. */
  const catalogue = remote
    ? {...bundled, courses: remote.courses, tags: remote.tags, instructors: remote.instructors}
    : bundled;

  return {
    ...catalogue,
    courses: (catalogue.courses ?? []).map((course) => ({
      ...course,
      /* A picture uploaded in the admin panel wins; a course that has none yet
         falls back to the placeholder the site ships with, so a card is never
         an empty frame while somebody is still gathering the artwork. */
      image: course.image || courseImages[course.id] || courseImageFallback,
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
        {
          ...instructor,
          id,
          image: instructor.image || instructorImages[id] || instructorImageFallback,
        },
      ]),
    ),
  };
}

/* One course, with everything its own page draws already joined up: the
   instructor, the words for its categories, and the courses it points at.

   Resolved here rather than in the page because every one of those joins is a
   lookup into the same catalogue, and a page that does its own lookups is a
   page that has to know how the catalogue is shaped. */
export function getInlearnCourse(slug, remote) {
  const catalogue = getInlearnCourses(remote);
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

/* The basket, joined up: the words for the page, and the ids in this device's
   storage turned into the courses they point at.

   The lines are resolved here rather than in the page for the same reason the
   course page's joins are: a page that looks courses up itself is a page that
   has to know how the catalogue is shaped.

   An id in storage that no longer exists in the catalogue is dropped. That
   happens when a course is retired while it sits in somebody's basket, and a
   row with no title and no price is worse than no row.

   The total is added up here too - and it is a DISPLAY total only. When Strapi
   arrives it is handed the ids and works out what they really cost; nothing
   this function returns is ever what somebody is charged. */
export function getInlearnBasket(lines, remote) {
  const copy = localizedModule(
    inlearnModules(),
    "../../content/en/pages/inlearn/basket.json",
  );
  const catalogue = getInlearnCourses(remote);
  const byId = new Map(catalogue.courses.map((course) => [course.id, course]));

  const items = (lines ?? [])
    .map((line) => byId.get(line.id))
    .filter(Boolean);

  const subtotal = items.reduce((sum, course) => sum + (course.price ?? 0), 0);

  /* Tax is zero and has a line of its own from the first day.

     It is written as a number here rather than left out, because a total that
     grows a new row later is a layout nobody has looked at; one that starts
     with the row and changes the figure is a number. When tax becomes real it
     arrives from the CMS - by rate, most likely by region - and this is the
     one line that changes. */
  const tax = 0;

  return {
    copy,
    items,
    currency: catalogue.currency,
    subtotal,
    tax,
    grandTotal: subtotal + tax,
  };
}

export function getInlearnFirstPage(remote) {
  const page = localizedModule(
    inlearnModules(),
    "../../content/en/pages/inlearn/first-page.json",
  );
  const catalogue = getInlearnCourses(remote);

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

