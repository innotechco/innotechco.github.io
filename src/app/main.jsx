import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import {loadLocaleOverrides} from "../shared/i18n/locale.js";
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

/* The app is imported rather than declared at the top, and that is the whole
 * mechanism behind only shipping one language.
 *
 * Every content module in the app reads its copy once, at module evaluation -
 * `export const {hero} = getIndustryPage("automotive")` and the like - through
 * localizedModule(), which is synchronous. For a reader of Arabic or Turkish
 * that copy has to already be in hand by the time those modules evaluate, and
 * an ES import evaluates the whole graph before the importing file's body
 * runs. So a static `import App` would evaluate every content module before
 * this line could fetch anything, and the override would arrive for an app
 * that had already read English.
 *
 * Importing it here instead puts the fetch first. English - the common visit,
 * and the bundled default - resolves immediately and pays nothing for this.
 */
async function start() {
  await loadLocaleOverrides();

  const [{default: App}, {LanguageProvider}] = await Promise.all([
    import("./App.jsx"),
    import("./providers/language/LanguageContext.jsx"),
  ]);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider><App /></LanguageProvider>
    </BrowserRouter>,
  );
}

start();
