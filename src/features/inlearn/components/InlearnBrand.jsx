import {Link} from "react-router-dom";

import {routes} from "../../../app/routes.js";

/* The pill rests as the INLEARN lockup. Pointing at it fades the wording out
   and draws the pill in, which brings the INNOTECH mark alongside so the two
   brands sit side by side - INLEARN opens the academy, INNOTECH goes back to
   innotech.global. Each mark greens under its own pointer and names itself in a
   small tag underneath, so it is clear which one is about to be clicked.

   The open state is pure CSS (:hover / :focus-within) rather than React state:
   a resize or re-render can leave a JS flag disagreeing with where the pointer
   actually is, and keyboard users get the same reveal by tabbing in for free.

   Both marks are painted with CSS masks rather than image elements, which
   cannot be recoloured; this way the same SVG file the designer ships is what
   turns green, and updating the file updates the navbar. */
function InlearnBrand() {
  return (
    <div className="inlearn-brand">
      <Link
        to={routes.inlearnAcademy}
        className="inlearn-brand-link"
        aria-label="INLEARN Academy home"
      >
        <span className="inlearn-brand-mark inlearn-brand-mark-inlearn" aria-hidden="true" />
        <span className="inlearn-brand-tip" aria-hidden="true">INLEARN</span>
      </Link>

      <span className="inlearn-brand-wordmark" aria-hidden="true">
        <strong>INLEARN</strong>
        <small>BY INNOTECH</small>
      </span>

      <span className="inlearn-brand-divider" aria-hidden="true" />

      <Link
        to={routes.home}
        className="inlearn-brand-link inlearn-brand-link-innotech"
        aria-label="INNOTECH home"
      >
        <span className="inlearn-brand-mark inlearn-brand-mark-wide" aria-hidden="true" />
        <span className="inlearn-brand-tip" aria-hidden="true">INNOTECH</span>
      </Link>
    </div>
  );
}

export default InlearnBrand;
