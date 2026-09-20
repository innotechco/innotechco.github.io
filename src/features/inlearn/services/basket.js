/* What is in the basket, and nothing else.

   It holds course ids and quantities - never a price, never a total. A price
   that travels through the browser is a price a visitor can edit, so when the
   basket page and the checkout arrive, Strapi will be handed these ids and will
   work out what they cost. Keeping that rule from the first line means the
   basket does not have to be rewritten to obey it later.

   localStorage rather than a server, for now, and deliberately honest about it:
   this is a real basket that really persists on this device. Nothing here
   pretends anything was bought. */

const STORAGE_KEY = "inlearn-basket";

/* Every component that shows the basket - the navbar's count, the buy button's
   own state - has to hear about a change made anywhere else on the page.
   storage events only fire in OTHER tabs, so the page needs its own signal. */
const listeners = new Set();

/* One empty array, shared. useSyncExternalStore compares snapshots with
   Object.is, so handing back a fresh [] every time means "it changed" every
   time - and that is an infinite render, not an empty basket. */
const EMPTY = [];

/* The parse is cached against the exact text it came from.

   read() has to return the SAME array when nothing has changed. The navbar got
   away without this because it reads a count - a number compares equal to
   itself. The basket page reads the lines, and a new array every call made
   React re-render for ever: "Maximum update depth exceeded".

   The cache key is the raw string, so a change made in another tab (which
   arrives as a storage event) invalidates it exactly as a change made here
   does. */
let cachedRaw = null;
let cachedLines = EMPTY;

function read() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    /* Private windows and cleared site data both land here. */
    return EMPTY;
  }

  if (raw === cachedRaw) return cachedLines;

  let lines;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    /* Anything could be in storage: a half-written value, something from an
       older version of this code, or a person experimenting in devtools. */
    lines = Array.isArray(parsed)
      ? parsed.filter((line) => line && typeof line.id === "string")
      : EMPTY;
  } catch {
    lines = EMPTY;
  }

  cachedRaw = raw;
  cachedLines = lines;
  return lines;
}

/* The snapshot React uses while there is no window to read - one value, so it
   compares equal to itself. */
export function getServerBasket() {
  return EMPTY;
}

function write(lines) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* Storage can be blocked outright. The basket still works for this page. */
  }
  for (const listener of listeners) listener(lines);
  return lines;
}

export function getBasket() {
  return read();
}

export function getBasketCount() {
  return read().reduce((total, line) => total + (line.quantity ?? 1), 0);
}

export function isInBasket(courseId) {
  return read().some((line) => line.id === courseId);
}

/* Adding a course already in the basket does not add it twice. A course is
   bought once and watched for life - there is no second copy to own. */
export function addToBasket(courseId) {
  const lines = read();
  if (lines.some((line) => line.id === courseId)) return lines;
  return write([...lines, {id: courseId, quantity: 1}]);
}

export function removeFromBasket(courseId) {
  return write(read().filter((line) => line.id !== courseId));
}

/* Undo, after a removal. It takes the position back as well as the course,
   because addToBasket appends - and a line that reappears at the bottom of the
   list is not the same thing as a removal that never happened. Out-of-range
   indexes simply land at the end, which is what splice does anyway. */
export function restoreToBasket(courseId, index) {
  const lines = read();
  if (lines.some((line) => line.id === courseId)) return lines;

  const next = [...lines];
  next.splice(index ?? next.length, 0, {id: courseId, quantity: 1});
  return write(next);
}

export function subscribeToBasket(listener) {
  listeners.add(listener);

  /* A second tab is a different copy of this module with its own listeners, so
     its changes arrive as a storage event rather than through the set above. */
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) listener(read());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
