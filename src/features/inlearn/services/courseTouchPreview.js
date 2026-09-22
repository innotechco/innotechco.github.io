/* Touch devices can preview one card at a time. This stays in memory: it is a
   momentary interaction state, not user data and not something a later visit
   should restore. */

const listeners = new Set();
let openCourseId = null;

export function getOpenCoursePreview() {
  return openCourseId;
}

export function getServerOpenCoursePreview() {
  return null;
}

export function openCoursePreview(courseId) {
  if (openCourseId === courseId) return;
  openCourseId = courseId;
  for (const listener of listeners) listener();
}

export function clearCoursePreview() {
  if (openCourseId === null) return;
  openCourseId = null;
  for (const listener of listeners) listener();
}

export function subscribeToCoursePreview(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
