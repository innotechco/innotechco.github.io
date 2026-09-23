import {getSession} from "./authService.js";
import {fetchMyCourses} from "./learning.js";

const EMPTY = [];
const listeners = new Set();

let owned = EMPTY;
let loading = null;

function publish(next) {
  const unique = [...new Set(Array.isArray(next) ? next.filter(Boolean) : [])];
  owned = unique.length ? unique : EMPTY;
  for (const listener of listeners) listener();
}

export function getOwnedCourseIds() {
  return owned;
}

export function getServerOwnedCourseIds() {
  return EMPTY;
}

export function subscribeToOwnedCourses(listener) {
  listeners.add(listener);
  loadOwnedCourses();
  return () => listeners.delete(listener);
}

export function loadOwnedCourses({force = false} = {}) {
  if (!getSession()) {
    loading = null;
    if (owned.length) publish(EMPTY);
    return Promise.resolve(EMPTY);
  }

  if (loading && !force) return loading;

  loading = fetchMyCourses()
    .then((answer) => {
      publish(answer?.owned);
      return owned;
    })
    .catch(() => owned)
    .finally(() => {
      loading = null;
    });

  return loading;
}

export function refreshOwnedCourses() {
  return loadOwnedCourses({force: true});
}

export function clearOwnedCourses() {
  loading = null;
  if (owned.length) publish(EMPTY);
}
