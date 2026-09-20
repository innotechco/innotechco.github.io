import {useContactAction} from "../../../../../app/providers/contact-actions/useContactAction.js";

/* "Learn more about our learning solutions": the four sentences on the left,
   the photograph on the right, and the button that opens the site's own contact
   form.

   The form is the shared one the rest of the site uses, not a second copy with
   the same fields. It arrives in the light theme without being asked to,
   because INLEARN holds the whole site in light while it is open - see
   InlearnAcademy.jsx. */
function LearningSolutionsSection({learningSolutions}) {
  const openContact = useContactAction();

  if (!learningSolutions) return null;

  return (
    <section className="inlearn-solutions" aria-labelledby="inlearn-solutions-title">
      <div className="inlearn-solutions-grid">
        {/* The words come first in the markup, and the picture follows. On a
            phone the stylesheet lifts the picture above them, which is the
            order the design draws there - but a screen reader and a search
            engine both get the heading first either way. */}
        <div className="inlearn-solutions-copy">
          <h2 id="inlearn-solutions-title" className="inlearn-section-title">
            {learningSolutions.title}
          </h2>

          <div className="inlearn-solutions-points">
            {learningSolutions.points.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>

          <button
            type="button"
            className="inlearn-solutions-cta"
            onClick={() => openContact("inlearn-learning-solutions")}
          >
            {learningSolutions.cta}
          </button>
        </div>

        <div className="inlearn-solutions-media">
          <img
            src={learningSolutions.image}
            alt={learningSolutions.imageAlt || ""}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default LearningSolutionsSection;
