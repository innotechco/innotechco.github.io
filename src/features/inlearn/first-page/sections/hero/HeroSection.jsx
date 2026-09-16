import {Link} from "react-router-dom";

import {routes} from "../../../../../app/routes.js";

/* The block above the fold: the mark, the name, the promise, and the one button
   the page is built around.

   It draws no decoration of its own - the arcs behind it belong to the page, so
   this section is only its words. */
function HeroSection({hero}) {
  return (
    <section className="inlearn-hero" aria-labelledby="inlearn-hero-title">
      {/* The mark is drawn by CSS: the file is filled white, for the dark
          navbar it belongs to, so it is used as a mask and painted with the
          brand token rather than approximated by a chain of filters. */}
      <span className="inlearn-hero-mark" aria-hidden="true" />

      <h1 id="inlearn-hero-title" className="inlearn-hero-title">
        {/* Two spans rather than two headings: it is one sentence, and only the
            first syllable is green. A second heading would tell a screen reader
            the page had two titles. */}
        <span className="inlearn-hero-title-lead">{hero.titleLead}</span>
        {hero.titleRest}
      </h1>

      <p className="inlearn-hero-subtitle">{hero.subtitle}</p>
      <p className="inlearn-hero-body">{hero.body}</p>

      <Link className="inlearn-hero-cta" to={`${routes.inlearnAcademy}/courses`}>
        {hero.cta}
      </Link>
    </section>
  );
}

export default HeroSection;
