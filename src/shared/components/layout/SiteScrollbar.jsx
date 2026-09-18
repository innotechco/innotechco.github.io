import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

/* The site's own scrollbar.

   The browser's is hidden (see styles/scrollbar.css) and this draws the one
   that replaces it: a hairline rail down the right edge with a green thumb on
   it. Because it is ours, it has to earn back every habit the browser's bar
   had, and all of them are here:

     - the thumb follows the page, and takes as much of the rail as the window
       takes of the document
     - dragging the thumb scrolls, and keeps hold while the pointer wanders off
       sideways or past either end of the rail
     - pressing the rail above or below the thumb moves by one screen, which is
       what pressing a native track does
     - a press that lands where the thumb already is grabs it rather than paging
     - the wheel, the keyboard, Home, End, anchor links and the middle-click
       autoscroll are untouched: the page still scrolls the ordinary way and
       this only watches it

   It renders on every device and the stylesheet hides it where there is no
   pointer to reach it. That is deliberate: deciding in JavaScript meant the
   whole thing mounted and unmounted as the answer changed, and the listeners
   went with it. */

/* Short enough to stay out of the way on a long page, tall enough to catch. */
const MIN_THUMB = 48;

function SiteScrollbar() {
  const [metrics, setMetrics] = useState({height: 0, top: 0, canScroll: false});
  const [isDragging, setIsDragging] = useState(false);
  const railRef = useRef(null);
  const drag = useRef(null);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const railHeight = rail.clientHeight;
    const viewport = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollable = documentHeight - viewport;

    /* A page that fits on the screen has nothing to scroll, and a rail with a
       thumb filling it end to end says "there is more" when there is not. */
    if (scrollable <= 1 || railHeight <= 0) {
      setMetrics((current) =>
        current.canScroll ? {height: 0, top: 0, canScroll: false} : current,
      );
      return;
    }

    const height = Math.max(MIN_THUMB, (viewport / documentHeight) * railHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));

    setMetrics({
      height,
      /* Down the room the thumb does not itself take, so it meets the bottom of
         the rail exactly when the page reaches its end. */
      top: progress * (railHeight - height),
      canScroll: true,
    });
  }, []);

  /* Measured before the browser paints, so the thumb is never drawn at the
     wrong size for a frame first. */
  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    /* Straight through to measure, with no frame booked in between.

       There was a requestAnimationFrame here to keep the work down, and it was
       a bug: a frame booked while the tab is in the background never arrives,
       and because the booking was remembered, every later request was dropped
       as "one is already pending" - the bar then sat at the size it had when
       the page was still empty. Setting the same value again costs nothing:
       React compares and bails out of the re-render itself. */
    window.addEventListener("scroll", measure, {passive: true});
    window.addEventListener("resize", measure);

    /* The page grows and shrinks on its own - pictures arrive, a section
       expands, a route changes - and none of that fires scroll or resize. */
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [measure]);

  /* The drag lives on the window, not on the thumb.

     A drag that only listens on the thumb ends the moment the pointer leaves
     it, and a hand dragging a thin line leaves it constantly - which is exactly
     how it failed. Pointer capture is still asked for, but the window is what
     makes the grip reliable: the pointer can wander anywhere, or past the ends
     of the rail, and the page keeps following it until the button comes up. */
  useEffect(() => {
    if (!isDragging) return undefined;

    const onMove = (event) => {
      const start = drag.current;
      if (!start) return;

      const travel = start.railHeight - start.thumbHeight;
      if (travel <= 0) return;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      /* The thumb crosses `travel` pixels while the page crosses its whole
         length, so one pixel of pointer is that share of the page. */
      const moved = ((event.clientY - start.pointerY) / travel) * scrollable;

      /* "instant" on purpose: html carries scroll-behavior: smooth for anchor
         links, and under a drag that turns every move into an animation
         chasing the pointer - the thumb visibly lags the hand holding it. */
      window.scrollTo({top: start.scrollY + moved, behavior: "instant"});
    };

    const stop = () => {
      drag.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    /* Without this the page selects text under the pointer as it drags, and the
       drag leaves half the page highlighted behind the bar. */
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const startDrag = (event) => {
    /* Left button only: a right-click on a scrollbar belongs to the browser's
       own menu, and the middle one is the autoscroll. */
    if (event.button !== 0) return;

    event.preventDefault();
    /* The rail is listening underneath for a press that should page the view.
       This press landed on the thumb, so it is a grab, not a page. */
    event.stopPropagation();

    drag.current = {
      pointerY: event.clientY,
      scrollY: window.scrollY,
      railHeight: railRef.current?.clientHeight ?? 0,
      thumbHeight: metrics.height,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  };

  /* Pressing the rail itself, above or below the thumb: one screen in that
     direction. Smoothly, because this movement is the answer to a single press
     rather than something following a hand. */
  const pageScroll = (event) => {
    const rail = railRef.current;
    if (!rail || !metrics.canScroll || event.button !== 0) return;

    const pressed = event.clientY - rail.getBoundingClientRect().top;
    const direction = pressed < metrics.top ? -1 : 1;

    window.scrollTo({
      top: window.scrollY + direction * window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={railRef}
      className={`site-scrollbar${metrics.canScroll ? "" : " is-idle"}${
        isDragging ? " is-dragging" : ""
      }`}
      /* Decoration over a page that is already scrollable by wheel and
         keyboard: a screen reader has nothing to gain from it, and a tab stop
         here would be a control that goes nowhere. */
      aria-hidden="true"
      onPointerDown={pageScroll}
    >
      {/* What the pointer grabs is the full width of the rail; the green line
          is drawn inside it. Five pixels is the right width for a line and the
          wrong one for something a hand has to catch. */}
      <div
        className="site-scrollbar-grip"
        style={{
          height: `${metrics.height}px`,
          transform: `translate3d(0, ${metrics.top}px, 0)`,
        }}
        onPointerDown={startDrag}
      >
        <span className="site-scrollbar-thumb" />
      </div>
    </div>
  );
}

export default SiteScrollbar;
