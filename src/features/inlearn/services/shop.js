import {API_URL} from "./auth/client.js";
import {authorizedFetch} from "./auth/tokens.js";

/* Prices, quotes and orders - everything with money in it.
 *
 * The catalogue in this repo still owns what a course IS: its title, its
 * picture, what it teaches. What it costs is the server's, because the price
 * is the one field that has to be the same number in two places at once - the
 * one shown to somebody, and the one they are charged - and because the person
 * who sets prices works in the admin panel rather than in this repo.
 *
 * Prices are not duplicated in the bundled JSON. Until Strapi answers, a
 * course can still be read but it has no price and cannot be checked out. That
 * is preferable to printing a stale figure that differs from the one the
 * server will charge.
 */

async function readProblem(response) {
  const payload = await response.json().catch(() => null);
  return payload?.error?.message || "Something went wrong. Try again.";
}

/* ------------------------------------------------------------ the price list */

/* The same store shape the basket and the saved courses use, so the pages
   subscribe to it the same way they subscribe to those. */
const EMPTY = {};
const listeners = new Set();

let prices = EMPTY;
let loading = null;

function publish(next) {
  prices = next;
  for (const listener of listeners) listener();
}

export function getPrices() {
  return prices;
}

/* The snapshot a server render sees. It has never fetched anything, so it is
   the empty one. */
export function getServerPrices() {
  return EMPTY;
}

export function subscribeToPrices(listener) {
  listeners.add(listener);
  /* Asked for on the first subscription rather than when this module loads:
     a page with no prices on it should not be fetching any. */
  loadPrices();
  return () => listeners.delete(listener);
}

/* Once, ever. Several cards subscribing at the same moment must not become
   several requests, and a failure is not retried in a loop. */
export function loadPrices() {
  if (loading || !API_URL) return loading;

  loading = fetch(`${API_URL}/api/inlearn/prices`)
    .then((response) => (response.ok ? response.json() : null))
    .then((payload) => {
      if (payload?.prices) publish(payload.prices);
    })
    .catch(() => {
      /* Left empty. A missing price cannot accidentally become a stale one. */
    });

  return loading;
}

/* What to print for one course.
 *
 * The live price table is authoritative. `course.price` remains a compatibility
 * fallback for the Strapi catalogue response, whose public catalogue currently
 * carries the same server-owned number; bundled JSON no longer supplies it. */
export function priceOf(course, table = prices) {
  const live = table?.[course?.id];
  return {
    price: live?.price ?? course?.price,
    compareAtPrice: live?.compareAtPrice ?? course?.compareAtPrice,
  };
}

export function sumPrices(courses, table = prices) {
  return courses.reduce((total, course) => total + (priceOf(course, table).price ?? 0), 0);
}

/* ------------------------------------------------- quoting, buying, and bills */

async function post(path, body) {
  let response;
  try {
    response = await authorizedFetch(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}

/* The titles travel with the ids for one reason: the receipt.
 *
 * The server does not hold the words, so a line on a finished invoice would
 * otherwise read "mining-automation-safety". They are never part of the sum -
 * the price is looked up by id - so sending them cannot change what anything
 * costs. */
function titlesOf(courses) {
  return Object.fromEntries(courses.map((course) => [course.id, course.title]));
}

export function quoteBasket(courses, code) {
  return post("/api/inlearn/quote", {
    courseIds: courses.map((course) => course.id),
    titles: titlesOf(courses),
    code: code || "",
  });
}

export function placeOrder(courses, code) {
  return post("/api/inlearn/orders", {
    courseIds: courses.map((course) => course.id),
    titles: titlesOf(courses),
    code: code || "",
  });
}

/* Removing an order that was never paid. The server refuses a settled one, so
   this is not the only thing standing between a receipt and deletion. */
export async function deleteOrder(id) {
  let response;
  try {
    response = await authorizedFetch(`/api/inlearn/orders/${id}`, {method: "DELETE"});
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  return response.json();
}

export async function fetchOrders() {
  let response;
  try {
    response = await authorizedFetch("/api/inlearn/orders");
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (!response.ok) throw new Error(await readProblem(response));
  const payload = await response.json();
  return Array.isArray(payload?.orders) ? payload.orders : [];
}
