import {useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";
import {useNavigate} from "react-router-dom";

import Price from "../../course/CoursePrice.jsx";
import {
  addManyToBasket,
  getBasket,
  getServerBasket,
  removeManyFromBasket,
  subscribeToBasket,
} from "../../../services/basket.js";
import {deleteOrder, fetchOrders, quoteBasket} from "../../../services/shop.js";
import {useInlearnCatalogue} from "../../../useInlearnCatalogue.js";
import {getInlearnBasket} from "../../../inlearnContent.js";
import {routes} from "../../../../../app/routes.js";

/* Bill: every order this account has placed, newest first.
 *
 * It reads from the server and from nowhere else. An invoice is the one thing
 * on this site that must not be rebuilt out of the catalogue - the lines keep
 * the title and the price they were bought at, so a course that goes up in
 * price next month does not quietly rewrite what somebody paid last month.
 * That is why each line carries its own words and its own figure rather than
 * an id to look up.
 */

/* The date the way the design writes it. Deliberately not toLocaleDateString
   with no argument, which follows whatever the visitor's machine is set to and
   would put a different order on the numbers for a reader in another country -
   on an invoice, 12/06 meaning two different days is not a small thing. */
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${date.getFullYear()}`;
}

function ParcelIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 8.5 12 3.5 3 8.5v7L12 20.5l9-5z" />
      <path d="M3 8.5 12 13.5l9-5" />
      <path d="M12 13.5v7" />
      <path d="m7.5 6 9 5" />
    </svg>
  );
}

function OrderCard({order, onPurchase, onRemove}) {
  const isPaid = order.status === "paid";
  const isBasket = order.isBasket === true;
  /* Settled by a later order rather than by this one. It keeps its place in
     the list because it happened, and it offers nothing, because there is
     nothing left to pay. */
  const isCancelled = order.status === "cancelled";

  return (
    <li className={`inlearn-bill-card${isCancelled ? " is-cancelled" : ""}`}>
      <div className="inlearn-bill-head">
        <span className="inlearn-bill-mark" aria-hidden="true">
          <ParcelIcon />
        </span>

        <div className="inlearn-bill-heading">
          <h2 className="inlearn-bill-number">
            {isBasket ? "Pending order" : `Order #${order.orderNumber}`}
          </h2>
          <p className="inlearn-bill-date">
            {isBasket ? "In your shopping basket" : formatDate(order.placedAt)}
          </p>
        </div>

        {/* The state is a word, not only a colour: a red outline and a green
            one are the same outline to a reader who cannot tell them apart.

            Settled, it is a label and nothing more. Unpaid, it is the way to
            finish paying - so it becomes a real button that puts the order
            back in the basket, rather than a label with a separate control
            beside it repeating the same thing. */}
        {/* The state and the cross travel together, in a box of their own.
            Loose in the heading row they were two items aligned to its top
            edge, and the pill is taller than the cross - so the two sat at
            different heights beside each other. Grouped, they are centred
            against one another and can only ever be on one line. */}
        <div className="inlearn-bill-actions">
          {isPaid ? (
            <span className="inlearn-bill-state is-paid">Purchased Course</span>
          ) : isCancelled ? (
            <span className="inlearn-bill-state is-cancelled">
              {order.settledBy ? `Paid in #${order.settledBy}` : "Already Purchased"}
            </span>
          ) : (
            <button
              type="button"
              className="inlearn-bill-state is-pending"
              onClick={() => onPurchase(order)}
              aria-label={`Purchase order ${order.orderNumber}`}
            >
              {/* Both words are always in the box, one on top of the other,
                  so the button is as wide as the longer of them and nothing
                  beside it shifts when the pointer arrives. */}
              <span className="inlearn-bill-state-resting">Pending Payment</span>
              <span className="inlearn-bill-state-hover" aria-hidden="true">
                Purchase
              </span>
            </button>
          )}

        {/* Only where there is nothing to lose. A paid invoice is a record of
            money changing hands, so it has no cross - the server refuses to
            delete one either, and this is the half of that rule the visitor
            can see. */}
          {isPaid ? null : (
            <button
              type="button"
              className="inlearn-bill-remove"
              onClick={() => onRemove(order)}
              aria-label={`Remove order ${order.orderNumber}`}
              title="Remove this order"
            >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
            </button>
          )}
        </div>
      </div>

      <ul className="inlearn-bill-lines">
        {order.items.map((item, index) => (
          <li key={`${item.courseId}-${index}`}>
            <span className="inlearn-bill-line-title">{item.title}</span>
            <Price amount={item.price} currency={order.currency} />
          </li>
        ))}
      </ul>

      <dl className="inlearn-bill-sum">
        {/* Only when there was one. A discount line reading "0%" on every
            other invoice is noise on all of them. */}
        {order.discountPercent ? (
          <>
            <dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt>
            <dd>
              −<Price amount={order.discountAmount} currency={order.currency} />
            </dd>
          </>
        ) : null}

        <dt className="is-grand">Sum</dt>
        <dd className="is-grand">
          <Price amount={order.total} currency={order.currency} />
        </dd>
      </dl>
    </li>
  );
}

function BillSection() {
  const navigate = useNavigate();
  const basketLines = useSyncExternalStore(subscribeToBasket, getBasket, getServerBasket);
  const catalogue = useInlearnCatalogue();
  const {items: basketItems, currency: basketCurrency, subtotal: basketSubtotal} =
    getInlearnBasket(basketLines, catalogue);
  const basketIds = basketItems.map((course) => course.id).join(",");
  const [orders, setOrders] = useState([]);
  const [basketQuote, setBasketQuote] = useState(null);
  const [status, setStatus] = useState("loading");
  const [problem, setProblem] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(() => {
    fetchOrders()
      .then((answer) => {
        if (!isMounted.current) return;
        setOrders(answer);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted.current) return;
        setProblem(error.message);
        setStatus("error");
      });
  }, []);

  useEffect(load, [load]);

  useEffect(() => {
    if (!basketItems.length) return undefined;

    let isCurrent = true;
    quoteBasket(basketItems, "")
      .then((answer) => {
        if (isCurrent) setBasketQuote({ids: basketIds, answer});
      })
      .catch(() => {
        if (isCurrent) setBasketQuote(null);
      });
    return () => {
      isCurrent = false;
    };
    // basketIds is the stable identity of basketItems.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketIds]);

  const basketOrder = useMemo(() => {
    if (!basketItems.length) return null;
    const quote = basketQuote?.ids === basketIds ? basketQuote.answer : null;
    const items = quote?.items ?? basketItems.map((course) => ({
      courseId: course.id,
      title: course.title,
      price: course.price ?? 0,
    }));
    return {
      id: "basket-pending",
      isBasket: true,
      orderNumber: "Pending",
      placedAt: new Date().toISOString(),
      status: "pending",
      currency: quote?.currency ?? basketCurrency,
      items,
      subtotal: quote?.subtotal ?? basketSubtotal,
      discountPercent: 0,
      discountCode: "",
      discountAmount: 0,
      total: quote?.total ?? basketSubtotal,
    };
  }, [basketCurrency, basketIds, basketItems, basketQuote, basketSubtotal]);

  const retry = () => {
    setStatus("loading");
    setProblem("");
    load();
  };

  /* Taking an unpaid order back to the till.
   *
   * The courses go into the basket and the visitor goes with them, rather than
   * this page trying to charge anything itself: the basket is where a code is
   * entered and where buying happens, and two places that can both place an
   * order is how the two start to disagree. The old order is left exactly as
   * it is - nothing was paid, so there is nothing about it to change, and
   * finishing the purchase writes an order of its own. */
  const purchaseAgain = (order) => {
    addManyToBasket(order.items.map((item) => item.courseId));
    navigate(routes.inlearnBasket);
  };

  /* Taking an order off the list.
   *
   * The row goes as soon as the server says it has gone, not before: an
   * invoice that disappears and comes back because the request failed is
   * worse than one that takes a moment to leave. */
  const removeOrder = async (order) => {
    setProblem("");
    if (order.isBasket) {
      removeManyFromBasket(order.items.map((item) => item.courseId));
      return;
    }
    try {
      await deleteOrder(order.id);
      removeManyFromBasket(order.items.map((item) => item.courseId));
      setOrders((current) => current.filter((entry) => entry.id !== order.id));
    } catch (error) {
      setProblem(error.message);
    }
  };

  if (status === "error") {
    return (
      <section className="inlearn-bill" aria-label="Bill">
        <div className="inlearn-bill-notice">
          <p className="inlearn-bill-problem" role="status">
            {problem}
          </p>
          <button type="button" className="inlearn-bill-retry" onClick={retry}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (status === "loading") {
    return (
      <section className="inlearn-bill" aria-label="Bill">
        <p className="inlearn-bill-notice" role="status">
          Loading your orders…
        </p>
      </section>
    );
  }

  const shownOrders = basketOrder ? [basketOrder, ...orders] : orders;

  if (!shownOrders.length) {
    return (
      <section className="inlearn-bill inlearn-bill-empty" aria-labelledby="bill-empty-title">
        <h1 id="bill-empty-title">No orders yet</h1>
        <p>Courses you buy will be listed here with their receipt.</p>
      </section>
    );
  }

  return (
    <section className="inlearn-bill" aria-label="Bill">
      <ul className="inlearn-bill-list">
        {shownOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPurchase={purchaseAgain}
            onRemove={removeOrder}
          />
        ))}
      </ul>
    </section>
  );
}

export default BillSection;
