import {useCallback, useRef, useState} from "react";

/* One slide at a time, moved by the arrows, by a swipe, or by the arrow keys.
 *
 * The travel itself is a CSS transition on the track's transform - the hook
 * only ever changes which index is current. Animating in JavaScript would mean
 * a frame of work per step and would ignore the visitor's reduced-motion
 * setting, which the stylesheet already honours.
 *
 * Pointer events rather than touch events: one set of handlers then covers a
 * finger, a stylus and a trackpad drag, and setPointerCapture keeps the gesture
 * attached to the element even when the finger leaves it mid-swipe.
 */

/* Far enough that a tap or a vertical scroll never counts as a swipe, short
   enough that a deliberate flick does. */
const SWIPE_THRESHOLD = 48;

export default function useCarousel(count, perView = 1) {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef(null);
  const gesture = useRef(null);

  /* The last index worth resting on: past it the track would show empty space
     where the row runs out of cards. With one card in view that is the last
     card; with four in view it is four cards from the end. */
  const maxIndex = Math.max(count - perView, 0);

  /* Slides disappear - WordPress answers with fewer posts than the bundled copy
     assumed - and the visible count changes when the window is resized, so the
     current index can fall outside the range between two renders. Clamped while
     rendering rather than corrected afterwards in an effect: an effect would
     paint the wrong frame first and fix it second. */
  const safeIndex = Math.min(index, maxIndex);

  const go = useCallback(
    (next) => {
      if (count < 1) return;
      setIndex(Math.min(Math.max(next, 0), maxIndex));
    },
    [count, maxIndex],
  );

  const step = useCallback(
    (delta) => {
      setIndex((current) => {
        if (count < 1) return 0;
        /* One card in view means every index is a whole view, so the last
           card's "next" can return to the first rather than leave the arrow
           looking broken. With several in view the ends are real ends: wrapping
           there would jump the row past cards the visitor can still see. */
        if (perView === 1) return (current + delta + count) % count;
        return Math.min(Math.max(current + delta, 0), maxIndex);
      });
    },
    [count, perView, maxIndex],
  );

  const onPointerDown = useCallback((event) => {
    /* Secondary buttons and right-clicks are not swipes. */
    if (event.button !== 0 && event.pointerType === "mouse") return;
    gesture.current = {x: event.clientX, y: event.clientY, id: event.pointerId};
  }, []);

  const onPointerMove = useCallback((event) => {
    const start = gesture.current;
    if (!start || start.captured) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    /* Claim the gesture only once it is clearly sideways. Capturing a vertical
       drag would stop the page scrolling under the visitor's finger. */
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      start.captured = true;
      event.currentTarget.setPointerCapture?.(start.id);
    }
  }, []);

  const finish = useCallback(
    (event) => {
      const start = gesture.current;
      gesture.current = null;
      if (!start) return;

      event.currentTarget.releasePointerCapture?.(start.id);
      const dx = event.clientX - start.x;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      step(dx < 0 ? 1 : -1);
    },
    [step],
  );

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else return;
      event.preventDefault();
    },
    [step],
  );

  return {
    index: safeIndex,
    maxIndex,
    viewportRef,
    go,
    step,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      onKeyDown,
      tabIndex: 0,
      role: "group",
    },
  };
}
