import Price from "../course/CoursePrice.jsx";
import {GlobeIcon, OnSiteIcon} from "../../components/icons.jsx";

/* One line of the basket.

   There is no quantity control, and that is a decision rather than an
   omission: a course is bought once and watched for life, so a second copy of
   the same course is not a thing anybody can own. addToBasket already refuses
   to add one twice.

   Its own file because a basket line is its own piece of layout - a picture,
   a title, its terms and a price, arranged three ways down the widths - and
   the page that lists them should not also have to draw them. */
function BasketRow({course, currency, copy, onRemove}) {
  const isOnSite = course.mode === "on-site";

  return (
    <li className="inlearn-basket-row">
      {/* The picture and the words are one cell of the row, so that when the
          row stops being three columns on a phone the two stay side by side
          and only the price moves. */}
      <div className="inlearn-basket-info">
        <div className="inlearn-basket-media">
          <img src={course.image} alt={course.imageAlt || ""} loading="lazy" />
        </div>

        <div className="inlearn-basket-text">
          <h2 className="inlearn-basket-name">{course.title}</h2>

          {/* The same mark the course card uses: a place for a course taught
              in one, a globe for one taught over the network. */}
          {course.modeLabel ? (
            <span className="inlearn-basket-mode">
              {isOnSite ? <OnSiteIcon size={13} /> : <GlobeIcon size={13} />}
              {course.modeLabel}
            </span>
          ) : null}
        </div>
      </div>

      {/* Stacked rather than side by side: the design puts the old price
          under the new one, and in a narrow column two prices on one line are
          what pushes the row out of shape. */}
      <div className="inlearn-basket-price">
        <Price
          amount={course.price}
          compareAt={course.compareAtPrice}
          currency={currency}
          className="is-stacked"
        />
      </div>

      {/* Named for a screen reader by the course it removes, so a page of these
          does not read as a column of identical "Remove" buttons. */}
      <button
        type="button"
        className="inlearn-basket-remove"
        aria-label={`${copy.remove}: ${course.title}`}
        title={copy.remove}
        onClick={() => onRemove(course)}
      >
        <TrashIcon />
      </button>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M4 6.5h16M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5M10.2 10v7M13.8 10v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BasketRow;
