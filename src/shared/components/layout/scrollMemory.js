/* Where the page was when it was last reloaded.
 *
 * The browser used to do this itself - scrollRestoration is "auto" unless it
 * is told otherwise - and it did it badly here. It puts the window back as
 * soon as it has a document, which on this site is long before the document is
 * its final height: the route's chunk has not mounted and the pictures have
 * not arrived. An offset from the finished page, applied to a third of it, is
 * clamped to that third's maximum - and that maximum is the bottom. Refreshing
 * halfway down dropped you at the end of a page still building itself.
 *
 * So the browser is told not to (see main.jsx) and the position is put back
 * here instead, at the one moment it can be put back correctly: after the
 * first paint has settled, which is also while the boot curtain is still over
 * the screen. Nobody sees the jump, because it happens behind the curtain.
 *
 * Only a reload. Following a link is arriving somewhere new and starts at the
 * top, which is what ScrollToTop is for; Back and Forward already did too.
 */

const KEY = "innotech-scroll-memory";

/* sessionStorage, not localStorage: this is about the reload that is happening
   now, not about where somebody was last week. It should not outlive the tab,
   and on a shared computer it should not outlive it either. */
function read() {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? "null");
  } catch {
    /* Private mode, blocked storage, or something else wrote nonsense here.
       Not remembering is the normal outcome, not an error. */
    return null;
  }
}

export function rememberScroll(pathname) {
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({pathname, y: Math.round(window.scrollY)}),
    );
  } catch {
    /* Then the page opens at the top, which is where it opened before any of
       this existed. */
  }
}

export function forgetScroll() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing to do about it, and nothing depends on it having worked. */
  }
}

/* How far down this page was, if this is a reload OF THIS PAGE.
 *
 * The pathname is checked because a tab can be reloaded onto a different
 * address than the one that was saved - typing a new one into the bar is a
 * navigation, not a reload, but a saved entry left over from before would be
 * applied to it anyway.
 *
 * Returns 0 rather than null when there is nothing to restore, so the caller
 * has one number to act on rather than two cases.
 */
export function scrollToRestore(pathname) {
  const entry = read();
  if (!entry || entry.pathname !== pathname || !entry.y) return 0;

  const [navigation] = performance.getEntriesByType?.("navigation") ?? [];
  if (navigation && navigation.type !== "reload") return 0;

  return entry.y;
}
