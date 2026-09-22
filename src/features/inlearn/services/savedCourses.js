/* Saved course ids, shared by every card and the signed-in Save page.

   This follows the basket's storage shape deliberately: until courses and
   profiles have a server model, the browser stores ids only. The catalogue is
   still the owner of titles, pictures and dates, so stale ids disappear from
   the page instead of preserving an old copy of a course. */

const STORAGE_KEY = "inlearn-saved-courses";
const listeners = new Set();
const EMPTY = [];

let cachedRaw = null;
let cachedIds = EMPTY;

function read() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedIds;
  }

  if (raw === cachedRaw) return cachedIds;

  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed)
      ? [...new Set(parsed.filter((id) => typeof id === "string"))]
      : EMPTY;
  } catch {
    cachedIds = EMPTY;
  }

  cachedRaw = raw;
  return cachedIds;
}

function write(ids, change) {
  cachedIds = ids;
  cachedRaw = JSON.stringify(ids);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    /* The current tab still keeps the state when storage is unavailable. */
  }
  for (const listener of listeners) listener(change);
  return ids;
}

export function getSavedCourses() {
  return read();
}

export function getServerSavedCourses() {
  return EMPTY;
}

export function isCourseSaved(courseId) {
  return read().includes(courseId);
}

export function toggleSavedCourse(courseId) {
  const ids = read();
  const saved = !ids.includes(courseId);
  const next = saved ? [...ids, courseId] : ids.filter((id) => id !== courseId);
  write(next, {courseId, saved});
  return saved;
}

export function subscribeToSavedCourses(listener) {
  listeners.add(listener);

  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    cachedRaw = null;
    listener(null);
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
