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

export default function useCarousel(count) {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef(null);
  const gesture = useRef(null);

  /* A slide can disappear - WordPress answers with fewer posts than the bundled
     copy assumed - and an index past the end would park the track on empty
     space. Clamped while rendering rather than corrected afterwards in an
     effect: an effect would paint the wrong frame first and fix it second. */
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const go = useCallback(
    (next) => {
      if (count < 1) return;
      setIndex(Math.min(Math.max(next, 0), count - 1));
    },
    [count],
  );

  const step = useCallback(
    (delta) => {
      /* Wraps, so the last card's "next" returns to the first rather than
         leaving the arrow looking broken. */
      setIndex((current) => (count < 1 ? 0 : (current + delta + count) % count));
    },
    [count],
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
