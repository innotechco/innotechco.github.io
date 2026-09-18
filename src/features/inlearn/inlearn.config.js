/* What the copy cannot say: which image belongs where, and anything else that
   is a decision rather than a sentence.

   It is kept apart from the JSON because a translator owns the words and never
   the artwork, and the two are edited by different people on different days. */

import {
  coursePlaceholder,
  firstPageArcRight,
  firstPageArcTopLeft,
  learningSolutionsPlaceholder,
} from "./inlearn.assets.js";

/* ===========================================================================
   THE TWO ARCS ON THE FIRST PAGE  -  every number you might want to move
   ===========================================================================

   Both arcs belong to the page rather than to a section: the right one begins
   beside the hero and ends level with the course list, so a section clipping
   its own overflow would cut it in half.

   Each value below is plain CSS, so anything CSS understands works:

     top     how far down it starts.       "-30vw", "120px", "10%"
             (how BIG an arc is lives in arcSize, further down -
              this block only decides where it sits)
     left    distance from the left edge.  set this OR right, not both
     right   distance from the right edge.
     rotate  turns it.                     "0deg", "45deg", "-90deg"
     flipX   mirrors it left to right.     true / false
     flipY   mirrors it top to bottom.     true / false
     opacity how solid it is.              1 is full, 0.5 is half

   vw means "percent of the window width", so an arc written in vw keeps its
   proportion to the page on every screen. A value in px stays the same size
   whatever the screen, which is usually not what a background shape wants.

   Negative top or left pushes the arc off the edge, which is how most of these
   shapes are meant to sit - only part of the circle is ever on screen.

   The phone layout has its own numbers, further down.
   =========================================================================== */

/* ===========================================================================
   COURSE PICTURES  -  which photograph belongs to which course
   ===========================================================================

   Keyed by the course id in src/content/<locale>/pages/inlearn/first-page.json,
   because a course keeps its id when its title is rewritten or translated.

   Every course points at the same placeholder today. To give one its own
   picture: drop the file in assets/courses/, export it from inlearn.assets.js,
   and name it on that course's line here. A course with no line falls back to
   the placeholder rather than rendering an empty frame.
   =========================================================================== */

export const courseImages = {
  "innovations-in-teamwork": coursePlaceholder,
  "lpg-patent-landscape": coursePlaceholder,
  "industrial-ai-foundations": coursePlaceholder,
  "energy-transition-strategy": coursePlaceholder,
  "digital-twin-operations": coursePlaceholder,
  "supply-chain-resilience": coursePlaceholder,
  "process-safety-leadership": coursePlaceholder,
  "materials-for-harsh-environments": coursePlaceholder,
  "advanced-materials-testing": coursePlaceholder,
  "hydrogen-economy-fundamentals": coursePlaceholder,
  "patent-analytics-for-rnd": coursePlaceholder,
  "battery-manufacturing-quality": coursePlaceholder,
  "smart-grid-operations": coursePlaceholder,
  "clinical-data-governance": coursePlaceholder,
  "semiconductor-supply-strategy": coursePlaceholder,
  "mining-automation-safety": coursePlaceholder,
};

export const courseImageFallback = coursePlaceholder;

/* The photograph beside "Learn more about our learning solutions". One line,
   because there is one picture: swap the import and this section has its
   photograph, with nothing else to change. */
export const learningSolutionsImage = learningSolutionsPlaceholder;

/* ===========================================================================
   HOW BIG THE TWO ARCS ARE  -  the only numbers to touch to resize them
   ===========================================================================

   One number per arc per screen. Making a number bigger makes that arc bigger
   and nothing else: it keeps its top edge and its outer edge where they are and
   grows inwards and downwards from them, so an arc never moves up or down the
   page because you resized it.

   The unit is vw, which is "percent of the window's width", so an arc keeps its
   proportion to the page on every screen in its band. `max` is a ceiling in
   pixels that stops an arc growing for ever on a very wide monitor.

   The three bands are the same ones the page's layout uses:

     phone     below 640px
     tablet    640px to 1023px
     desktop   1024px and up
   =========================================================================== */

export const arcSize = {
  topLeft: {
    phone: "84vw",
    tablet: "76vw",
    desktop: "72vw",
    max: "1000px",
  },

  right: {
    phone: "80vw",
    tablet: "70vw",
    desktop: "58vw",
    max: "820px",
  },
};

export const inlearnConfig = {
  firstPage: {
    decorations: {
      topLeft: {
        src: firstPageArcTopLeft,
        top: "-30vw",
        left: "-38vw",
        rotate: "0deg",
        flipX: false,
        flipY: false,
        opacity: 1,
      },

      right: {
        src: firstPageArcRight,
        /* In pixels, not vw, and on purpose.

           vw ties a distance to the WIDTH of the window. The hero above this
           arc takes its height from min(760px, 88vh), which has nothing to do
           with the width - so as the window was made narrower the arc climbed
           the page, drifting against the section it is meant to sit beside.

           Its width stays in vw: the arc should still get smaller with the
           window, it should just stop wandering up and down while it does. */
        top: "520px",
        right: "-26vw",
        rotate: "0deg",
        flipX: false,
        flipY: false,
        opacity: 1,
      },
    },

    /* Below 860px wide. The arcs are pulled further off-canvas here so they
       frame the text instead of crossing it - the old hero let them run
       straight through the title on a phone. */
    /* Below 1024px - the same line the size bands use. Only the sideways
       offsets change here.

       Everything else - how far down each arc sits, and how big it is - is
       inherited from the set above, and that is the point: when this set had its
       own top and its own width, an arc jumped up the page and changed size the
       moment the window crossed 860. Same arc, same page, two different places
       depending on a pixel of window width.

       What does have to change is how far off the side they sit. The words are
       centred and nearly full width on a phone, so an arc that clears them on a
       monitor lies across them here; pushing each one further out by its own
       edge keeps the same shape in the same place, with less of it on screen. */
    decorationsOnSmallScreens: {
      topLeft: {
        left: "-48vw",
      },
      right: {
        right: "-30vw",
      },
    },
  },
};
