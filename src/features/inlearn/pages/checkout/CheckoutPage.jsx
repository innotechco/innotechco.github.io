import {useSyncExternalStore} from "react";
import {Link} from "react-router-dom";

import Price from "../course/CoursePrice.jsx";
import {getBasket, getServerBasket, subscribeToBasket} from "../../services/basket.js";
import {getInlearnBasket} from "../../inlearnContent.js";
import {routes} from "../../../../app/routes.js";

/* The place the Purchase button goes, and nothing more.

   It exists so the road out of the basket is a real address rather than a
   dead button, and so that the day a gateway is chosen there is already a page
   to put it on. It takes no card details, asks for nothing, and says plainly
   that nothing has been charged - a checkout that looks finished but is not is
   the worst thing this page could be.

   It lists what is in the basket so the visitor can see the order survived the
   trip, and the total is the same display total the basket shows: computed for
   reading, never for charging. */
function CheckoutPage() {
  const lines = useSyncExternalStore(subscribeToBasket, getBasket, getServerBasket);
  const {copy, items, currency, grandTotal} = getInlearnBasket(lines);

  return (
    <div className="inlearn-basket inlearn-checkout">
      <h1 className="inlearn-section-title inlearn-basket-title">{copy.checkoutTitle}</h1>

      <p className="inlearn-checkout-body">{copy.checkoutBody}</p>

      {items.length ? (
        <>
          <h2 className="inlearn-checkout-subheading">{copy.checkoutItems}</h2>
          <ul className="inlearn-checkout-list">
            {items.map((course) => (
              <li key={course.id}>
                <span>{course.title}</span>
                <Price amount={course.price} currency={currency} />
              </li>
            ))}
          </ul>

          <dl className="inlearn-basket-total inlearn-checkout-total">
            <dt className="is-grand">{copy.grandTotal}</dt>
            <dd className="is-grand">
              <Price amount={grandTotal} currency={currency} className="is-large" />
            </dd>
          </dl>
        </>
      ) : (
        <p className="inlearn-basket-empty-hint">{copy.empty}</p>
      )}

      <Link className="inlearn-hero-cta inlearn-checkout-back" to={routes.inlearnBasket}>
        {copy.checkoutBack}
      </Link>
    </div>
  );
}

export default CheckoutPage;
