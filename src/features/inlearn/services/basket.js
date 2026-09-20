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

function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    /* Anything could be in storage: a half-written value, something from an
       older version of this code, or a person experimenting in devtools. */
    return Array.isArray(parsed)
      ? parsed.filter((line) => line && typeof line.id === "string")
      : [];
  } catch {
    /* Private windows and cleared site data both land here. */
    return [];
  }
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
