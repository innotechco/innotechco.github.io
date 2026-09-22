import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";

import {routes} from "../../../app/routes.js";

/* Addresses that are sections of one page rather than pages of their own.
 *
 * The dashboard is a panel on the left and a section on the right: pressing
 * Courses when Bill was open changes the right-hand half and nothing else, and
 * the panel that was pressed does not move. Sending the window to the top there
 * is the page yanking itself away from somebody who is reading it - they were
 * halfway down a list, they pressed something in a menu that stayed put, and
 * the floor moved.
 *
 * Arriving at the dashboard from anywhere else is still a new page and still
 * starts at the top. It is only movement WITHIN one of these that is left
 * alone, which is why the rule needs the address being left as well as the one
 * being arrived at. */
const IN_PAGE_SECTIONS = [routes.inlearnDashboard];

function isSameSectionMove(from, to) {
  if (from === null) return false;

  return IN_PAGE_SECTIONS.some(
    (root) => from.startsWith(root) && to.startsWith(root),
  );
}

/* A new page starts at the top, and gets there without being watched.

   "instant" rather than "auto", and the difference is a bug this already had:
   "auto" does not mean "jump", it means "use whatever scroll-behavior the
   element has" - and html carries scroll-behavior: smooth so that anchor links
   glide. So opening a new page from halfway down an old one animated the
   visitor all the way back up, on a page they had not seen yet and through
   content that had nothing to do with where they came from.

   SiteScrollbar hit the same trap while dragging its thumb and says so in its
   own comment. This is the other place that has to know. */
function ScrollToTop() {
  const {pathname} = useLocation();
  /* null until the first move, so the first paint is not mistaken for one. */
  const previousPathname = useRef(null);

  useEffect(() => {
    const from = previousPathname.current;
    previousPathname.current = pathname;

    if (isSameSectionMove(from, pathname)) return;

    window.scrollTo({top: 0, left: 0, behavior: "instant"});
  }, [pathname]);

  return null;
}

export default ScrollToTop;
