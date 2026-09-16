/* What the copy cannot say: which image belongs where, and anything else that
   is a decision rather than a sentence.

   It is kept apart from the JSON because a translator owns the words and never
   the artwork, and the two are edited by different people on different days. */

import {firstPageArcRight, firstPageArcTopLeft} from "./inlearn.assets.js";

/* ===========================================================================
   THE TWO ARCS ON THE FIRST PAGE  -  every number you might want to move
   ===========================================================================

   Both arcs belong to the page rather than to a section: the right one begins
   beside the hero and ends level with the course list, so a section clipping
   its own overflow would cut it in half.

   Each value below is plain CSS, so anything CSS understands works:

     top     how far down it starts.       "-30vw", "120px", "10%"
     left    distance from the left edge.  set this OR right, not both
     right   distance from the right edge.
     width   how large the whole arc is.   the height follows the picture
     maxWidth  a ceiling for width, so it stops growing on a huge screen
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

export const inlearnConfig = {
  firstPage: {
    decorations: {
      topLeft: {
        src: firstPageArcTopLeft,
        top: "-30vw",
        left: "-38vw",
        width: "72vw",
        maxWidth: "1000px",
        rotate: "0deg",
        flipX: false,
        flipY: false,
        opacity: 1,
      },

      right: {
        src: firstPageArcRight,
        top: "34vw",
        right: "-26vw",
        width: "58vw",
        maxWidth: "820px",
        rotate: "0deg",
        flipX: false,
        flipY: false,
        opacity: 1,
      },
    },

    /* Below 860px wide. The arcs are pulled further off-canvas here so they
       frame the text instead of crossing it - the old hero let them run
       straight through the title on a phone. */
    decorationsOnPhone: {
      topLeft: {
        top: "-34vw",
        left: "-40vw",
        width: "110vw",
      },
      right: {
        top: "64vw",
        right: "-52vw",
        width: "104vw",
      },
    },
  },
};
