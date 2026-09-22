import {useEffect} from "react";
import {useLocation} from "react-router-dom";

/* A new page starts at the top, and gets there without being watched.

   "instant" rather than "auto", and the difference is the whole bug: "auto"
   does not mean "jump", it means "use whatever scroll-behavior the element
   has" - and html carries scroll-behavior: smooth so that anchor links glide.
   So opening a new page from halfway down an old one animated the visitor all
   the way back up, on a page they had not seen yet and through content that
   had nothing to do with where they came from.

   SiteScrollbar hit the same trap while dragging its thumb and says so in its
   own comment. This is the other place that has to know. */
function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: "instant"});
  }, [pathname]);

  return null;
}

export default ScrollToTop;
