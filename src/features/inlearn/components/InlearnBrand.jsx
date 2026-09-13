import {useState} from "react";
import {Link} from "react-router-dom";

import {routes} from "../../../app/routes.js";

/* The pill rests as the INLEARN lockup. Pointing at the mark or the wording
   fades the wording out and draws the pill in, which brings the INNOTECH mark
   alongside so the two brands sit side by side - INLEARN opens the academy,
   INNOTECH goes back to innotech.global. Each mark greens under its own pointer
   and names itself in a small tag underneath.

   Opening is driven from here rather than from CSS. A :has(> *:hover) selector
   reads correctly from JS but this engine does not always recalculate style for
   it, so the pill opened and shut at random.

   The zone around the pill is what closes it, and the zone never shrinks: it
   pads out by however much the pill draws in. Closing on the pill itself is
   what made it flicker - opening pulls the pill's right edge left past the
   pointer, the pointer lands outside, it shuts, the wording comes back under
   the pointer, and it opens again, forever. Entering still requires a real
   mark or the wording, so the pill's own padding is not a trigger. */
function InlearnBrand() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = (event) => {
    /* Tabbing between the two links stays inside the pill. */
    if (event?.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return;
    setIsOpen(false);
  };

  return (
    <div
      className={`inlearn-brand-zone ${isOpen ? "is-open" : ""}`}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={close}
    >
      <div className={`inlearn-brand ${isOpen ? "is-open" : ""}`}>
        <Link
          to={routes.inlearnAcademy}
          className="inlearn-brand-link"
          aria-label="INLEARN Academy home"
          onMouseEnter={open}
          onFocus={open}
        >
          <span className="inlearn-brand-mark inlearn-brand-mark-inlearn" aria-hidden="true" />
          <span className="inlearn-brand-tip" aria-hidden="true">INLEARN</span>
        </Link>

        <span
          className="inlearn-brand-wordmark"
          aria-hidden="true"
          onMouseEnter={open}
        >
          <strong>INLEARN</strong>
          <small>BY INNOTECH</small>
        </span>

        <span className="inlearn-brand-divider" aria-hidden="true" onMouseEnter={open} />

        <Link
          to={routes.home}
          className="inlearn-brand-link inlearn-brand-link-innotech"
          aria-label="INNOTECH home"
          onMouseEnter={open}
          onFocus={open}
        >
          <span className="inlearn-brand-mark inlearn-brand-mark-wide" aria-hidden="true" />
          <span className="inlearn-brand-tip" aria-hidden="true">INNOTECH</span>
        </Link>
      </div>
    </div>
  );
}

export default InlearnBrand;
