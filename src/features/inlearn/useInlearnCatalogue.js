import {useSyncExternalStore} from "react";

import {getCatalogueSnapshot, subscribeToCatalogue} from "./services/catalogueStore.js";

/* Subscribes to the catalogue and hands back whatever is current.
 *
 * What it returns is rarely used. What it is FOR is to be named in the
 * dependency list of the useMemo beside it: every page that shows a course
 * works its list out once and remembers it, and a page that remembered the
 * bundled copy would keep drawing it after Strapi had answered. Naming this
 * is how a page says "and again when the catalogue changes".
 *
 * A hook per page rather than one subscription in the shell, because it is the
 * page's own memo that has to be told - a parent re-rendering does not make a
 * child recompute something it was asked to remember.
 */
export function useInlearnCatalogue() {
  return useSyncExternalStore(subscribeToCatalogue, getCatalogueSnapshot, getCatalogueSnapshot);
}
