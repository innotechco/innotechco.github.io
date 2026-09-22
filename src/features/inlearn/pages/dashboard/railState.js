/* Whether the rail is folded away, remembered on this device.
 *
 * It is a preference rather than state: somebody who folds it away to read a
 * course does not want it back the next time they open the dashboard. The
 * shell keeps it in React state while the page is open; this is only what
 * survives a reload.
 *
 * Wrapped, like everything else that touches storage here: a private window,
 * cleared site data or a blocked storage API all throw, and none of them
 * should take the dashboard down with them.
 */

const STORAGE_KEY = "inlearn-dashboard-rail";

/* Below this the rail starts folded. The sections on the right are the point
   of the page, and on a phone an open rail would be most of the screen before
   any of them is drawn - so the first answer there is the thin one, and the
   visitor opens it if they want it.
 *
 * Read once, when the dashboard mounts. It is not a live media query on
 * purpose: once somebody has folded the rail or opened it, that is their
 * decision, and having it undone by turning a tablet on its side would be the
 * page arguing with them. */
const NARROW = 900;

export function readRailCollapsed() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "collapsed") return true;
    if (stored === "open") return false;
  } catch {
    /* Private windows and cleared site data both land here. */
  }

  return window.innerWidth < NARROW;
}

export function saveRailCollapsed(isCollapsed) {
  try {
    window.localStorage.setItem(STORAGE_KEY, isCollapsed ? "collapsed" : "open");
  } catch {
    /* Storage can be blocked outright; the rail still folds for this visit. */
  }
}
