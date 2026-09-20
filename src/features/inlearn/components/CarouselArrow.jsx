import {ChevronIcon} from "./icons.jsx";

/* The arrow beside a row of cards.

   There are three rows in INLEARN - New Event, Top Essential Courses and the
   related row under a course - and each one used to carry its own copy of this
   button with the same chevron drawn inside it. Three copies of one shape is
   three places to find on the day it changes, and the day one of them is
   missed the rows stop matching each other.

   What actually differs between them is the class the stylesheet styles and
   the size of the mark, so those are the two things `kind` decides. The class
   names are kept exactly as they were: the stylesheet is not part of this
   change, and .inlearn-carousel-arrow and .inlearn-courses-arrow are styled
   separately because the event row's arrows lie over the card while the course
   rows' arrows stand beside it. */
const KINDS = {
  /* New Event: over the card, at the section's edges. */
  event: {className: "inlearn-carousel-arrow", size: 18},
  /* Top Essential Courses and the related row: beside the row. */
  courses: {className: "inlearn-courses-arrow", size: 20},
};

/* `disabled` is left off by the related row, which loops for ever and so has
   no end to stop at. A row that cannot loop passes it, because an arrow that
   is there and does nothing gets pressed and makes the page look broken. */
function CarouselArrow({kind = "courses", direction, label, disabled = false, onClick}) {
  const {className, size} = KINDS[kind];

  return (
    <button
      type="button"
      className={`${className} is-${direction}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronIcon direction={direction} size={size} />
    </button>
  );
}

export default CarouselArrow;
