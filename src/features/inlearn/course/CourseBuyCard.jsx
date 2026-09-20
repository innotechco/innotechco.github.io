import {useSyncExternalStore} from "react";

import Price from "./CoursePrice.jsx";
import {addToBasket, isInBasket, subscribeToBasket} from "../services/basket.js";

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
          <button type="button" className="inlearn-course-action" aria-label={catalogue.save} title={catalogue.save}>
            <BookmarkIcon />
          </button>
          <span className="inlearn-course-action-divider" aria-hidden="true" />
          <button type="button" className="inlearn-course-action" aria-label={catalogue.share} title={catalogue.share}>
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

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <circle cx="18" cy="5.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="18.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8.4 10.8 7.2-4.1M8.4 13.2l7.2 4.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M11.5 3.5H20v8.5l-8.7 8.7a1.5 1.5 0 0 1-2.1 0l-6.4-6.4a1.5 1.5 0 0 1 0-2.1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="16.2" cy="7.8" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default CourseBuyCard;
