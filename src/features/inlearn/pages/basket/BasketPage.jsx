import {useEffect, useState, useSyncExternalStore} from "react";
import {Link, useNavigate} from "react-router-dom";

import BasketRow from "./BasketRow.jsx";
import SignInRequiredDialog from "./SignInRequiredDialog.jsx";
import Price from "../course/CoursePrice.jsx";
import {
  getBasket,
  getServerBasket,
  removeFromBasket,
  removeManyFromBasket,
  restoreToBasket,
  subscribeToBasket,
} from "../../services/basket.js";
import {getInlearnBasket} from "../../inlearnContent.js";
import {placeOrder, quoteBasket} from "../../services/shop.js";
import {routes} from "../../../../app/routes.js";

/* The basket, and the whole of buying.
 *
 * There is no second page. A checkout that only repeated this list and carried
 * one button was a step between somebody deciding to buy and buying, and the
 * step did nothing - so the code goes in here and Purchase finishes the order
 * from here.
 *
 * What this page still never does is decide what anything costs. The basket
 * holds ids; the server is handed those ids and answers with the subtotal,
 * what the code takes off and what is left to pay. A price that travels
 * through the browser is a price a visitor can edit.
 */

/* What the server says about a code, in words. The states are its, not this
   page's, so a code that has been switched off reads differently from one that
   was never real. */
const CODE_NOTES = {
  unknown: "We do not recognise that code.",
  expired: "That code has expired.",
  inactive: "That code is no longer being accepted.",
};

function BasketPage({session, onAuthOpen, onToast}) {
  const lines = useSyncExternalStore(subscribeToBasket, getBasket, getServerBasket);
  const {copy, items, currency, subtotal, tax, grandTotal} = getInlearnBasket(lines);
  const navigate = useNavigate();

  /* The basket as one comparable value: the same courses in the same order are
     the same question to ask the server. */
  const ids = items.map((course) => course.id).join(",");

  const [code, setCode] = useState("");
  /* The code that has been sent, as opposed to the one being typed. Quoting on
     every keystroke would tell somebody their code is wrong before they have
     finished writing it. */
  const [appliedCode, setAppliedCode] = useState("");
  /* The answer together with what it answered, so a total can never outlive
     the basket it was worked out for. */
  const [quoted, setQuoted] = useState(null);
  const [problem, setProblem] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isAskingToSignIn, setIsAskingToSignIn] = useState(false);

  const quote = quoted && quoted.ids === ids && quoted.code === appliedCode ? quoted.data : null;

  useEffect(() => {
    if (!session || !items.length) return undefined;

    /* Dropped by the cleanup rather than checked against a mounted flag, so a
       slow answer to a basket that has since changed cannot overwrite the
       newer one it lost the race to. */
    let isCurrent = true;

    quoteBasket(items, appliedCode)
      .then((answer) => {
        if (isCurrent) setQuoted({ids, code: appliedCode, data: answer});
      })
      .catch((error) => {
        if (isCurrent) setProblem(error.message);
      });

    return () => {
      isCurrent = false;
    };
    /* items is rebuilt on every render, so ids stands in for it. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, ids, appliedCode]);

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
    setProblem("");
    setAppliedCode(code.trim());
  };

  const handlePurchase = async () => {
    /* Signed out there is nobody for the order to belong to. The reason is
       said before anything else happens - see the dialog - rather than the
       visitor simply arriving somewhere else. */
    if (!session) {
      setIsAskingToSignIn(true);
      return;
    }

    setIsWorking(true);
    setProblem("");

    try {
      const answer = await placeOrder(items, appliedCode);
      /* Only what the order actually covered leaves the basket. */
      removeManyFromBasket(answer.purchased);
      onToast?.({
        message:
          answer.order.status === "paid"
            ? `Order #${answer.order.orderNumber} is complete.`
            : `Order #${answer.order.orderNumber} is waiting for payment.`,
      });
      /* Straight to the courses rather than to the receipt: what somebody
         wants the moment they have paid is the thing they paid for. The
         invoice is in Bill for whenever they want it. */
      navigate(
        answer.order.status === "paid"
          ? routes.inlearnDashboardCourses
          : routes.inlearnDashboardBill,
      );
    } catch (error) {
      setProblem(error.message);
      setIsWorking(false);
    }
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

  /* The server's figures once it has answered, and the catalogue's until then.
     Signed out there is no answer to wait for, so the read-only sum is all
     there is - and nothing can be bought from that state anyway. */
  const shownSubtotal = quote ? quote.subtotal : subtotal;
  const shownTotal = quote ? quote.total : grandTotal;
  const shownCurrency = quote?.currency ?? currency;
  const codeNote = quote && quote.codeState !== "applied" && quote.codeState !== "none"
    ? CODE_NOTES[quote.codeState] ?? copy.discountRejected
    : "";

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
            currency={shownCurrency}
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
              autoComplete="off"
              spellCheck="false"
              onChange={(event) => {
                setCode(event.target.value);
                setProblem("");
              }}
            />
            <button type="submit" className="inlearn-basket-apply" disabled={isWorking}>
              {copy.apply}
            </button>
          </form>

          {/* A code can only be checked against the server, and the server
              wants to know who is asking. */}
          {!session ? (
            <p className="inlearn-basket-code-note">{copy.discountSignedOut}</p>
          ) : null}

          {codeNote ? (
            <p className="inlearn-basket-code-problem" role="alert">
              {codeNote}
            </p>
          ) : null}

          {quote?.codeState === "applied" ? (
            <p className="inlearn-basket-code-good">
              {quote.discountCode} applied — {quote.discountPercent}% off.
            </p>
          ) : null}

          {problem ? (
            <p className="inlearn-basket-code-problem" role="alert">
              {problem}
            </p>
          ) : null}

          <button
            type="button"
            className="inlearn-basket-purchase"
            onClick={handlePurchase}
            disabled={isWorking}
          >
            {isWorking ? copy.purchasing : copy.purchase}
          </button>
        </div>

        {/* Three lines, and the tax one is here from the start even though it
            is zero: a row that appears later is a layout nobody has checked. */}
        <dl className="inlearn-basket-total">
          <dt>{copy.subtotal}</dt>
          <dd>
            <Price amount={shownSubtotal} currency={shownCurrency} />
          </dd>

          {/* Only when there is one. A discount row reading zero on every
              other basket is noise on all of them. */}
          {quote?.discountPercent ? (
            <>
              <dt>{copy.discount}</dt>
              <dd>
                −<Price amount={quote.discountAmount} currency={shownCurrency} />
              </dd>
            </>
          ) : null}

          <dt>{copy.tax}</dt>
          <dd>
            <Price amount={tax} currency={shownCurrency} />
          </dd>

          {/* The line above the last row. A real element because it has to
              cross the gap between the two columns, which a border on either
              cell cannot do. Decoration, so it is not announced. */}
          <div className="inlearn-basket-rule" aria-hidden="true" />

          <dt className="is-grand">{copy.grandTotal}</dt>
          <dd className="is-grand">
            <Price amount={shownTotal} currency={shownCurrency} className="is-large" />
          </dd>
        </dl>
      </div>

      {isAskingToSignIn ? (
        <SignInRequiredDialog
          onClose={() => setIsAskingToSignIn(false)}
          onSignIn={() => {
            setIsAskingToSignIn(false);
            onAuthOpen?.("login");
          }}
          onRegister={() => {
            setIsAskingToSignIn(false);
            onAuthOpen?.("register");
          }}
        />
      ) : null}
    </div>
  );
}

export default BasketPage;
