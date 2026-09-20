import {useState, useSyncExternalStore} from "react";
import {Link, useNavigate} from "react-router-dom";

import BasketRow from "./BasketRow.jsx";
import Price from "../course/CoursePrice.jsx";
import {
  getBasket,
  getServerBasket,
  removeFromBasket,
  restoreToBasket,
  subscribeToBasket,
} from "../../services/basket.js";
import {getInlearnBasket} from "../../inlearnContent.js";
import {routes} from "../../../../app/routes.js";

/* The basket.

   It reads the basket where it lives rather than copying it into state:
   useSyncExternalStore means a course added from a card, from a course page or
   from another tab shows up here without this page having to be told.

   What it never does is decide what anything costs. The numbers on screen are
   added up for the visitor to read; the day Strapi arrives it is handed the
   ids and works out the real total. A price that travels through the browser
   is a price a visitor can edit. */
function BasketPage({onToast}) {
  const lines = useSyncExternalStore(subscribeToBasket, getBasket, getServerBasket);
  const {copy, items, currency, total} = getInlearnBasket(lines);
  const navigate = useNavigate();

  /* Discount codes have no server to check them against yet, so the field is
     here and honest about it rather than accepting anything typed into it. */
  const [code, setCode] = useState("");
  const [codeProblem, setCodeProblem] = useState("");

  const handleRemove = (course) => {
    /* Where it was, not just what it was: undo has to put the line back in its
       own place, or "undo" quietly reorders the basket. */
    const index = lines.findIndex((line) => line.id === course.id);
    removeFromBasket(course.id);

    onToast?.({
      message: copy.removed,
      action: {
        label: copy.undo,
        run: () => {
          restoreToBasket(course.id, index);
          onToast?.({message: copy.restored});
        },
      },
    });
  };

  const handleApply = (event) => {
    event.preventDefault();
    setCodeProblem(code.trim() ? copy.discountRejected : copy.discountComing);
  };

  if (!items.length) {
    return (
      <div className="inlearn-basket">
        <h1 className="inlearn-section-title inlearn-basket-title">{copy.title}</h1>
        {/* Said in the middle of the page rather than left as a blank space,
            and it says what to do next. */}
        <div className="inlearn-basket-empty">
          <p>{copy.empty}</p>
          <p className="inlearn-basket-empty-hint">{copy.emptyHint}</p>
          <Link className="inlearn-hero-cta" to={routes.inlearnCourses}>
            {copy.browse}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="inlearn-basket">
      <h1 className="inlearn-section-title inlearn-basket-title">{copy.title}</h1>

      {/* A heading row, not a <table>: every line is a card on a phone, and a
          table that has to become a stack on small screens fights its own
          markup the whole way. The two labels are hidden where the columns
          stop existing. */}
      <div className="inlearn-basket-head" aria-hidden="true">
        <span>{copy.columnReport}</span>
        <span>{copy.columnPrice}</span>
      </div>

      <ul className="inlearn-basket-list">
        {items.map((course) => (
          <BasketRow
            key={course.id}
            course={course}
            currency={currency}
            copy={copy}
            onRemove={handleRemove}
          />
        ))}
      </ul>

      <div className="inlearn-basket-foot">
        <div className="inlearn-basket-discount">
          <form onSubmit={handleApply} noValidate>
            <input
              type="text"
              value={code}
              placeholder={copy.discountPlaceholder}
              aria-label={copy.discountPlaceholder}
              onChange={(event) => {
                setCode(event.target.value);
                setCodeProblem("");
              }}
            />
            <button type="submit" className="inlearn-basket-apply">
              {copy.apply}
            </button>
          </form>

          {codeProblem ? (
            <p className="inlearn-basket-code-problem" role="alert">
              {codeProblem}
            </p>
          ) : null}

          <button
            type="button"
            className="inlearn-basket-purchase"
            onClick={() => navigate(routes.inlearnCheckout)}
          >
            {copy.purchase}
          </button>
        </div>

        {/* One line. There is nothing to deliver and nothing to add on, so a
            subtotal that always equals the total would be a row that never
            says anything. */}
        <dl className="inlearn-basket-total">
          <dt>{copy.total}</dt>
          <dd>
            <Price amount={total} currency={currency} className="is-large" />
          </dd>
        </dl>
      </div>
    </div>
  );
}

export default BasketPage;
