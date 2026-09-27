import {useSyncExternalStore} from "react";

import {
  getPrices,
  getServerPrices,
  priceOf,
  subscribeToPrices,
} from "./services/shop.js";

/* What a course costs, from the one place that knows.
 *
 * Two answers can arrive: the catalogue carries a price when Strapi sends it,
 * and /api/inlearn/prices is a list of nothing but prices. They agree, and
 * asking for both is deliberate - the price list is a few hundred bytes and
 * answers on its own, so a page whose catalogue request is still in the air,
 * or whose catalogue never arrived and fell back to the copy the site ships
 * with, still shows the real figure rather than a gap.
 *
 * The bundled catalogue carries no prices at all, on purpose: a stale number
 * beside a button that charges a different one is worse than no number. That
 * is why this exists - without it, every price on the site is an empty space
 * after a label for as long as Strapi is unreachable.
 *
 * Subscribed to rather than read once, because the list arrives after the
 * first paint and the page has to redraw when it does.
 */
export function usePriceTable() {
  return useSyncExternalStore(subscribeToPrices, getPrices, getServerPrices);
}

export function useCoursePrice(course) {
  const table = usePriceTable();
  return priceOf(course, table);
}
