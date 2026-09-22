import {useSyncExternalStore} from "react";

import Price from "./CoursePrice.jsx";
import {addToBasket, isInBasket, subscribeToBasket} from "../../services/basket.js";
import {BookmarkIcon, ShareIcon, TagIcon} from "../../components/icons.jsx";
import {
  getServerSavedCourses,
  getSavedCourses,
  subscribeToSavedCourses,
  toggleSavedCourse,
} from "../../services/savedCourses.js";
import {copyCourseLink} from "../../services/courseShare.js";

/* The picture, the price and the one button the page is built around.

   It sits in its own column on a wide screen and sticks to the top as the
   reading column scrolls past, so the price and the button are reachable
   wherever the visitor has got to. On a phone it comes straight after the
   title, because the price is the first thing anybody asks. */
function CourseBuyCard({course, catalogue}) {
  const labels = catalogue.detail;
  /* The basket is a store outside React - it lives in this device's storage and
     changes from anywhere on the page, or from another tab. useSyncExternalStore
     is the way React reads such a thing: it subscribes, re-reads on every
     change, and never leaves this button showing a state the basket has
     already left. An effect that copied it into state would be one render
     behind and would say so in the lint. */
  const inBasket = useSyncExternalStore(
    subscribeToBasket,
    () => isInBasket(course.id),
    () => false,
  );
  const savedIds = useSyncExternalStore(
    subscribeToSavedCourses,
    getSavedCourses,
    getServerSavedCourses,
  );
  const isSaved = savedIds.includes(course.id);

  return (
    <aside className="inlearn-buy" aria-label={course.title}>
      <div className="inlearn-buy-media">
        {/* The largest thing on the page and the first one looked at, so it is
            asked for at once rather than waiting behind everything else. */}
        <img src={course.image} alt={course.imageAlt || ""} fetchPriority="high" />

        {/* The same two controls the cards carry, in the same green panel -
            except here they are always on show, because there is no hover to
            reveal them on a page the visitor has already opened. */}
        <div className="inlearn-buy-actions">
          <button
            type="button"
            className={`inlearn-course-action${isSaved ? " is-on" : ""}`}
            aria-label={catalogue.save}
            aria-pressed={isSaved}
            title={catalogue.save}
            onClick={() => toggleSavedCourse(course.id)}
          >
            <BookmarkIcon filled={isSaved} />
          </button>
          <span className="inlearn-course-action-divider" aria-hidden="true" />
          <button
            type="button"
            className="inlearn-course-action"
            aria-label={catalogue.share}
            title={catalogue.share}
            onClick={() => copyCourseLink(window.location.href)}
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      <p className="inlearn-buy-price">
        <TagIcon />
        <span className="inlearn-buy-price-label">{labels.priceTag}</span>
        <Price
          amount={course.price}
          compareAt={course.compareAtPrice}
          currency={catalogue.currency}
          className="is-large"
        />
      </p>

      {/* One press adds it; a second does nothing, because a course is bought
          once and watched for life - there is no second copy to own. The button
          says which of the two states it is in rather than going quiet. */}
      <button
        type="button"
        className={`inlearn-buy-button${inBasket ? " is-in" : ""}`}
        onClick={() => addToBasket(course.id)}
        disabled={inBasket}
      >
        {inBasket ? labels.inBasket : labels.addToCart}
      </button>
    </aside>
  );
}

export default CourseBuyCard;
