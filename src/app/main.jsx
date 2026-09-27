import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import App from "./App.jsx";
import {LanguageProvider} from "./providers/language/LanguageContext.jsx";
import "../index.css";

/* Where a page opens is this app's decision, not the browser's.
 *
 * Left alone, scrollRestoration is "auto": on a reload the browser puts the
 * window back to the offset it remembers. On a page whose height is settled
 * that is a kindness. On this one it is a guess made too early - the route's
 * chunk has not mounted and the pictures have not arrived, so the document is
 * a fraction of its final height, and an offset from the full-height page is
 * clamped to the short one's maximum. That maximum is the bottom. Somebody
 * refreshing halfway down is dropped at the end of a page that is still
 * building itself.
 *
 * And it was never the browser's decision to make here anyway: ScrollToTop
 * already puts every new address at the top, including the ones reached with
 * Back and Forward. All "auto" added was a second opinion, arriving late
 * enough to overrule the first.
 *
 * Set here rather than in a component because it has to be true before the
 * first render, and it is a statement about the document rather than about
 * anything on it.
 */
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <LanguageProvider><App /></LanguageProvider>
  </BrowserRouter>,
);
