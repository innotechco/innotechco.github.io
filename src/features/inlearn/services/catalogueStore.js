import {isCatalogueEnabled, loadCatalogue} from "./catalogue.js";

/* Where the catalogue from Strapi is kept once it arrives.
 *
 * Every page that shows a course reads it through getInlearnCourses(), which
 * is an ordinary function rather than a hook - six pages call it, and some of
 * them from inside helpers that join a course to its instructor and its
 * related courses. Turning all of that asynchronous would have meant rewriting
 * each of them around a promise.
 *
 * So the answer is kept here instead, and the shell subscribes once. Until it
 * arrives, getInlearnCourses() hands back the copy bundled with the site; when
 * it arrives the shell re-renders and the same function hands back Strapi's.
 * The pages never learn that anything changed, which is the point.
 *
 * The bundled copy is a failure fallback, not a first paint: the site opens
 * with the courses it shipped with, and a visitor with no connection to the
 * API sees a catalogue rather than an empty page.
 */

let snapshot = null;
let status = "idle";
const listeners = new Set();

function announce() {
  for (const listener of listeners) listener();
}

export function subscribeToCatalogue(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* The same object every time until it actually changes. useSyncExternalStore
   compares by identity and would loop forever on a fresh one each call. */
export function getCatalogueSnapshot() {
  return snapshot;
}

export function getCatalogueStatus() {
  return status;
}

/* Asked for once per language. Called from the shell on mount, and again if
   the language changes - the catalogue is translated, so a visitor switching
   to Arabic needs Arabic courses, not the English ones they already have.
 *
 * A failure is remembered as a failure rather than retried on every render:
 * the bundled copy is already on screen and is a reasonable thing to be
 * looking at, and a page that retries a dead server on every paint is a page
 * that makes the outage worse.
 */
export function ensureCatalogue(locale) {
  if (!isCatalogueEnabled()) {
    status = "off";
    return;
  }

  status = "loading";

  loadCatalogue(locale)
    .then((catalogue) => {
      snapshot = catalogue;
      status = "ready";
      announce();
    })
    .catch(() => {
      snapshot = null;
      status = "error";
      announce();
    });
}
